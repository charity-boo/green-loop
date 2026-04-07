import { adminDb } from './firebase/admin';
import {
  UserDashboardData,
  PickupHistoryItem,
  CollectorTask,
  AdminDashboardData,
  RewardsData,
  SocialMetrics,
} from '@/types';
import { WasteStatus } from '@/types/waste-status';
import { calculateCarbonSavings } from './utils/carbon';

interface FirestoreSchedule {
  id: string;
  userId: string;
  wasteType: string;
  address: string;
  pickupDate: string | null;
  timeSlot: string;
  status: string;
  price?: number;
  paymentStatus?: string;
  weight?: number;
  points?: number;
  pointsEarned?: number;
  aiWasteType?: string | null;
  disposalTips?: string | null;
  classificationStatus?: string;
  createdAt: string | { _seconds: number; _nanoseconds: number };
}

function parseFirestoreDate(
  value: string | { _seconds: number; _nanoseconds: number } | undefined
): string {
  if (!value) return 'N/A';
  if (typeof value === 'string') return value.split('T')[0];
  if ('_seconds' in value) return new Date(value._seconds * 1000).toISOString().split('T')[0];
  return 'N/A';
}

function scheduleStatusToWaste(status: string): WasteStatus {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case 'completed': return WasteStatus.Completed;
    case 'assigned': return WasteStatus.Active;
    case 'cancelled': return WasteStatus.Cancelled;
    case 'skipped': return WasteStatus.Skipped;
    case 'missed': return WasteStatus.Missed;
    default: return WasteStatus.Pending;
  }
}


