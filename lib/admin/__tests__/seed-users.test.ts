import { describe, expect, it } from 'vitest';
import { buildDefaultSeedUsers, getIamRolesForRole, normalizeRole } from '@/lib/admin/seed-users';

describe('seed user helpers', () => {
  it('normalizes role casing to app roles', () => {
    expect(normalizeRole('admin')).toBe('ADMIN');
    expect(normalizeRole('collector')).toBe('COLLECTOR');
    expect(normalizeRole('user')).toBe('USER');
  });

  it('returns iam roles for each app role', () => {
    expect(getIamRolesForRole('ADMIN')).toContain('admin.platform.manage');
    expect(getIamRolesForRole('COLLECTOR')).toContain('collector.tasks.collect');
    expect(getIamRolesForRole('USER')).toContain('pickup.request');
  });

  it('builds default users for admin collector and user', () => {
    const users = buildDefaultSeedUsers();
    const roles = users.map((user) => user.role).sort();
    expect(roles).toEqual(['ADMIN', 'COLLECTOR', 'USER']);
  });
});
