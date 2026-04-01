import type * as admin from 'firebase-admin';
import type { Role } from '@/types/firestore';

export interface SeedUserInput {
  email: string;
  name: string;
  role: Role;
  password: string;
}

export interface SeedUserResult {
  email: string;
  uid: string;
  role: Role;
  created: boolean;
  iamRoles: string[];
}

const ROLE_TO_IAM_ROLES: Record<Role, string[]> = {
  ADMIN: ['admin.platform.manage', 'admin.users.manage', 'admin.schedules.manage'],
  COLLECTOR: ['collector.tasks.read', 'collector.tasks.collect', 'collector.earnings.read'],
  USER: ['pickup.request', 'pickup.read.own', 'profile.manage.own'],
};

export function normalizeRole(role: string): Role {
  const normalized = role.toUpperCase();
  if (normalized !== 'ADMIN' && normalized !== 'COLLECTOR' && normalized !== 'USER') {
    throw new Error(`Invalid role "${role}". Expected ADMIN | COLLECTOR | USER.`);
  }
  return normalized;
}

export function getIamRolesForRole(role: Role): string[] {
  return ROLE_TO_IAM_ROLES[role];
}

export function buildDefaultSeedUsers(): SeedUserInput[] {
  return [
    {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@greenloop.local',
      name: process.env.SEED_ADMIN_NAME ?? 'Green Loop Admin',
      role: 'ADMIN',
      password: process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!',
    },
    {
      email: process.env.SEED_COLLECTOR_EMAIL ?? 'collector@greenloop.local',
      name: process.env.SEED_COLLECTOR_NAME ?? 'Green Loop Collector',
      role: 'COLLECTOR',
      password: process.env.SEED_COLLECTOR_PASSWORD ?? 'ChangeMe123!',
    },
    {
      email: process.env.SEED_USER_EMAIL ?? 'user@greenloop.local',
      name: process.env.SEED_USER_NAME ?? 'Green Loop User',
      role: 'USER',
      password: process.env.SEED_USER_PASSWORD ?? 'ChangeMe123!',
    },
  ];
}

async function upsertAuthUser(
  auth: admin.auth.Auth,
  seedUser: SeedUserInput,
): Promise<{ uid: string; created: boolean }> {
  try {
    const existing = await auth.getUserByEmail(seedUser.email);
    await auth.updateUser(existing.uid, { displayName: seedUser.name });
    return { uid: existing.uid, created: false };
  } catch (error) {
    const authError = error as { code?: string };
    if (authError.code !== 'auth/user-not-found') throw error;

    const created = await auth.createUser({
      email: seedUser.email,
      password: seedUser.password,
      displayName: seedUser.name,
      emailVerified: true,
    });
    return { uid: created.uid, created: true };
  }
}

export async function seedUsers(params: {
  auth: admin.auth.Auth;
  db: admin.firestore.Firestore;
  users: SeedUserInput[];
}): Promise<SeedUserResult[]> {
  const { auth, db, users } = params;
  const now = new Date().toISOString();
  const results: SeedUserResult[] = [];

  for (const user of users) {
    const role = normalizeRole(user.role);
    const iamRoles = getIamRolesForRole(role);
    const { uid, created } = await upsertAuthUser(auth, { ...user, role });

    await auth.setCustomUserClaims(uid, { role, iamRoles });

    await db.collection('users').doc(uid).set(
      {
        id: uid,
        email: user.email,
        name: user.name,
        role,
        iamRoles,
        active: true,
        updatedAt: now,
        ...(created ? { createdAt: now } : {}),
      },
      { merge: true },
    );

    results.push({
      email: user.email,
      uid,
      role,
      created,
      iamRoles,
    });
  }

  return results;
}