export async function getUserDashboardData(
  userId: string
): Promise<UserDashboardData> {
  if (!userId) {
    throw new Error('UserId is required for getUserDashboardData');
  }
  // Development Bypass
  if (!adminDb.collection && process.env.NODE_ENV === 'development') {
    console.log('Generating mock user dashboard data for development...');
    
    const mockPickupHistory: PickupHistoryItem[] = [
      { id: '1', date: '2024-02-20', status: WasteStatus.Completed, weight: 5.2, wasteType: 'Plastic', location: '123 Main St', points: 150, paymentStatus: 'Paid' },
      { id: '2', date: '2024-02-18', status: WasteStatus.Completed, weight: 3.1, wasteType: 'Paper', location: '456 Oak Ave', points: 90, paymentStatus: 'Paid' },
      { id: '3', date: '2024-02-15', status: WasteStatus.Skipped, weight: 0, wasteType: 'Organic', location: '789 Pine Rd', points: 0, paymentStatus: 'N/A' },
      { id: '4', date: '2024-02-10', status: WasteStatus.Pending, weight: 0, wasteType: 'Glass', location: '321 Elm St', points: 0, paymentStatus: 'Unpaid' },
    ];

    const hasUnpaid = mockPickupHistory.some(item => item.paymentStatus === 'Unpaid');

    return {
      metrics: {
        totalPickups: 12,
        totalWeight: 45.5,
        recyclingRate: 84.5,
        rewardPoints: 1250,
        lastPickup: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextPickup: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        skippedPickups: 1,
        materialBreakdown: [
          { type: 'Plastic', weight: 15.2, percentage: 33 },
          { type: 'Paper', weight: 12.1, percentage: 27 },
          { type: 'Glass', weight: 8.5, percentage: 19 },
          { type: 'Metal', weight: 5.4, percentage: 12 },
          { type: 'Organic', weight: 4.3, percentage: 9 },
        ],
        carbonImpact: {
          totalCo2Saved: 68.4,
          treesEquivalent: 3,
        }
      },
      pickupHistory: mockPickupHistory,
      rewards: {
        currentPoints: 1250,
        nextMilestone: 2000,
        milestoneProgress: 62.5,
        tier: 'Silver',
        canRedeem: !hasUnpaid,
        availableRewards: [
          { id: 'r1', title: 'Free Pickup Upgrade', pointsCost: 500, description: 'Get a priority pickup for your next collection.' },
          { id: 'r2', title: '$5 Amazon Gift Card', pointsCost: 1000, description: 'Redeem your points for a digital gift card.' },
          { id: 'r3', title: 'Plant a Tree', pointsCost: 2000, description: 'We will plant a tree in your name in a reforestation project.' },
        ]
      },
      social: {
        rank: 42,
        totalNeighbors: 150,
        percentile: 72,
        streak: 5,
      }
    };
  }

  try {
    // Parallelize Firestore calls: schedules, unpaid check, and user doc
    const [schedulesSnapshot, unpaidSchedulesSnapshot, userDoc] = await Promise.all([
      adminDb.collection('schedules')
        .where('userId', '==', userId)
        .get(),
      adminDb.collection('schedules')
        .where('userId', '==', userId)
        .where('paymentStatus', '==', 'Unpaid')
        .limit(1)
        .get(),
      adminDb.collection('users').doc(userId).get()
    ]);

    const canRedeem = unpaidSchedulesSnapshot.empty;

    const scheduleItems = (schedulesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as FirestoreSchedule[]).sort((a, b) => {
      const aTime = typeof a.createdAt === 'string' ? a.createdAt : (a.createdAt && '_seconds' in a.createdAt ? new Date(a.createdAt._seconds * 1000).toISOString() : '');
      const bTime = typeof b.createdAt === 'string' ? b.createdAt : (b.createdAt && '_seconds' in b.createdAt ? new Date(b.createdAt._seconds * 1000).toISOString() : '');
      return bTime.localeCompare(aTime);
    });

    const pickupHistory: PickupHistoryItem[] = scheduleItems.map((item) => ({
      id: item.id,
      date: item.pickupDate || parseFirestoreDate(item.createdAt),
      status: scheduleStatusToWaste(item.status),
      weight: item.weight || 0,
      wasteType: item.wasteType || 'Unknown',
      location: item.address || 'Unknown',
      points: item.pointsEarned || item.points || 0,
      price: item.price || 0,
      paymentStatus: item.paymentStatus || 'Unpaid',
      aiWasteType: item.aiWasteType ?? null,
      disposalTips: item.disposalTips ?? null,
      classificationStatus: (item.classificationStatus as PickupHistoryItem['classificationStatus']) ?? 'none',
    }));

    const completedPickups = scheduleItems.filter((item) => item.status === 'completed');
    
    const terminalStatuses = ['completed', 'cancelled', 'skipped', 'missed'];
    const activePickups = scheduleItems
      .filter((item) => !terminalStatuses.includes(item.status.toLowerCase()))
      .sort((a, b) => {
        const aDate = a.pickupDate || parseFirestoreDate(a.createdAt);
        const bDate = b.pickupDate || parseFirestoreDate(b.createdAt);
        return aDate.localeCompare(bDate);
      });

    let lastPickupDateStr = 'N/A';
    if (completedPickups.length > 0) {
      lastPickupDateStr = parseFirestoreDate(completedPickups[0].createdAt);
    }

    let nextPickupDateStr = 'N/A';
    let nextPickupId = undefined;
    if (activePickups.length > 0) {
      const nextItem = activePickups[0];
      nextPickupDateStr = nextItem.pickupDate || parseFirestoreDate(nextItem.createdAt);
      nextPickupId = nextItem.id;
    }

    // Fetch user rewards data
    const userData = userDoc.data();
    const rewardPoints = userData?.rewardPoints || 0;

    // Simple tier logic
    let tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' = 'Bronze';
    let nextMilestone = 500;
    if (rewardPoints >= 2000) {
      tier = 'Platinum';
      nextMilestone = 5000;
    } else if (rewardPoints >= 1000) {
      tier = 'Gold';
      nextMilestone = 2000;
    } else if (rewardPoints >= 500) {
      tier = 'Silver';
      nextMilestone = 1000;
    }

    const milestoneProgress = Math.min(100, (rewardPoints / nextMilestone) * 100);

    // Calculate material breakdown from completed schedules
    const materialMap: Record<string, number> = {};
    completedPickups.forEach(item => {
      const type = item.wasteType || 'Unknown';
      const weight = item.weight || 0;
      materialMap[type] = (materialMap[type] || 0) + weight;
    });

    const skippedPickupsCount = scheduleItems.filter((item) => {
      const s = item.status.toLowerCase();
      return s === 'cancelled' || s === 'skipped' || s === 'missed';
    }).length;

    const totalWeight = Object.values(materialMap).reduce((a, b) => a + b, 0);
    const materialBreakdown = Object.entries(materialMap).map(([type, weight]) => ({
      type,
      weight,
      percentage: totalWeight > 0 ? Math.round((weight / totalWeight) * 100) : 0
    }));

    // Calculate carbon impact
    const carbonImpact = calculateCarbonSavings(
      Object.entries(materialMap).map(([type, weight]) => ({ type, weight }))
    );

    // Calculate AI Stats from completed pickups that used AI
    const classifiedPickups = pickupHistory.filter(
      item => item.status === WasteStatus.Completed && item.classificationStatus === 'classified'
    );
    const totalClassified = classifiedPickups.length;
    
    // Sum the points earned from these specific pickups
    const totalAiPoints = classifiedPickups.reduce((sum, item) => sum + (item.points || 0), 0);

    const metrics = {
      totalPickups: completedPickups.length,
      totalWeight,
      recyclingRate: completedPickups.length > 0 ? 85 : 0, // Mock rate for now
      rewardPoints,
      lastPickup: lastPickupDateStr,
      nextPickup: nextPickupDateStr,
      nextPickupId,
      skippedPickups: skippedPickupsCount,
      materialBreakdown,
      carbonImpact,
      aiStats: {
        totalClassified,
        totalAiPoints,
      }
    };

    const rewards: RewardsData = {
      currentPoints: rewardPoints,
      nextMilestone,
      milestoneProgress,
      tier,
      canRedeem,
      availableRewards: [
        { id: 'r1', title: 'Free Pickup Upgrade', pointsCost: 500, description: 'Get a priority pickup for your next collection.' },
        { id: 'r2', title: '$5 Amazon Gift Card', pointsCost: 1000, description: 'Redeem your points for a digital gift card.' },
        { id: 'r3', title: 'Plant a Tree', pointsCost: 2000, description: 'We will plant a tree in your name in a reforestation project.' },
      ]
    };

    const social: SocialMetrics = {
      rank: 12, // Mock data
      totalNeighbors: 100, // Mock data
      percentile: 88, // Mock data
      streak: completedPickups.length > 0 ? 3 : 0, // Mock streak
    };

    const recentAiTips = pickupHistory
      .filter(item => item.classificationStatus === 'classified' && item.aiWasteType && item.disposalTips)
      .slice(0, 3)
      .map(item => ({
        id: item.id,
        wasteType: item.aiWasteType!,
        tips: item.disposalTips!,
        date: item.date,
      }));

    return {
      metrics,
      pickupHistory,
      rewards,
      social,
      recentAiTips,
    };
  } catch (error) {
    console.error('Error in getUserDashboardData:', error);
    throw error;
  }
}

