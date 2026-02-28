import { dbService } from './db';
import { Status, UserDoc, ScheduleDoc, AdminActionLogDoc } from '@/lib/types/firestore';
import { startOfDay, subDays, format } from 'date-fns';
import { GOVERNANCE_LIMITS } from '@/lib/constants/governance';

export interface DashboardKPIs {
  totalUsers: number;
  activeCollectors: number;
  pickupsToday: number;
  completedToday: number;
  pendingPickups: number;
  aiAccuracy: number;
}

export interface WasteTrend {
  date: string;
  totalWaste: number;
}

export interface WasteDistributionData {
  wasteType: string;
  count: number;
}

export interface CollectorPerformance {
  collectorId: string;
  name: string;
  assigned: number;
  completed: number;
  missed: number;
  completionRate: number;
}

export interface CollectorPerformanceFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'assigned' | 'completed' | 'missed' | 'completionRate';
  sortOrder?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
}

export interface PaginatedCollectorPerformance {
  data: CollectorPerformance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  const today = startOfDay(new Date()).toISOString();

  const [
    totalUsers,
    activeCollectors,
    pickupsToday,
    completedToday,
    pendingPickups,
    totalAI,
    correctAI,
  ] = await Promise.all([
    dbService.count('users', [['role', '==', 'USER']]),
    dbService.count('users', [
      ['role', '==', 'COLLECTOR'],
      ['active', '==', true],
    ]),
    dbService.count('schedules', [['date', '>=', today]]),
    dbService.count('schedules', [
      ['status', '==', 'COMPLETED'],
      ['date', '>=', today],
    ]),
    dbService.count('schedules', [['status', '==', 'PENDING']]),
    dbService.count('ai_analyses'),
    dbService.count('ai_analyses', [['isCorrect', '==', true]]),
  ]);

  const aiAccuracy = totalAI === 0 ? 0 : Number(((correctAI / totalAI) * 100).toFixed(2));

  return {
    totalUsers,
    activeCollectors,
    pickupsToday,
    completedToday,
    pendingPickups,
    aiAccuracy,
  };
}

export async function getWasteTrendData(): Promise<WasteTrend[]> {
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString();

  const schedules = await dbService.query<ScheduleDoc>('schedules', {
    where: [['date', '>=', thirtyDaysAgo]],
  });

  const dataMap = new Map<string, number>();
  schedules.forEach((item) => {
    const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
    const current = dataMap.get(dateKey) || 0;
    dataMap.set(dateKey, current + (item.wasteVolume || 0));
  });

  const result: WasteTrend[] = [];
  for (let i = 0; i <= 30; i++) {
    const date = subDays(new Date(), 30 - i);
    const dateKey = format(date, 'yyyy-MM-dd');
    result.push({
      date: dateKey,
      totalWaste: Number((dataMap.get(dateKey) || 0).toFixed(2)),
    });
  }

  return result;
}

export async function getWasteDistribution(): Promise<WasteDistributionData[]> {
  const categories = ['ORGANIC', 'PLASTIC', 'RECYCLABLE', 'HAZARDOUS'];
  const schedules = await dbService.query<ScheduleDoc>('schedules');

  const dataMap = new Map<string, number>();
  schedules.forEach((s) => {
    const type = s.wasteType.toUpperCase();
    dataMap.set(type, (dataMap.get(type) || 0) + 1);
  });

  return categories.map((type) => ({
    wasteType: type,
    count: dataMap.get(type) || 0,
  }));
}

export async function getCollectorPerformance(
  filters: CollectorPerformanceFilters = {}
): Promise<PaginatedCollectorPerformance> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const skip = (page - 1) * limit;

  const now = new Date();
  const startDate = filters.startDate ?? subDays(now, 30);
  const endDate = filters.endDate ?? now;

  const collectors = await dbService.query<UserDoc>('users', {
    where: [
      ['role', '==', 'COLLECTOR'],
      ['active', '==', true],
    ],
  });

  const allSchedules = await dbService.query<ScheduleDoc>('schedules', {
    where: [
      ['date', '>=', startDate.toISOString()],
      ['date', '<=', endDate.toISOString()],
    ],
  });

  const performanceData: CollectorPerformance[] = collectors.map((c) => {
    const collectorSchedules = allSchedules.filter((s) => s.collectorId === c.id);
    const assigned = collectorSchedules.length;
    const completed = collectorSchedules.filter((s) => s.status === 'COMPLETED').length;
    const missed = collectorSchedules.filter((s) => s.status === 'MISSED').length;
    const completionRate = assigned === 0 ? 0 : Number(((completed / assigned) * 100).toFixed(2));

    return {
      collectorId: c.id,
      name: c.name || 'Unknown',
      assigned,
      completed,
      missed,
      completionRate,
    };
  });

  // Sorting
  const sortBy = filters.sortBy || 'completionRate';
  const sortOrder = filters.sortOrder || 'desc';

  performanceData.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const paginatedData = performanceData.slice(skip, skip + limit);

  return {
    data: paginatedData,
    total: performanceData.length,
    page,
    limit,
    totalPages: Math.ceil(performanceData.length / limit),
  };
}

/**
 * Interface for Detailed Collector Performance
 */
export interface CollectorDetail extends CollectorPerformance {
  active: boolean;
  email: string;
  totalOverrides: number;
  overrideRatio: number;
}

/**
 * Interface for Individual Schedule Record
 */
export interface CollectorSchedule {
  id: string;
  date: string;
  status: Status;
  wasteType: string;
  wasteVolume: number;
}

/**
 * Paginated Result for Collector Schedules
 */
