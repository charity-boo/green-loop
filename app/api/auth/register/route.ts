import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { userRegistrationSchema } from '@/lib/validation/schemas'
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response'
import { handleApiError } from '@/lib/api-handler'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validation = userRegistrationSchema.safeParse(body)

    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { name, email, password } = validation.data

    // Check if Firebase Admin is properly initialized
    if (!adminAuth.createUser || !adminDb.collection) {
      console.error('Firebase Admin is not initialized. Check your environment variables (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).');
      return createErrorResponse('Authentication service is currently unavailable', undefined, 503);
    }

    try {
      // Create Firebase Auth user
      const userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: name,
      });

      // Set default role as USER in custom claims
      await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'USER' });

      // Create user document in Firestore
      await adminDb.collection('users').doc(userRecord.uid).set({
        id: userRecord.uid,
        name,
        email,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        id: userRecord.uid,
        name,
        email,
        role: 'USER',
      });
    } catch (firebaseError: unknown) {
      if (typeof firebaseError === 'object' && firebaseError !== null && 'code' in firebaseError && firebaseError.code === 'auth/email-already-exists') {
        return createErrorResponse('Email already exists', undefined, 400);
      }
      throw firebaseError;
    }
  } catch (error) {
    return handleApiError(error, "POST /api/auth/register");
  }
}
