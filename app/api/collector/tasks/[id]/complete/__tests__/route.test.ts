import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { WasteStatus } from '@/types/waste-status';

const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);
vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));

vi.mock('@/lib/auth', () => ({ getSession: vi.fn() }));

const mockTransaction = {
  get: vi.fn(),
  update: vi.fn(),
  set: vi.fn(),
};

vi.mock('@/lib/firebase/admin', () => {
  const mockDoc = {
    get: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
  };
  const mockCollection = {
    doc: vi.fn().mockReturnValue(mockDoc),
    add: vi.fn(),
  };

  return {
    adminDb: {
      collection: vi.fn().mockReturnValue(mockCollection),
      runTransaction: vi.fn((cb) => cb(mockTransaction)),
    },
    admin: {
      firestore: {
        FieldValue: {
          increment: vi.fn((val) => ({ _increment: val })),
          serverTimestamp: vi.fn(() => ({ _serverTimestamp: true })),
        },
      },
    },
  };
});

const mockGetSession = vi.mocked(getSession);
const mockAdminDb = vi.mocked(adminDb);

const collectorSession = {
  user: { id: 'col-1', role: 'COLLECTOR' as const },
  expires: new Date(Date.now() + 3600000).toISOString(),
};

function makeRequest(url = 'http://localhost/api/collector/tasks/waste-1/complete', options: RequestInit = {}) {
  return new Request(url, { method: 'POST', ...options });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/collector/tasks/[id]/complete', () => {
  it('updates waste status, awards points, and creates a notification', async () => {
    mockGetSession.mockResolvedValue(collectorSession);

    const wasteData = {
      userId: 'user-1',
      assignedCollectorId: 'col-1',
      status: WasteStatus.Collected,
      wasteItem: {
        formValue: 'plastic',
        probability: 0.95,
      },
    };

    const mockWasteDoc = {
      exists: true,
      data: () => wasteData,
    };

    // First transaction.get is for waste document
    mockTransaction.get.mockResolvedValueOnce(mockWasteDoc);

    const mockUserDoc = {
      exists: true,
      data: () => ({ rewardPoints: 0 }),
    };
    // Second transaction.get is for user document
    mockTransaction.get.mockResolvedValueOnce(mockUserDoc);

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: 'waste-1' }) });

    expect(res.status).toBe(200);

    // 1. waste document is updated via transaction
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: WasteStatus.Completed,
        pointsEarned: 150, // (50 * 1.5) * 2.0 = 150
      })
    );

    // 2. user.rewardPoints is incremented via transaction
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        rewardPoints: { _increment: 150 },
      })
    );

    // 3. A notification is created for the user via transaction with correct schema
    expect(mockTransaction.set).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        userId: 'user-1',
        role: 'USER',
        type: 'reward_earned',
        title: 'Reward Earned',
        message: 'You earned 150 Green Points from your recent pickup.',
        status: 'unread',
        createdAt: { _serverTimestamp: true },
      })
    );
  });

  it('calculates points using fallbacks to wasteType and aiConfidence', async () => {
    mockGetSession.mockResolvedValue(collectorSession);

    const wasteData = {
      userId: 'user-1',
      assignedCollectorId: 'col-1',
      status: WasteStatus.Collected,
      // No wasteItem object
      wasteType: 'plastic',
      aiConfidence: 0.95,
    };

    mockTransaction.get.mockResolvedValueOnce({
      exists: true,
      data: () => wasteData,
    });

    mockTransaction.get.mockResolvedValueOnce({
      exists: true,
      data: () => ({ rewardPoints: 0 }),
    });

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: 'waste-1' }) });

    expect(res.status).toBe(200);

    // 150 points for plastic with > 0.9 confidence (50 * 1.5 * 2 = 150)
    expect(mockTransaction.update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        pointsEarned: 150,
      })
    );
  });

  it('handles idempotency if waste item is already Completed', async () => {
    mockGetSession.mockResolvedValue(collectorSession);

    const wasteData = {
      userId: 'user-1',
      assignedCollectorId: 'col-1',
      status: WasteStatus.Completed,
      wasteItem: {
        formValue: 'plastic',
        probability: 0.95,
      },
    };

    mockTransaction.get.mockResolvedValueOnce({
      exists: true,
      data: () => wasteData,
    });

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: 'waste-1' }) });

    expect(res.status).toBe(200);
    const body = (res as any)._body;
    expect(body.status).toBe(WasteStatus.Completed);
    
    // Should NOT have called update or set
    expect(mockTransaction.update).not.toHaveBeenCalled();
    expect(mockTransaction.set).not.toHaveBeenCalled();
  });

  it('returns 400 if waste item status is not Collected', async () => {
    mockGetSession.mockResolvedValue(collectorSession);

    const wasteData = {
      userId: 'user-1',
      assignedCollectorId: 'col-1',
      status: WasteStatus.Pending, // Not Collected
      wasteItem: {
        formValue: 'plastic',
        probability: 0.95,
      },
    };

    mockTransaction.get.mockResolvedValueOnce({
      exists: true,
      data: () => wasteData,
    });

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: 'waste-1' }) });

    expect(res.status).toBe(400);
    const body = (res as any)._body;
    expect(body.message).toContain('must be collected before completing');
  });

  it('returns 404 if user document is missing', async () => {
    mockGetSession.mockResolvedValue(collectorSession);

    const wasteData = {
      userId: 'user-1',
      assignedCollectorId: 'col-1',
      status: WasteStatus.Collected,
      wasteItem: {
        formValue: 'plastic',
        probability: 0.95,
      },
    };

    mockTransaction.get.mockResolvedValueOnce({
      exists: true,
      data: () => wasteData,
    });

    // User doc missing
    mockTransaction.get.mockResolvedValueOnce({ exists: false });

    const res = await POST(makeRequest(), { params: Promise.resolve({ id: 'waste-1' }) });

    expect(res.status).toBe(404);
    const body = (res as any)._body;
    expect(body.message).toContain('User document not found');
  });
});
