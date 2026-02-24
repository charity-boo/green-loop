import { adminAuth } from "@/lib/firebase/admin";
import { cookies, headers } from "next/headers";

export type Role = 'USER' | 'ADMIN' | 'COLLECTOR';

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

    if (!token) {
      console.log('No Firebase token found in headers or cookies.');
      return null;
    }

    console.log('Verifying Firebase ID token with admin SDK...');
    if (typeof adminAuth.verifyIdToken !== 'function') {
      console.warn('Firebase Admin SDK (adminAuth.verifyIdToken) is not initialized. Using development bypass.');

      // Development Bypass: If we're in dev and have any token, return a mock user
      if (process.env.NODE_ENV === 'development') {
        console.log('Generating mock session for development...');
        return {
          user: {
            id: 'mock-user-123',
            email: 'dev@greenloop.test',
            name: 'Development User',
            role: 'USER',
            image: null,
          },
          expires: new Date(Date.now() + 3600 * 1000).toISOString(),
        };
      }
      return null;
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Firebase ID token verified. User UID:', decodedToken.uid);

    return {
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || '',
        name: decodedToken.name || null,
        role: (decodedToken.role as Role) || 'USER',
        image: decodedToken.picture || null,
      },
      expires: new Date(decodedToken.exp * 1000).toISOString(),
    };
  } catch (error) {
    console.error('Error verifying Firebase token in getSession():', error);
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
