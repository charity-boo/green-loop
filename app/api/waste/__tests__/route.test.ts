import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.mock is hoisted — use vi.hoisted() for variables referenced inside factory functions
const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);
vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));
vi.mock('@/lib/firebase/admin', () => {
  const mockCollectionQuery = {
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    get: vi.fn(),
  };
  const mockCollection = {
    ...mockCollectionQuery,
    add: vi.fn(),
    doc: vi.fn().mockReturnValue({ id: 'new-doc-id' }),
  };
  return {
    adminDb: {
      collection: vi.fn().mockReturnValue(mockCollection),
      getAll: vi.fn(),
    },
    admin: {},
  };
});

import { GET, POST } from '@/app/api/waste/route';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

const mockGetSession = vi.mocked(getSession);
const mockAdminDb = vi.mocked(adminDb);

const adminSession = {
  user: { id: 'admin-1', email: 'admin@test.com', name: 'Admin', role: 'ADMIN' as const, image: null },
  expires: new Date(Date.now() + 3600000).toISOString(),
};
const userSession = {
  user: { id: 'user-1', email: 'user@test.com', name: 'User', role: 'USER' as const, image: null },
  expires: new Date(Date.now() + 3600000).toISOString(),
};

function makeRequest(url = 'http://localhost/api/waste', options: RequestInit = {}) {
  return new Request(url, { method: options.method ?? 'GET', ...options });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/waste', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
  });

  it('returns empty array when no waste docs exist', async () => {
    mockGetSession.mockResolvedValue(adminSession);
    const mockQuery = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
    };
    mockAdminDb.collection.mockReturnValue(mockQuery as never);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    expect((res as { _body: unknown })._body).toEqual([]);
  });

  it('returns 400 for an invalid status query param', async () => {
    mockGetSession.mockResolvedValue(adminSession);

    const res = await GET(makeRequest('http://localhost/api/waste?status=INVALID'));
    expect(res.status).toBe(400);
  });

  it('scopes query to userId for USER role', async () => {
    mockGetSession.mockResolvedValue(userSession);
    const mockQuery = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
    };
    mockAdminDb.collection.mockReturnValue(mockQuery as never);

    await GET(makeRequest());

    expect(mockQuery.where).toHaveBeenCalledWith('userId', '==', 'user-1');
  });

  it('batch-fetches user and collector and attaches them to results', async () => {
    mockGetSession.mockResolvedValue(adminSession);

    const mockDoc = {
      id: 'waste-1',
      data: () => ({
        userId: 'user-1',
        assignedCollectorId: 'col-1',
        status: 'pending',
        createdAt: '2024-01-01',
      }),
    };
    const mockQuery = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ empty: false, docs: [mockDoc] }),
      doc: vi.fn().mockReturnValue({ id: 'ref' }),
    };
    mockAdminDb.collection.mockReturnValue(mockQuery as never);
    mockAdminDb.getAll
      .mockResolvedValueOnce([{ id: 'user-1', exists: true, data: () => ({ name: 'Alice', email: 'alice@test.com' }) }])
      .mockResolvedValueOnce([{ id: 'col-1', exists: true, data: () => ({ name: 'Bob', email: 'bob@test.com' }) }]);

    const res = await GET(makeRequest());
    const body = (res as { _body: unknown[] })._body;

    expect(body).toHaveLength(1);
    expect((body[0] as { user: { name: string } }).user).toEqual({ name: 'Alice', email: 'alice@test.com' });
    expect((body[0] as { assignedCollector: { name: string } }).assignedCollector).toEqual({ name: 'Bob', email: 'bob@test.com' });
  });

  it('sets assignedCollector to null when no collector is assigned', async () => {
    mockGetSession.mockResolvedValue(adminSession);

    const mockDoc = {
      id: 'waste-2',
      data: () => ({ userId: 'user-1', status: 'pending', createdAt: '2024-01-01' }),
    };
    const mockQuery = {
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ empty: false, docs: [mockDoc] }),
      doc: vi.fn().mockReturnValue({ id: 'ref' }),
    };
    mockAdminDb.collection.mockReturnValue(mockQuery as never);
    mockAdminDb.getAll.mockResolvedValueOnce([
      { id: 'user-1', exists: true, data: () => ({ name: 'Alice', email: 'alice@test.com' }) },
    ]);

    const res = await GET(makeRequest());
    const body = (res as { _body: unknown[] })._body;
    expect((body[0] as { assignedCollector: unknown }).assignedCollector).toBeNull();
  });
});

describe('POST /api/waste', () => {
  it('returns 401 when not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const res = await POST(
      makeRequest('http://localhost/api/waste', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: 'https://example.com/img.jpg' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(401);
  });

  it('returns 400 when both imageUrl and description are missing', async () => {
    mockGetSession.mockResolvedValue(userSession);

    const res = await POST(
      makeRequest('http://localhost/api/waste', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(400);
  });

  it('returns 400 when imageUrl is not a valid URL', async () => {
    mockGetSession.mockResolvedValue(userSession);

    const res = await POST(
      makeRequest('http://localhost/api/waste', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: 'not-a-url' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(400);
  });

  it('creates a waste document and returns 201', async () => {
    mockGetSession.mockResolvedValue(userSession);
    const mockAdd = vi.fn().mockResolvedValue({ id: 'new-waste-id' });
    const mockQuery = { where: vi.fn().mockReturnThis(), add: mockAdd };
    mockAdminDb.collection.mockReturnValue(mockQuery as never);

    const res = await POST(
      makeRequest('http://localhost/api/waste', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: 'https://example.com/img.jpg' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(201);
    const body = (res as { _body: { id: string; userId: string } })._body;
    expect(body.id).toBe('new-waste-id');
    expect(body.userId).toBe('user-1');
  });

  it('returns 400 when description exceeds 500 characters', async () => {
    mockGetSession.mockResolvedValue(userSession);

    const res = await POST(
      makeRequest('http://localhost/api/waste', {
        method: 'POST',
        body: JSON.stringify({ description: 'x'.repeat(501) }),
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(res.status).toBe(400);
  });
});
