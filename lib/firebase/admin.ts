import * as admin from 'firebase-admin';

const DEBUG = process.env.FIREBASE_DEBUG === 'true';

const initializeFirebaseAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'green-loop-26';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const useFirebaseEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS?.trim() === 'true';

  console.log('[FirebaseAdmin] Initializing SDK...', {
    isDevelopment,
    useFirebaseEmulators,
    projectId,
    authEmulator: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    firestoreEmulator: process.env.FIRESTORE_EMULATOR_HOST
  });

  // Always set emulator variables if needed, regardless of NODE_ENV
  if (useFirebaseEmulators) {
    if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
      process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
    }
    if (!process.env.FIRESTORE_EMULATOR_HOST) {
      process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    }
    if (!process.env.FIREBASE_STORAGE_EMULATOR_HOST) {
      process.env.FIREBASE_STORAGE_EMULATOR_HOST = '127.0.0.1:9199';
    }
    if (!process.env.FIREBASE_DATABASE_EMULATOR_HOST) {
      process.env.FIREBASE_DATABASE_EMULATOR_HOST = '127.0.0.1:9000';
    }
  }

  if (projectId && clientEmail && privateKey) {
    try {
      if (DEBUG) console.log('Initializing with Service Account credentials');
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
    } catch (error) {
      console.error('Firebase admin initialization error (service account):', error);
    }
  }

  // Fallback to project ID only (useful for emulators and environments with ADC)
  try {
    if (DEBUG) console.log('Initializing with Project ID fallback');
    return admin.initializeApp({ projectId });
  } catch (error) {
    console.error('Firebase admin initialization error (fallback):', error);
  }

  return admin.app(); // Should never reach here but for type safety
};

// Initialize right away
initializeFirebaseAdmin();

// Export initialized instances
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();

// Aliases for convenience in server-side code
export const db = adminDb;
export const auth = adminAuth;
export const storage = adminStorage;

export { admin };

