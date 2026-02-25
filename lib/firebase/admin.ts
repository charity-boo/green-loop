import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const resolvedProjectId = projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (projectId && clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // Handle escaped newlines in private key from environment variables
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: `https://${projectId}.firebaseio.com`,
      });
      console.log('Firebase admin initialized successfully');
    } catch (error) {
      console.error('Firebase admin initialization error', error);
    }
  } else {
    if (isDevelopment && resolvedProjectId) {
      admin.initializeApp({ projectId: resolvedProjectId });
      console.log(`Firebase admin initialized for development using project "${resolvedProjectId}"`);
    } else if (process.env.NODE_ENV === 'production') {
      console.warn('Firebase admin credentials missing in production environment');
    } else {
      console.warn('Firebase admin credentials missing, skipping initialization');
    }
  }
}

// These will be undefined if initializeApp was not called, which is fine
// as long as the code using them handles that (or if they are only used
// in parts of the app that are not reached without credentials).
export const adminAuth = admin.apps.length ? admin.auth() : {} as admin.auth.Auth;
export const adminDb = admin.apps.length ? admin.firestore() : {} as admin.firestore.Firestore;
export { admin };
