import { admin, adminAuth } from "@/lib/firebase/admin";
import { cookies, headers } from "next/headers";
import type { Role } from '@/types/firestore';

export type { Role };

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image: string | null;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

/**
 * Get the current user session on the server.
 */
export async function getSession(): Promise<AuthSession | null> {
  console.log('getSession() called on server-side.');
  try {
    const authHeader = (await headers()).get('Authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
      console.log('Token found in Authorization header.');
    } else {
      // Fallback to cookie (if set by client)
      const firebaseCookie = (await cookies()).get('firebase-token');
      token = firebaseCookie?.value;
    }

    if (!token || typeof token !== 'string') return null;

    // Clean token: remove quotes and whitespace
    token = token.trim();
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1).trim();
    }

    if (token === 'undefined' || token === 'null' || token === '') {
      // No token found. This is normal for unauthenticated requests.
      return null;
    }

    console.log('[getSession] Verifying token:', { 
      length: token.length, 
      preview: token.substring(0, 20) + '...',
      isAuthHeader: !!authHeader?.startsWith('Bearer ') 
    });

    if (typeof adminAuth.verifyIdToken !== 'function') {
      // Firebase Admin SDK failed to initialize (missing credentials).
      // Only allow a dev fallback when running with the Auth emulator — never in production.
      const emulatorsEnabled =
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false' &&
        !!process.env.FIREBASE_AUTH_EMULATOR_HOST;

      if (emulatorsEnabled) {
        console.warn(
          'Firebase Admin SDK not initialized but Auth emulator is configured. ' +
          'Returning null — ensure the emulator is running and the SDK can connect.',
        );
      } else {
        console.error(
          'Firebase Admin SDK is not initialized. ' +
          'Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
        );
      }
      return null;
    }

    // For emulators, skip revocation check
    const useEmulator = process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined;
    let decodedToken: admin.auth.DecodedIdToken;
    
    try {
      decodedToken = await adminAuth.verifyIdToken(token, !useEmulator);
    } catch (error) {
      // In development with emulators, if verification fails with argument-error (often due to alg: none),
      // we can try to manually decode the payload if it looks like an emulator token.
      const err = error as { code?: string };
      if (useEmulator && (err.code === 'auth/argument-error' || token.startsWith('eyJhbGciOiJub25l'))) {
        console.warn('[getSession] Admin SDK verification failed for emulator token. Attempting manual decode.');
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            const nowSec = Math.floor(Date.now() / 1000);
            if (typeof payload.exp !== 'number' || payload.exp <= nowSec) {
              console.warn('[getSession] Emulator token rejected: expired or missing exp claim.');
              return null;
            }
            // Map the minimal fields needed for the Session object
            decodedToken = {
              ...payload,
              uid: payload.user_id || payload.sub,
              role: payload.role || 'USER',
              exp: payload.exp,
              iat: payload.iat || Math.floor(Date.now() / 1000),
              iss: payload.iss,
              aud: payload.aud,
              sub: payload.sub,
            } as admin.auth.DecodedIdToken;
            console.log('[getSession] Manual decode successful for UID:', decodedToken.uid);
          } else {
            throw error; // Re-throw if parts are missing
          }
        } catch (decodeErr) {
          console.error('[getSession] Manual decode failed:', decodeErr);
          throw error; // Throw the original verification error
        }
      } else {
        throw error;
      }
    }

    const resolvedRole = (decodedToken.role?.toUpperCase() as Role) || 'USER';
    console.log('[getSession] Token verified:', {
      uid: decodedToken.uid,
      email: decodedToken.email,
      rawRoleClaim: decodedToken.role,       // what Firebase actually has in claims
      resolvedRole,                           // what the app will use
      tokenIssuedAt: new Date(decodedToken.iat * 1000).toISOString(),
      tokenExpires: new Date(decodedToken.exp * 1000).toISOString(),
      allClaims: JSON.stringify(decodedToken), // full claims for inspection
    });

    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || null,
        role: resolvedRole,
        image: decodedToken.picture || null,
      },
      expires: new Date(decodedToken.exp * 1000).toISOString(),
    };
  } catch (error) {
    // Re-throw Next.js dynamic bailout errors
    const err = error as Error & { digest?: string; code?: string };
    if (err.digest === 'DYNAMIC_SERVER_USAGE' || err.message?.includes('dynamic-server-usage')) {
      throw error;
    }

    const message = err.message || String(error);
    const code = err.code;
    const stack = err.stack;

    // Expected errors (expired/invalid tokens) - don't log as errors
    const expectedCodes = [
      'auth/id-token-expired',
      'auth/argument-error',
      'auth/invalid-id-token',
      'auth/user-token-expired'
    ];

    if (code && expectedCodes.includes(code)) {
      // This is normal for unauthenticated/expired sessions - just return null
      console.log('[getSession] Token invalid or expired (expected):', code);
      return null;
    }

    // Unexpected errors - log them for debugging
    console.error('Error verifying Firebase token in getSession():', {
      message,
      code,
      stack,
      fullError: error
    });
    if (process.env.NODE_ENV === 'development') {
      console.warn('Authentication emulator status:', {
        FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
        NEXT_PUBLIC_USE_FIREBASE_EMULATORS: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS
      });
    }
    return null;
  }
}

/**
 * Require authentication for an endpoint.
 */
export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized: No active session");
  return session;
}

/**
 * Require a specific role.
 */
export async function requireRole(requiredRole: Role): Promise<AuthSession> {
  const session = await requireAuth();
  if (session.user.role !== requiredRole && session.user.role !== 'ADMIN') {
    throw new Error(`Forbidden: Requires "${requiredRole}" role`);
  }
  return session;
}

/**
 * Check if user is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user ID if authenticated.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}

/**
 * Get the current user's role if authenticated.
 */
export async function getCurrentUserRole(): Promise<Role | null> {
  const session = await getSession();
  return session?.user.role ?? null;
}
