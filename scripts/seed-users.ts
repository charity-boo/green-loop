import * as dotenv from 'dotenv';
import * as path from 'path';
import * as admin from 'firebase-admin';
import { buildDefaultSeedUsers, seedUsers } from '@/lib/admin/seed-users';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS !== 'false') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST ?? '127.0.0.1:9099';
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';
}

const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!projectId) {
  console.error('Missing FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_PROJECT_ID.');
  process.exit(1);
}

if (!admin.apps.length) {
  if (clientEmail && privateKey) {
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  } else {
    admin.initializeApp({ projectId });
  }
}

async function main() {
  const users = buildDefaultSeedUsers();
  const results = await seedUsers({ auth: admin.auth(), db: admin.firestore(), users });

  console.log('\nSeed complete:\n');
  for (const result of results) {
    const action = result.created ? 'created' : 'updated';
    console.log(
      `- ${result.email} (${result.uid}) => role=${result.role} [${action}] iamRoles=${result.iamRoles.join(',')}`,
    );
  }
  console.log('\nUsers must re-authenticate for updated custom claims to take effect.\n');
}

main().catch((error) => {
  console.error('seed-users failed:', error);
  process.exit(1);
});
