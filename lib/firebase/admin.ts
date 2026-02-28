import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const useFirebaseEmulators = isDevelopment && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false';

  console.log('Firebase Admin SDK: Starting initialization...', {
    isDevelopment,
    useFirebaseEmulators,
    hasProjectId: !!projectId,
    hasClientEmail: !!clientEmail,
    hasPrivateKey: !!privateKey,
    NODE_ENV: process.env.NODE_ENV
  });

  if (useFirebaseEmulators && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.log('Setting FIREBASE_AUTH_EMULATOR_HOST to 127.0.0.1:9099 for development');
    process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
  }

  const resolvedProjectId = projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  console.log('Resolved Project ID:', resolvedProjectId);

  if (projectId && clientEmail && privateKey) {
    try {
      console.log('Initializing Firebase admin with service account credentials');
      if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
        console.log('Detected FIREBASE_AUTH_EMULATOR_HOST:', process.env.FIREBASE_AUTH_EMULATOR_HOST);
      }
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // Handle escaped newlines in private key from environment variables
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      console.log('Firebase admin initialized successfully with service account');
    } catch (error) {
      console.error('Firebase admin initialization error (service account):', error);
    }
  } else {
    if (isDevelopment && resolvedProjectId) {
      console.log('Initializing Firebase admin for development with project ID:', resolvedProjectId);
      try {
        admin.initializeApp({ projectId: resolvedProjectId });
        console.log(`Firebase admin initialized for development using project "${resolvedProjectId}"`);
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
  console.log('Firebase admin already initialized (apps length:', admin.apps.length, ')');
}

// These will be undefined if initializeApp was not called, which is fine
// as long as the code using them handles that (or if they are only used
// in parts of the app that are not reached without credentials).
export const adminAuth = admin.apps.length ? admin.auth() : {} as admin.auth.Auth;
export const adminDb = admin.apps.length ? admin.firestore() : {} as admin.firestore.Firestore;
export { admin };
