import { getSession, AuthSession, Role } from '@/lib/auth';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export { type AuthSession };

/**
 * @deprecated Use getSession from @/lib/auth instead
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  return getSession();
}

export async function registerUser(data: { email: string; password?: string; name: string }) {
  const { email, password, name } = data;

  const userRecord = await adminAuth.createUser({
    email,
    password,
    displayName: name,
  });

  // Set default role as USER in custom claims
  await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'USER' }); // already uppercase

  // Create user document in Firestore
  const userDoc = {
    id: userRecord.uid,
    name,
    email,
    role: 'USER' as Role,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await adminDb.collection('users').doc(userRecord.uid).set(userDoc);

  return userDoc;
}
