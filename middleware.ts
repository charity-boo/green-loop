import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("firebase-token")?.value;
  const { pathname } = request.nextUrl;

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

  // Decode (without verifying) to extract role for routing
  const claims = decodeJwtPayload(token);
  const role = (claims?.role as string | undefined)?.toUpperCase() ?? 'USER';

  console.log('[Middleware] Decoded role from token:', role, 'for path:', pathname);

  // Admin routes: require ADMIN
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    if (role !== 'ADMIN') {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", request.url));
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
    "/dashboard/:path*",
    "/schedule-pickup/:path*",
    "/schedule-pickup",
    "/api/waste/:path*",
    "/api/admin/:path*",
    "/api/collector/:path*",
    "/admin/:path*",
  ],
};
