import { adminAuth } from "@/lib/firebase/admin";
import { cookies, headers } from "next/headers";
export type { Role } from '@/lib/types/firestore';

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
      console.log('Token lookup in cookie. Found:', !!token);
    }

    if (!token || token === 'undefined' || token === 'null') {
      console.log('No valid Firebase token found in headers or cookies (found:', token, ')');
      return null;
    }

    console.log('Verifying Firebase ID token with admin SDK...');
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
    const decodedToken = await adminAuth.verifyIdToken(token);
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
    const message = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string })?.code;
    const stack = error instanceof Error ? error.stack : undefined;

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
