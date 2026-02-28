import { adminDb } from './firebase/admin';
import {
  UserDashboardData,
  PickupHistoryItem,
  CollectorTask,
  AdminDashboardData,
  Waste,
  RewardsData,
  SocialMetrics,
} from '@/types';
import { WasteStatus } from '@/lib/types/waste-status';
import { calculateCarbonSavings } from './utils/carbon';

interface FirestoreWaste extends Omit<Waste, 'createdAt' | 'updatedAt'> {
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
}


export async function getUserDashboardData(
  userId: string
): Promise<UserDashboardData> {
  // Development Bypass
  if (!adminDb.collection && process.env.NODE_ENV === 'development') {
    console.log('Generating mock user dashboard data for development...');
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
      pickupHistory: [
        { id: '1', date: '2024-02-20', status: WasteStatus.Completed, weight: 5.2, wasteType: 'Plastic', location: '123 Main St', points: 150 },
        { id: '2', date: '2024-02-18', status: WasteStatus.Completed, weight: 3.1, wasteType: 'Paper', location: '456 Oak Ave', points: 90 },
        { id: '3', date: '2024-02-15', status: WasteStatus.Skipped, weight: 0, wasteType: 'Organic', location: '789 Pine Rd', points: 0 },
        { id: '4', date: '2024-02-10', status: WasteStatus.Pending, weight: 0, wasteType: 'Glass', location: '321 Elm St', points: 0 },
      ],
      rewards: {
        currentPoints: 1250,
        nextMilestone: 2000,
        milestoneProgress: 62.5,
        tier: 'Silver',
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

  const wasteSnapshot = await adminDb.collection('waste')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();

  const wasteItems = wasteSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as FirestoreWaste[];

  const pickupHistory: PickupHistoryItem[] = wasteItems.map((item) => {
    let date = 'N/A';
    if (item.createdAt) {
      if (typeof item.createdAt === 'string') {
        date = item.createdAt.split('T')[0];
      } else if ('_seconds' in item.createdAt) {
        date = new Date(item.createdAt._seconds * 1000).toISOString().split('T')[0];
      }
    }

    const rawItem = item as unknown as Record<string, unknown>;

    return {
      id: item.id.toString(),
      date,
      status: item.status as WasteStatus,
      weight: rawItem.weight as number || 0,
      wasteType: item.type || 'Unknown',
      location: rawItem.location as string || 'Unknown',
      points: rawItem.points as number || 0,
    };
  });

  const completedPickups = wasteItems.filter(
    (item) => item.status === WasteStatus.Completed
  );

  const pendingPickups = wasteItems.filter(
    (item) => item.status === WasteStatus.Pending
  );

  const skippedPickupsCount = wasteItems.filter(
    (item) => item.status === WasteStatus.Skipped
  ).length;

  let lastPickupDateStr = 'N/A';
  if (completedPickups.length > 0) {
    const lastItem = completedPickups[0];
    if (typeof lastItem.createdAt === 'string') {
      lastPickupDateStr = lastItem.createdAt.split('T')[0];
    } else if (lastItem.createdAt && '_seconds' in lastItem.createdAt) {
      lastPickupDateStr = new Date(lastItem.createdAt._seconds * 1000).toISOString().split('T')[0];
    }
  }

  let nextPickupDateStr = 'N/A';
  if (pendingPickups.length > 0) {
    // Assuming the oldest pending is the next one
    const nextItem = pendingPickups[pendingPickups.length - 1];
    if (typeof nextItem.createdAt === 'string') {
      nextPickupDateStr = nextItem.createdAt.split('T')[0];
    } else if (nextItem.createdAt && '_seconds' in nextItem.createdAt) {
      nextPickupDateStr = new Date(nextItem.createdAt._seconds * 1000).toISOString().split('T')[0];
    }
  }

  // Fetch user rewards data
  const userDoc = await adminDb.collection('users').doc(userId).get();
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

  // Calculate material breakdown
  const materialMap: Record<string, number> = {};
  completedPickups.forEach(item => {
    const type = item.type || 'Unknown';
    const weight = (item as FirestoreWaste & { weight?: number }).weight || 0;
    materialMap[type] = (materialMap[type] || 0) + weight;
  });

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

  const metrics = {
    totalPickups: completedPickups.length,
    totalWeight,
    recyclingRate: completedPickups.length > 0 ? 85 : 0, // Mock rate for now
    rewardPoints,
    lastPickup: lastPickupDateStr,
    nextPickup: nextPickupDateStr,
    skippedPickups: skippedPickupsCount,
    materialBreakdown,
    carbonImpact,
  };

  const rewards: RewardsData = {
    currentPoints: rewardPoints,
    nextMilestone,
    milestoneProgress,
    tier,
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

  return {
    metrics,
    pickupHistory,
    rewards,
    social,
  };
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

  const tasksSnapshot = await adminDb.collection('waste')
    .where('status', '==', WasteStatus.Pending)
    .orderBy('createdAt', 'asc')
    .get();

  const tasks = tasksSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as CollectorTask[];

  return tasks;
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

  const totalUsersSnapshot = await adminDb.collection('users').count().get();
  const totalUsers = totalUsersSnapshot.data().count;

  const activeCollectorsSnapshot = await adminDb.collection('users')
    .where('role', '==', 'COLLECTOR')
    .count()
    .get();
  const activeCollectors = activeCollectorsSnapshot.data().count;

  const openRequestsSnapshot = await adminDb.collection('waste')
    .where('status', '==', WasteStatus.Pending)
    .count()
    .get();
  const openRequests = openRequestsSnapshot.data().count;

  // Firestore doesn't have groupBy, we need to fetch and aggregate manually or use a different approach
  // For now, let's fetch all waste items and aggregate (might be slow for many items)
  const wasteSnapshot = await adminDb.collection('waste').select('type').get();
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
    systemLoad: 'Unknown',
    recentActivity: [],
    wasteTypeCounts,
  };
}
