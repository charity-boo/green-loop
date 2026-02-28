/**
 * CLI script to assign a role to a user by email.
 *
 * Usage:
 *   npx tsx scripts/set-user-role.ts <email> <role>
 *
 * Roles: USER | ADMIN | COLLECTOR
 *
 * Example:
 *   npx tsx scripts/set-user-role.ts admin@example.com ADMIN
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env then .env.local (local overrides)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Point to emulators (matches lib/firebase/admin.ts dev behaviour)
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

import * as admin from 'firebase-admin';

const [, , email, role] = process.argv;

const VALID_ROLES = ['USER', 'ADMIN', 'COLLECTOR'];

if (!email || !role) {
  console.error('Usage: npx tsx scripts/set-user-role.ts <email> <role>');
  console.error('Roles:', VALID_ROLES.join(' | '));
  process.exit(1);
}

if (!VALID_ROLES.includes(role)) {
  console.error(`Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}`);
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId) {
  console.error('Missing FIREBASE_PROJECT_ID in .env or .env.local');
  process.exit(1);
}

// Init with service account if available, otherwise use Application Default Credentials
if (clientEmail && privateKey) {
  admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  console.log('Initialized with service account credentials');
} else {
  admin.initializeApp({ projectId });
  console.log('Initialized with Application Default Credentials (project:', projectId, ')');
}

const auth = admin.auth();
const db = admin.firestore();

async function main() {
  console.log(`\nLooking up user: ${email}`);

  const userRecord = await auth.getUserByEmail(email);
  console.log(`Found user: ${userRecord.uid} (${userRecord.displayName || 'no name'})`);
  console.log(`Current claims:`, userRecord.customClaims ?? 'none');

  // Set Firebase custom claim
  await auth.setCustomUserClaims(userRecord.uid, { role: role.toUpperCase() });
  console.log(`✅ Firebase custom claim set: role=${role.toUpperCase()}`);

  // Sync Firestore document
  await db.collection('users').doc(userRecord.uid).set(
    { role: role.toUpperCase(), updatedAt: new Date().toISOString() },
    { merge: true }
  );
  console.log(`✅ Firestore user document updated: role=${role.toUpperCase()}`);

  console.log(`\nDone! User "${email}" is now role=${role.toUpperCase()}.`);
  console.log('The user must sign out and sign back in for the new role to take effect.\n');

  process.exit(0);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
