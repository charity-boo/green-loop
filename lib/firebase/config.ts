import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app: FirebaseApp = firebaseConfig.apiKey
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : (null as unknown as FirebaseApp);

// Get Firestore instance
export const db: Firestore = (app && firebaseConfig.apiKey)
  ? getFirestore(app)
  : (null as unknown as Firestore);

// Initialize multi-tab persistence for offline support
if (typeof window !== 'undefined' && db && firebaseConfig.apiKey) {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence is not supported by this browser');
    }
  });
}

// Get Auth instance
export const auth: Auth = (app && firebaseConfig.apiKey)
  ? getAuth(app)
  : (null as unknown as Auth);

// Get Storage instance
export const storage: FirebaseStorage = (app && firebaseConfig.apiKey)
  ? getStorage(app)
  : (null as unknown as FirebaseStorage);

const useFirebaseEmulators =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false';

const globalForEmulatorConnection = globalThis as typeof globalThis & {
  __firebaseEmulatorsConnected?: boolean;
};

if (typeof window !== 'undefined' && app && firebaseConfig.apiKey && useFirebaseEmulators && !globalForEmulatorConnection.__firebaseEmulatorsConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  globalForEmulatorConnection.__firebaseEmulatorsConnected = true;
}

// Initialize analytics only on the client
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && app && firebaseConfig.apiKey) {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
