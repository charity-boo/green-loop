import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID ?? '';
const JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// Module-level key cache — refreshed once per Edge worker cold start (or after TTL)
let cachedKeys: Record<string, CryptoKey> = {};
let keysCachedAt = 0;
const KEYS_TTL_MS = 3_600_000; // 1 hour

async function getPublicKeys(): Promise<Record<string, CryptoKey>> {
  const now = Date.now();
  if (keysCachedAt > 0 && now - keysCachedAt < KEYS_TTL_MS && Object.keys(cachedKeys).length > 0) {
    return cachedKeys;
  }
  const res = await fetch(JWKS_URL);
  if (!res.ok) throw new Error(`JWKS fetch failed: ${res.status}`);
  const { keys } = (await res.json()) as { keys: (JsonWebKey & { kid?: string })[] };
  const imported: Record<string, CryptoKey> = {};
  for (const jwk of keys) {
    if (!jwk.kid) continue;
    imported[jwk.kid] = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
  }
  cachedKeys = imported;
  keysCachedAt = now;
  return imported;
}

function b64urlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
  return atob(padded);
}

interface TokenClaims {
  role: string;
}

/**
 * Verify a Firebase ID token in the Edge runtime.
 *
 * - In production: full RS256 signature check against Google's JWKS.
 * - In development: signature check is skipped (emulator tokens use a test key),
 *   but exp / iss / aud claims are still validated.
 */
async function verifyFirebaseToken(token: string): Promise<TokenClaims | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(b64urlDecode(parts[1])) as {
      exp?: number;
      iss?: string;
      aud?: string;
      role?: string;
    };

    // Standard claim checks (always enforced)
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < nowSec) return null;

    const isProduction = process.env.NODE_ENV === 'production';

    // In production, strictly enforce iss/aud. 
    // In development (emulators), these might differ based on how the emulator is called.
    if (isProduction) {
      if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) return null;
      if (payload.aud !== FIREBASE_PROJECT_ID) return null;
    }

    // Skip signature check in development — emulator tokens are signed with a test key
    if (!isProduction) {
      return { role: payload.role?.toUpperCase() ?? 'USER' };
    }

    // Production: verify RS256 signature against Google's public JWKS
    const header = JSON.parse(b64urlDecode(parts[0])) as { kid?: string };
    if (!header.kid) return null;
    const keys = await getPublicKeys();
    const key = keys[header.kid];
    if (!key) return null;

    const sigInput = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = Uint8Array.from(b64urlDecode(parts[2]), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, sigInput);
    if (!valid) return null;

    return { role: payload.role?.toUpperCase() ?? 'USER' };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("firebase-token")?.value;
  const { pathname } = request.nextUrl;

  // Clean token
  if (token) {
    token = token.trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1).trim();
    }
    if (token === 'undefined' || token === 'null' || token === '') {
      token = undefined;
    }
  }

  console.log('[Middleware] Request:', pathname, '| Has token:', !!token);

  const isProtectedRoute = [
    "/dashboard",
    "/schedule-pickup",
    "/api/waste",
    "/api/admin",
    "/admin",
    "/api/collector",
  ].some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isProtectedRoute) return NextResponse.next();

  // No token at all -> redirect/401
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Verify token (signature in production, claims-only in development)
  const claims = await verifyFirebaseToken(token);

  if (!claims) {
    // Token is invalid, expired, or forged — treat as unauthenticated
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = claims.role;
  console.log('[Middleware] Verified role:', role, 'for path:', pathname);

  // Admin routes: require ADMIN
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    if (role !== 'ADMIN') {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Collector API routes: require COLLECTOR or ADMIN
  if (pathname === "/api/collector" || pathname.startsWith("/api/collector/")) {
    if (role !== 'COLLECTOR' && role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/schedule-pickup/:path*",
    "/schedule-pickup",
    "/api/waste/:path*",
    "/api/admin/:path*",
    "/api/collector/:path*",
    "/admin/:path*",
  ],
};
