import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDashboardKPIs, getWasteTrendData } from '../analytics';
import { dbService } from '../db';

vi.mock('../db', () => ({
  dbService: {
    count: vi.fn(),
    query: vi.fn(),
  },
}));

describe('Analytics Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should calculate dashboard KPIs correctly', async () => {
    vi.mocked(dbService.count).mockImplementation(async (collection) => {
      if (collection === 'users') return 10;
      if (collection === 'schedules') return 5;
      if (collection === 'ai_analyses') return 100;
      return 0;
    });

    const kpis = await getDashboardKPIs();

    expect(kpis.totalUsers).toBe(10);
    expect(kpis.pickupsToday).toBe(5);
    expect(kpis.aiAccuracy).toBeGreaterThan(0);
  });

  it('should aggregate waste trend data', async () => {
    const mockSchedules = [
      { id: '1', date: new Date().toISOString(), wasteVolume: 10, wasteType: 'ORGANIC' },
      { id: '2', date: new Date().toISOString(), wasteVolume: 5, wasteType: 'PLASTIC' },
    ];
    vi.mocked(dbService.query).mockResolvedValue(mockSchedules);

    const trend = await getWasteTrendData();

    expect(trend).toHaveLength(31); // 30 days + today
    const todayTrend = trend[30];
    expect(todayTrend.totalWaste).toBe(15);
  });
});
