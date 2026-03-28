import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCollectorPerformance } from '../analytics';
import { dbService } from '../db';

vi.mock('../db', () => ({
  dbService: {
    query: vi.fn(),
  },
}));

vi.mock('@/lib/constants/governance', () => ({
  GOVERNANCE_LIMITS: {
    underReviewCriteria: {
      minAssigned: 5,
      maxCompletionRate: 70,
    },
  },
}));

describe('getCollectorPerformance()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('filters collectors by search term (case-insensitive)', async () => {
    const mockCollectors = [
      { id: 'c1', name: 'Alice Smith', email: 'alice@test.com', role: 'COLLECTOR', active: true },
      { id: 'c2', name: 'Bob Jones', email: 'bob@test.com', role: 'COLLECTOR', active: true },
    ];

    const mockSchedules = [
      { id: 's1', collectorId: 'c1', status: 'COMPLETED', date: new Date().toISOString() },
    ];

    (dbService.query as any).mockImplementation((collection: string) => {
      if (collection === 'users') return Promise.resolve(mockCollectors);
      if (collection === 'schedules') return Promise.resolve(mockSchedules);
      return Promise.resolve([]);
    });

    // Search for "alice"
    const result = await getCollectorPerformance({ search: 'alice' });
    
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Alice Smith');
    expect(result.total).toBe(1);
  });

  it('searches by email as well', async () => {
    const mockCollectors = [
      { id: 'c1', name: 'Alice Smith', email: 'alice@test.com', role: 'COLLECTOR', active: true },
      { id: 'c2', name: 'Bob Jones', email: 'bob@test.com', role: 'COLLECTOR', active: true },
    ];

    (dbService.query as any).mockImplementation((collection: string) => {
      if (collection === 'users') return Promise.resolve(mockCollectors);
      if (collection === 'schedules') return Promise.resolve([]);
      return Promise.resolve([]);
    });

    const result = await getCollectorPerformance({ search: 'bob@test.com' });
    
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Bob Jones');
  });

  it('returns paginated results', async () => {
    const mockCollectors = Array.from({ length: 15 }, (_, i) => ({
      id: `c${i}`,
      name: `Collector ${i}`,
      email: `c${i}@test.com`,
      role: 'COLLECTOR',
      active: true
    }));

    (dbService.query as any).mockImplementation((collection: string) => {
      if (collection === 'users') return Promise.resolve(mockCollectors);
      return Promise.resolve([]);
    });

    const result = await getCollectorPerformance({ page: 2, limit: 10 });
    
    expect(result.data).toHaveLength(5);
    expect(result.page).toBe(2);
    expect(result.totalPages).toBe(2);
  });
});
