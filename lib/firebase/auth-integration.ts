/**
 * Firebase Authentication Integration Service
 */

import { auth as firebaseAuth } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';

export interface FirebaseAuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}

/**
 * Sign in with Email and Password
 */
export async function signInFirebase(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        const code = (error as { code: string }).code;
        if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
            // Expected auth errors; throw without logging to prevent dev error overlay
            throw error;
        }
    }
    console.error('Error signing in with Firebase:', error);
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(firebaseAuth, provider);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

/**
 * Sign out from Firebase
 */
export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(firebaseAuth);
  } catch (error) {
    console.error('Error signing out from Firebase:', error);
  }
}

/**
 * Get Firebase Auth ID token for API requests
 */
export async function getFirebaseIdToken(): Promise<string | null> {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return null;
    }

    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting Firebase ID token:', error);
    return null;
  }
}

/**
 * Verify Firebase token on the backend
 * (Implemented in API routes using Admin SDK)
 */
export async function verifyFirebaseToken(_token: string) {
  // Use adminAuth.verifyIdToken(token) on server-side
  return null;
}
