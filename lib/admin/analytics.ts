import { prisma } from '@/lib/prisma';
import { Role, Status, Prisma } from '@prisma/client';
import { startOfDay, subDays, format } from 'date-fns';

/**
 * Interface for Dashboard Key Performance Indicators (KPIs)
 */
export interface DashboardKPIs {
  totalUsers: number;
  activeCollectors: number;
  pickupsToday: number;
  completedToday: number;
  pendingPickups: number;
  aiAccuracy: number;
}

/**
 * Interface for Waste Trend Data Point
 */
export interface WasteTrend {
  date: string;
  totalWaste: number;
}

/**
 * Interface for Collector Performance Data Point
 */
export interface CollectorPerformance {
  collectorId: string;
  name: string;
  assigned: number;
  completed: number;
  missed: number;
  completionRate: number;
}

/**
 * Filter and sorting parameters for Collector Performance
 */
export interface CollectorPerformanceFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'assigned' | 'completed' | 'missed' | 'completionRate';
  sortOrder?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
}

/**
 * Paginated result for Collector Performance
 */
export interface PaginatedCollectorPerformance {
  data: CollectorPerformance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 1. getDashboardKPIs()
 * Fetches high-level metrics for the admin dashboard.
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  try {
    const today = startOfDay(new Date());

    const [
      totalUsers,
      activeCollectors,
      pickupsToday,
      completedToday,
      pendingPickups,
      totalAI,
      correctAI,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.user.count({ where: { role: Role.COLLECTOR, active: true } }),
      prisma.schedule.count({ where: { date: { gte: today } } }),
      prisma.schedule.count({
        where: {
          status: Status.COMPLETED,
          date: { gte: today },
        },
      }),
      prisma.schedule.count({ where: { status: Status.PENDING } }),
      prisma.aIAnalysis.count(),
      prisma.aIAnalysis.count({ where: { isCorrect: true } }),
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
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to fetch dashboard KPIs from Database.');
    console.error('Details:', error instanceof Error ? error.message : error);

    if (process.env.NODE_ENV === 'development') {
      console.warn('DEVELOPMENT FALLBACK: Returning zeroed KPI data.');
      return {
        totalUsers: 0,
        activeCollectors: 0,
        pickupsToday: 0,
        completedToday: 0,
        pendingPickups: 0,
        aiAccuracy: 0,
      };
    }

    throw new Error('Analytics Engine Unavailable: Please check database connectivity.');
  }
}

/**
 * 2. getWasteTrendData()
 * Returns waste volume trends for the last 30 days.
 */
export async function getWasteTrendData(): Promise<WasteTrend[]> {
  try {
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

    // Use queryRaw for PostgreSQL date_trunc to group by day efficiently at the DB level
    // This avoids JS grouping overhead and handles potential time-drift in database timestamps
    const aggregations = await prisma.$queryRaw<any[]>`
      SELECT 
        date_trunc('day', "date") as "day",
        SUM("wasteVolume") as "totalWaste"
      FROM "Schedule"
      WHERE "date" >= ${thirtyDaysAgo}
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    // Map result to a more accessible format (yyyy-MM-dd)
    const dataMap = new Map<string, number>();
    aggregations.forEach((item) => {
      const dateKey = format(new Date(item.day), 'yyyy-MM-dd');
      dataMap.set(dateKey, Number(item.totalWaste || 0));
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
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to fetch waste trend data from Database.');
    console.error('Details:', error instanceof Error ? error.message : error);

    // In development, we allow fallback to avoid blocking UI work
    if (process.env.NODE_ENV === 'development') {
      console.warn('DEVELOPMENT FALLBACK: Returning empty trend data.');
      return [];
    }

    // In production, we MUST fail loud. Analytics silence is misleading.
    throw new Error('Analytics Engine Unavailable: Please check database connectivity.');
  }
}

/**
 * Interface for Waste Distribution Data Point
 */
export type WasteDistributionData = {
  wasteType: 'ORGANIC' | 'PLASTIC' | 'RECYCLABLE' | 'HAZARDOUS';
  count: number;
};

/**
 * 3. getWasteDistribution()
 * Returns the distribution of waste by type, ensuring all categories are represented.
 */
export async function getWasteDistribution(): Promise<WasteDistributionData[]> {
  const categories: WasteDistributionData['wasteType'][] = [
    'ORGANIC',
    'PLASTIC',
    'RECYCLABLE',
    'HAZARDOUS',
  ];

  try {
    const groups = await prisma.schedule.groupBy({
      by: ['wasteType'],
      _count: {
        _all: true,
      },
    });

    const dataMap = new Map(groups.map((g) => [g.wasteType.toUpperCase(), g._count._all]));

    return categories.map((type) => ({
      wasteType: type,
      count: dataMap.get(type) || 0,
    }));
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to fetch waste distribution from Database.');
    console.error('Details:', error instanceof Error ? error.message : error);

    if (process.env.NODE_ENV === 'development') {
      console.warn('DEVELOPMENT FALLBACK: Returning zeroed distribution data.');
      return categories.map((type) => ({ wasteType: type, count: 0 }));
    }

    throw new Error('Analytics Engine Unavailable: Please check database connectivity.');
  }
}

/**
 * 4. getCollectorPerformance()
 * Returns performance metrics for collectors with pagination.
 */
export async function getCollectorPerformance(
  filters: CollectorPerformanceFilters = {}
): Promise<PaginatedCollectorPerformance> {
  // 1. Normalize Inputs
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const skip = (page - 1) * limit;

  // 2. Strict Sorting Whitelist
  const validSortColumns = {
    name: 'u.name',
    assigned: 'assigned',
    completed: 'completed',
    missed: 'missed',
    completionRate: '"completionRate"',
  } as const;

  const sortBy =
    filters.sortBy && validSortColumns[filters.sortBy]
      ? validSortColumns[filters.sortBy]
      : '"completionRate"';

  const sortOrder = filters.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // 3. Date Filtering with Defaults
  const now = new Date();
  let startDate = filters.startDate ?? subDays(now, 30);
  let endDate = filters.endDate ?? now;

  // Safety: Swap if range is invalid
  if (startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  try {
    // 4. Independent Total Count
    const total = await prisma.user.count({
      where: {
        role: Role.COLLECTOR,
        active: true,
      },
    });

    // 5. Raw SQL for Performance and Analytics Accuracy
    const rows = await prisma.$queryRaw<any[]>`
      SELECT
        u.id AS "collectorId",
        u.name,
        COUNT(s.id) AS assigned,
        COALESCE(SUM(CASE WHEN s.status = 'COMPLETED' THEN 1 ELSE 0 END), 0) AS completed,
        COALESCE(SUM(CASE WHEN s.status = 'MISSED' THEN 1 ELSE 0 END), 0) AS missed,
        CASE
          WHEN COUNT(s.id) = 0 THEN 0
          ELSE ROUND(
            COALESCE(SUM(CASE WHEN s.status = 'COMPLETED' THEN 1 ELSE 0 END), 0)::decimal
            / COUNT(s.id) * 100,
            2
          )
        END AS "completionRate"
      FROM "User" u
      LEFT JOIN "Schedule" s ON s."collectorId" = u.id 
        AND s."date" >= ${startDate}
        AND s."date" <= ${endDate}
      WHERE u.role = 'COLLECTOR' AND u.active = true
      GROUP BY u.id, u.name
      ORDER BY ${Prisma.raw(sortBy)} ${Prisma.raw(sortOrder)}
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    // 5. Coerce Result Types
    const data: CollectorPerformance[] = rows.map((row) => ({
      collectorId: row.collectorId,
      name: row.name || 'Unknown',
      assigned: Number(row.assigned),
      completed: Number(row.completed),
      missed: Number(row.missed),
      completionRate: Number(row.completionRate),
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to fetch collector performance history.');
    console.error('Details:', error instanceof Error ? error.message : error);

    if (process.env.NODE_ENV === 'development') {
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }

    throw new Error('Analytics Engine Unavailable: Collector data fetch failed.');
  }
}