export interface PaginatedCollectorSchedules {
  data: CollectorSchedule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 5. getCollectorDetail()
 */
export async function getCollectorDetail(
  collectorId: string,
  filters: { startDate?: Date; endDate?: Date } = {}
): Promise<CollectorDetail | null> {
  const now = new Date();
  const startDate = filters.startDate ?? subDays(now, 30);
  const endDate = filters.endDate ?? now;

  try {
    const collector = await dbService.get<UserDoc>('users', collectorId);
    if (!collector || collector.role !== 'COLLECTOR') return null;

    const schedules = await dbService.query<ScheduleDoc>('schedules', {
      where: [
        ['collectorId', '==', collectorId],
        ['date', '>=', startDate.toISOString()],
        ['date', '<=', endDate.toISOString()],
      ],
    });

    const assigned = schedules.length;
    const completed = schedules.filter((s) => s.status === 'COMPLETED').length;
    const missed = schedules.filter((s) => s.status === 'MISSED').length;
    const completionRate = assigned === 0 ? 0 : Number(((completed / assigned) * 100).toFixed(2));

    const logs = await dbService.query<AdminActionLogDoc>('admin_action_logs', {
      where: [
        ['actionType', '==', 'OVERRIDE_SCHEDULE_STATUS'],
        ['targetType', '==', 'Schedule'],
        ['createdAt', '>=', startDate.toISOString()],
        ['createdAt', '<=', endDate.toISOString()],
      ],
    });

    const scheduleIds = new Set(schedules.map((s) => s.id));
    const totalOverrides = logs.filter((log) => scheduleIds.has(log.targetId)).length;
    const overrideRatio = assigned > 0 ? Number(((totalOverrides / assigned) * 100).toFixed(2)) : 0;

    return {
      collectorId: collector.id,
      name: collector.name || 'Unknown',
      email: collector.email,
      active: collector.active,
      assigned,
      completed,
      missed,
      completionRate,
      totalOverrides,
      overrideRatio,
    };
  } catch (error) {
    console.error(`Error fetching detail for collector ${collectorId}:`, error);
    return null;
  }
}

/**
 * 6. getCollectorSchedules()
 */
export async function getCollectorSchedules(
  collectorId: string,
  filters: { startDate?: Date; endDate?: Date; page?: number; limit?: number } = {}
): Promise<PaginatedCollectorSchedules> {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const skip = (page - 1) * limit;

  const now = new Date();
  const startDate = filters.startDate ?? subDays(now, 30);
  const endDate = filters.endDate ?? now;

  try {
    const schedules = await dbService.query<ScheduleDoc>('schedules', {
      where: [
        ['collectorId', '==', collectorId],
        ['date', '>=', startDate.toISOString()],
        ['date', '<=', endDate.toISOString()],
      ],
      orderBy: [['date', 'desc']],
    });

    const total = schedules.length;
    const paginatedData = schedules.slice(skip, skip + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error(`Error fetching schedules for collector ${collectorId}:`, error);
    return {
      data: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

/**
 * Interface for Anomaly Metrics
 */
export interface AnomalyMetrics {
  totalOverrides7d: number;
  totalStatusToggles7d: number;
  activeCollectorsUnderReview: number;
  overrideTrend7d: { date: string; count: number }[];
}

/**
 * 7. getAnomalyMetrics()
 */
export async function getAnomalyMetrics(): Promise<AnomalyMetrics> {
  const sevenDaysAgo = startOfDay(subDays(new Date(), 7)).toISOString();
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30)).toISOString();

  try {
    const [overrides, toggles] = await Promise.all([
      dbService.query<AdminActionLogDoc>('admin_action_logs', {
        where: [
          ['actionType', '==', 'OVERRIDE_SCHEDULE_STATUS'],
          ['createdAt', '>=', sevenDaysAgo],
        ],
      }),
      dbService.query<AdminActionLogDoc>('admin_action_logs', {
        where: [
          ['actionType', '==', 'TOGGLE_COLLECTOR_STATUS'],
          ['createdAt', '>=', sevenDaysAgo],
        ],
      }),
    ]);

    const dataMap = new Map<string, number>();
    overrides.forEach((item) => {
      const dateKey = format(new Date(item.createdAt), 'yyyy-MM-dd');
      dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + 1);
    });

    const overrideTrend7d: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), 6 - i);
      const dateKey = format(date, 'yyyy-MM-dd');
      overrideTrend7d.push({
        date: dateKey,
        count: dataMap.get(dateKey) || 0,
      });
    }

    // Simplified activeCollectorsUnderReview logic for Firestore
    const collectors = await dbService.query<UserDoc>('users', {
      where: [
        ['role', '==', 'COLLECTOR'],
        ['active', '==', true],
      ],
    });

    const allSchedules = await dbService.query<ScheduleDoc>('schedules', {
      where: [['date', '>=', thirtyDaysAgo]],
    });

    const activeCollectorsUnderReview = collectors.filter((c) => {
      const cSchedules = allSchedules.filter((s) => s.collectorId === c.id);
      const assigned = cSchedules.length;
      const completed = cSchedules.filter((s) => s.status === 'COMPLETED').length;
      const completionRate = assigned === 0 ? 0 : (completed / assigned) * 100;

      return (
        assigned >= GOVERNANCE_LIMITS.underReviewCriteria.minAssigned &&
        completionRate < GOVERNANCE_LIMITS.underReviewCriteria.maxCompletionRate
      );
    }).length;

    return {
      totalOverrides7d: overrides.length,
      totalStatusToggles7d: toggles.length,
      activeCollectorsUnderReview,
      overrideTrend7d,
    };
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to fetch anomaly metrics:', error);
    return {
      totalOverrides7d: 0,
      totalStatusToggles7d: 0,
      activeCollectorsUnderReview: 0,
      overrideTrend7d: [],
    };
  }
}
