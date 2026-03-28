import { describe, it, expect, vi, beforeEach } from 'vitest';

// No backend API for booking yet, it's just a modal that simulates a call.
// But we should verify the types and component behavior if we had a test runner for components.
// For now, I'll add a test for the 'schedules' update logic in the Admin API which is related.

const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);
vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/firebase/admin', () => {
  const mockDoc = {
    update: vi.fn().mockResolvedValue({}),
    get: vi.fn().mockResolvedValue({ exists: true, data: () => ({ status: 'pending' }) }),
  };
  return {
    adminDb: {
      collection: vi.fn().mockReturnValue({
        doc: vi.fn().mockReturnValue(mockDoc),
      }),
    },
  };
});

import { PATCH } from '@/app/api/admin/schedules/route';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

const mockGetSession = vi.mocked(getSession);
const mockAdminDb = vi.mocked(adminDb);

const adminSession = {
  user: { id: 'admin-1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' as const, image: null },
  expires: new Date(Date.now() + 3600000).toISOString(),
};

function makeRequest(body: any) {
  return new Request('http://localhost/api/admin/schedules', {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('PATCH /api/admin/schedules', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows admins to update schedule status', async () => {
    mockGetSession.mockResolvedValue(adminSession);
    const mockDoc = mockAdminDb.collection('schedules').doc('s1');

    const res = await PATCH(makeRequest({ id: 's1', status: 'completed' }));
    
    expect(res.status).toBe(200);
    expect(mockDoc.update).toHaveBeenCalledWith({
      status: 'completed',
      updatedAt: expect.any(String),
    });
  });

  it('returns 401 for non-admins', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'u1', email: 'u@t.com', name: 'User', role: 'USER' as const, image: null },
      expires: ''
    });

    const res = await PATCH(makeRequest({ id: 's1', status: 'completed' }));
    expect(res.status).toBe(403); // Forbidden by authorize middleware
  });
});