export async function getCollectorDashboardData(): Promise<CollectorTask[]> {
  // Development Bypass
  if (!adminDb.collection && process.env.NODE_ENV === 'development') {
    console.log('Generating mock collector dashboard data for development...');
    return [
      { id: '1', userId: 'user-1', type: 'Plastic', status: WasteStatus.Pending, location: '123 Main St', createdAt: new Date().toISOString() },
      { id: '2', userId: 'user-2', type: 'Paper', status: WasteStatus.Pending, location: '456 Oak Ave', createdAt: new Date().toISOString() },
    ] as unknown as CollectorTask[];
  }

  try {
    const tasksSnapshot = await adminDb.collection('waste')
      .where('status', '==', WasteStatus.Pending)
      .orderBy('createdAt', 'asc')
      .get();

    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as unknown as CollectorTask[];

    return tasks;
  } catch (error) {
    console.error('Error in getCollectorDashboardData:', error);
    throw error;
  }
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  // Development Bypass
  if (!adminDb.collection && process.env.NODE_ENV === 'development') {
    console.log('Generating mock admin dashboard data for development...');
    return {
      totalUsers: 156,
      activeCollectors: 12,
      openRequests: 8,
      systemLoad: 'Low',
      recentActivity: [],
      wasteTypeCounts: [
        { type: 'Plastic', count: 45 },
        { type: 'Paper', count: 32 },
        { type: 'Organic', count: 18 },
      ],
    };
  }

  try {
    // Parallelize all admin dashboard Firestore calls
    const [totalUsersSnapshot, activeCollectorsSnapshot, openRequestsSnapshot, wasteSnapshot] = await Promise.all([
      adminDb.collection('users').count().get(),
      adminDb.collection('users').where('role', '==', 'COLLECTOR').count().get(),
      adminDb.collection('waste').where('status', '==', WasteStatus.Pending).count().get(),
      adminDb.collection('waste').select('type').get()
    ]);

    const totalUsers = totalUsersSnapshot.data().count;
    const activeCollectors = activeCollectorsSnapshot.data().count;
    const openRequests = openRequestsSnapshot.data().count;

    // Aggregate waste type counts
    const wasteTypeCountsMap: Record<string, number> = {};
    wasteSnapshot.docs.forEach(doc => {
      const type = doc.data().type || 'Unknown';
      wasteTypeCountsMap[type] = (wasteTypeCountsMap[type] || 0) + 1;
    });

    const wasteTypeCounts = Object.entries(wasteTypeCountsMap).map(([type, count]) => ({
      type,
      count,
    }));

    return {
      totalUsers,
      activeCollectors,
      openRequests,
      systemLoad: 'Low', // Standardizing on 'Low' for now as mock logic
      recentActivity: [],
      wasteTypeCounts,
    };
  } catch (error) {
    console.error('Error in getAdminDashboardData:', error);
    throw error;
  }
}
