import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserDashboardData } from '../dashboard-data';
import { adminDb } from '../firebase/admin';

vi.mock('../firebase/admin', () => ({
  adminDb: {
    collection: vi.fn(),
  },
}));

describe('getUserDashboardData', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets canRedeem to true when there are no unpaid schedules', async () => {
    const mockSchedulesSnapshot = {
      docs: [],
    };
    const mockUnpaidSchedulesSnapshot = {
      empty: true,
    };
    const mockUserDoc = {
      data: () => ({ rewardPoints: 1000 }),
    };

    const collectionMock = vi.mocked(adminDb.collection);
    
    // Setup sequential mocks for the 3 Firestore calls
    collectionMock.mockReturnValueOnce({
      where: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(mockSchedulesSnapshot),
    } as any); // schedules for user

    collectionMock.mockReturnValueOnce({
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(mockUnpaidSchedulesSnapshot),
    } as any); // unpaid schedules check

    collectionMock.mockReturnValueOnce({
      doc: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockUserDoc),
      }),
    } as any); // user doc

    const data = await getUserDashboardData(userId);
    
    expect(data.rewards.canRedeem).toBe(true);
    expect(data.rewards.currentPoints).toBe(1000);
    expect(data.rewards.tier).toBe('Gold');
  });

  it('sets canRedeem to false when there are unpaid schedules', async () => {
    const mockSchedulesSnapshot = {
      docs: [],
    };
    const mockUnpaidSchedulesSnapshot = {
      empty: false,
    };
    const mockUserDoc = {
      data: () => ({ rewardPoints: 500 }),
    };

    const collectionMock = vi.mocked(adminDb.collection);
    
    // Setup sequential mocks for the 3 Firestore calls
    collectionMock.mockReturnValueOnce({
      where: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(mockSchedulesSnapshot),
    } as any);

    collectionMock.mockReturnValueOnce({
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue(mockUnpaidSchedulesSnapshot),
    } as any);

    collectionMock.mockReturnValueOnce({
      doc: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue(mockUserDoc),
      }),
    } as any);

    const data = await getUserDashboardData(userId);
    
    expect(data.rewards.canRedeem).toBe(false);
    expect(data.rewards.currentPoints).toBe(500);
    expect(data.rewards.tier).toBe('Silver');
  });

  it('throws an error when Firestore call fails', async () => {
    const collectionMock = vi.mocked(adminDb.collection);
    
    collectionMock.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnThis(),
      get: vi.fn().mockRejectedValue(new Error('Firestore failure')),
    } as any);

    await expect(getUserDashboardData(userId)).rejects.toThrow('Firestore failure');
  });
});
