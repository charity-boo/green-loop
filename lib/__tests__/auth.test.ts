import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers before importing lib/auth
vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

vi.mock('@/lib/firebase/admin', () => ({
  adminAuth: {
    verifyIdToken: vi.fn(),
  },
}));

import { getSession, requireAuth, requireRole } from '@/lib/auth';
import { headers, cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase/admin';

const mockHeaders = vi.mocked(headers);
const mockCookies = vi.mocked(cookies);
const mockVerifyIdToken = vi.mocked(adminAuth.verifyIdToken);

function makeHeadersStore(map: Record<string, string>) {
  return { get: (key: string) => map[key] ?? null } as ReturnType<typeof headers> extends Promise<infer T> ? T : never;
}

function makeCookiesStore(map: Record<string, string>) {
  return { get: (key: string) => (map[key] ? { value: map[key] } : undefined) } as ReturnType<typeof cookies> extends Promise<infer T> ? T : never;
}

const baseToken = {
  uid: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  picture: null,
  iat: Math.floor(Date.now() / 1000) - 60,
  exp: Math.floor(Date.now() / 1000) + 3600,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getSession()', () => {
  it('returns null when no token in header or cookie', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({}));
    mockCookies.mockResolvedValue(makeCookiesStore({}));

    const session = await getSession();
    expect(session).toBeNull();
  });

  it('returns null when token value is the string "undefined"', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer undefined' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));

    const session = await getSession();
    expect(session).toBeNull();
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('returns null when verifyIdToken throws (expired/invalid token)', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer bad-token' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockRejectedValue(new Error('auth/id-token-expired'));

    const session = await getSession();
    expect(session).toBeNull();
  });

  it('returns a session with USER role when token has no role claim', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid-token' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: undefined });

    const session = await getSession();
    expect(session).not.toBeNull();
    expect(session!.user.role).toBe('USER');
  });

  it('returns a session with ADMIN role when token claims role=admin', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid-token' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'admin' });

    const session = await getSession();
    expect(session!.user.role).toBe('ADMIN');
  });

  it('returns a session with COLLECTOR role from token claims', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid-token' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'collector' });

    const session = await getSession();
    expect(session!.user.role).toBe('COLLECTOR');
  });

  it('reads token from cookie when Authorization header is absent', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({}));
    mockCookies.mockResolvedValue(makeCookiesStore({ 'firebase-token': 'cookie-token' }));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'user' });

    const session = await getSession();
    expect(mockVerifyIdToken).toHaveBeenCalledWith('cookie-token');
    expect(session).not.toBeNull();
  });

  it('maps token fields to session user correctly', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer t' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'user', picture: 'https://example.com/pic.jpg' });

    const session = await getSession();
    expect(session!.user).toMatchObject({
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      image: 'https://example.com/pic.jpg',
    });
  });
});

describe('requireAuth()', () => {
  it('throws Unauthorized when there is no session', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({}));
    mockCookies.mockResolvedValue(makeCookiesStore({}));

    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });

  it('returns the session when authenticated', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'user' });

    const session = await requireAuth();
    expect(session.user.id).toBe('user-123');
  });
});

describe('requireRole()', () => {
  it('throws Forbidden when user has wrong role', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'user' });

    await expect(requireRole('COLLECTOR')).rejects.toThrow('Forbidden');
  });

  it('returns session when user has the required role', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'collector' });

    const session = await requireRole('COLLECTOR');
    expect(session.user.role).toBe('COLLECTOR');
  });

  it('allows ADMIN to pass any role requirement', async () => {
    mockHeaders.mockResolvedValue(makeHeadersStore({ Authorization: 'Bearer valid' }));
    mockCookies.mockResolvedValue(makeCookiesStore({}));
    mockVerifyIdToken.mockResolvedValue({ ...baseToken, role: 'admin' });

    // ADMIN user satisfies a COLLECTOR requirement
    const session = await requireRole('COLLECTOR');
    expect(session.user.role).toBe('ADMIN');
  });
});
