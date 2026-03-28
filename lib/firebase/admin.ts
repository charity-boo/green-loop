import * as admin from 'firebase-admin';

const DEBUG = process.env.FIREBASE_DEBUG === 'true';

// Set emulator environment variables as early as possible (before initializeApp)
if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false') {
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  }
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
  }
}

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const useFirebaseEmulators = isDevelopment && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false';

  console.log('[FirebaseAdmin] Initializing SDK...', {
    isDevelopment,
    useFirebaseEmulators,
    projectId: projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authEmulator: process.env.FIREBASE_AUTH_EMULATOR_HOST
  });

  if (DEBUG) {
    console.log('Firebase Admin SDK: Detailed checks...', {
      isDevelopment,
      useFirebaseEmulators,
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      NODE_ENV: process.env.NODE_ENV
    });
  }

  const resolvedProjectId = projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (DEBUG) console.log('Resolved Project ID:', resolvedProjectId);

  if (projectId && clientEmail && privateKey) {
    try {
      if (DEBUG) {
        console.log('Initializing Firebase admin with service account credentials');
        if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          console.log('Detected FIREBASE_AUTH_EMULATOR_HOST:', process.env.FIREBASE_AUTH_EMULATOR_HOST);
        }
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      if (DEBUG) console.log('Firebase admin initialized successfully with service account');
    } catch (error) {
      console.error('Firebase admin initialization error (service account):', error);
    }
  } else {
    if (isDevelopment && resolvedProjectId) {
      if (DEBUG) console.log('Initializing Firebase admin for development with project ID:', resolvedProjectId);
      try {
        admin.initializeApp({ projectId: resolvedProjectId });
        if (DEBUG) console.log(`Firebase admin initialized for development using project "${resolvedProjectId}"`);
      } catch (error) {
        console.error('Firebase admin initialization error (dev):', error);
      }
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('Firebase admin credentials missing in production environment');
    } else {
      console.warn('Firebase admin credentials missing, skipping initialization');
    }
  }
} else {
  if (DEBUG) console.log('Firebase admin already initialized (apps length:', admin.apps.length, ')');
}

// These will be undefined if initializeApp was not called, which is fine
// as long as the code using them handles that (or if they are only used
// in parts of the app that are not reached without credentials).
export const adminAuth = admin.apps.length ? admin.auth() : {} as admin.auth.Auth;
export const adminDb = admin.apps.length ? admin.firestore() : {} as admin.firestore.Firestore;
export const adminStorage = admin.apps.length ? admin.storage() : {} as admin.storage.Storage;

// Aliases for convenience in server-side code
export const db = adminDb;
export const auth = adminAuth;
export const storage = adminStorage;

export { admin };
