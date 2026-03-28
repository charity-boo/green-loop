import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);
vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));

vi.mock('@/lib/firebase/admin', () => {
  const mockQuery = {
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn(),
  };
  return {
    adminDb: {
      collection: vi.fn().mockReturnValue(mockQuery),
    },
  };
});

import { GET } from '@/app/api/hostels/leaderboard/route';
import { adminDb } from '@/lib/firebase/admin';

const mockAdminDb = vi.mocked(adminDb);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/hostels/leaderboard', () => {
  it('returns sorted and verified hostels', async () => {
    const mockHostels = [
      { id: 'h1', name: 'Hostel A', points: 100, verified: true },
      { id: 'h2', name: 'Hostel B', points: 50, verified: true },
    ];

    const mockDocs = mockHostels.map(h => ({
      id: h.id,
      data: () => ({ name: h.name, points: h.points, verified: h.verified })
    }));

    const mockQuery = mockAdminDb.collection('hostels') as any;
    mockQuery.get.mockResolvedValue({ docs: mockDocs });

    const res = await GET();
    expect(res.status).toBe(200);
    
    const body = (res as any)._body;
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe('Hostel A');
    expect(body[1].points).toBe(50);
    
    expect(mockQuery.where).toHaveBeenCalledWith('verified', '==', true);
    expect(mockQuery.orderBy).toHaveBeenCalledWith('points', 'desc');
  });

  it('handles database errors gracefully', async () => {
    const mockQuery = mockAdminDb.collection('hostels') as any;
    mockQuery.get.mockRejectedValue(new Error('Firestore error'));

    const res = await GET();
    expect(res.status).toBe(500);
  });
});
