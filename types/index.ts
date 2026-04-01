import { WasteStatus } from '@/types/waste-status';
import type { Role } from '@/lib/auth';

/**
 * Represents a user of the application in Firestore.
 */
export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  phone?: string | null;
  image?: string | null;
  region?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ClassificationStatus = 'none' | 'pending' | 'classified' | 'failed';

/**
 * Represents a waste item in Firestore.
 */
export interface Waste {
  id: string;
  userId: string;
  description?: string | null;
  price: number;
  status: WasteStatus;
  type?: string | null;
  imageUrl?: string | null;
  confidence?: number | null;
  assignedCollectorId?: string | null;
  // AI classification fields
  aiWasteType?: string | null;
  disposalTips?: string | null;
  classificationStatus?: ClassificationStatus;
  classifiedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  firebaseStatus?: string;
}

/**
 * Represents a waste collection task assigned to a collector.
 */
export interface CollectorTask extends Waste {
  location?: string | null;
  coordinates?: { latitude: number; longitude: number } | null;
  weight?: number | null;
  aiCategory?: string | null;
  beforeImageUrl?: string | null;
  afterImageUrl?: string | null;
  collectorId?: string;
  userName?: string | null;
  userPhone?: string | null;
  region?: string | null;
  address?: string | null;
  user?: {
    name: string | null;
    email: string;
  };
}

/**
 * Defines the shape of the data required for the admin dashboard.
 * This includes summary statistics and activity logs.
 */
export interface AdminDashboardData {
  totalUsers: number;
  activeCollectors: number;
  openRequests: number;
  systemLoad: 'Low' | 'Medium' | 'High' | 'Unknown';
  recentActivity: Array<{
    id: string;
    timestamp: string;
    message: string;
  }>;
  wasteTypeCounts: Array<{
    type: string;
    count: number;
  }>;
  // Add other relevant admin data points as the dashboard evolves.
}

/**
 * Defines the shape of the data for the user's personal dashboard.
 * Includes their recycling metrics and history.
 */
export interface UserDashboardData {
  metrics: UserMetrics;
  pickupHistory: PickupHistoryItem[];
  rewards: RewardsData;
  social: SocialMetrics;
  recentAiTips?: Array<{
    id: string;
    wasteType: string;
    tips: string;
    date: string;
  }>;
}

/**
 * Represents a single item in the user's pickup history.
 */
export interface PickupHistoryItem {
  id: string;
  date: string;
  status: WasteStatus;
  weight: number;
  wasteType: string;
  location: string;
  points: number;
  price?: number;
  paymentStatus?: string;
  firebaseStatus?: string;
  // AI classification
  aiWasteType?: string | null;
  disposalTips?: string | null;
  classificationStatus?: ClassificationStatus;
}

/**
 * Holds the key performance indicators for a user's recycling efforts.
 */
export interface UserMetrics {
  totalPickups: number;
  totalWeight: number; // in kg
  recyclingRate: number; // percentage
  rewardPoints: number;
  lastPickup: string; // ISO date string
  nextPickup?: string;
  skippedPickups?: number;
  materialBreakdown: Array<{ type: string; weight: number; percentage: number }>;
  carbonImpact: { totalCo2Saved: number; treesEquivalent: number };
}

/**
 * Social and gamification metrics for the user.
 */
export interface SocialMetrics {
  rank: number;
  totalNeighbors: number;
  percentile: number;
  streak: number;
}

/**
 * Data related to the user's progress in the rewards program.
 */
export interface RewardsData {
  currentPoints: number;
  nextMilestone: number;
  milestoneProgress: number; // 0 to 100
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  canRedeem: boolean;
  availableRewards: Array<{
    id: string;
    title: string;
    pointsCost: number;
    description: string;
  }>;
}

/**
 * Represents a reward redemption record in Firestore.
 */
export interface RewardRedemption {
  id: string;
  userId: string;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  userEmail?: string;
  userName?: string;
}


/**
 * A generic wrapper for API responses to standardize the communication
 * between the frontend and backend.
 * @template T The type of the data payload.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  error?: {
    code: number;
    details: string;
  };
}

/**
 * Represents the result of an AI waste classification.
 */
export interface AIClassificationResult {
  id: string;
  wasteId: string;
  userId: string;
  imageURL: string;
  predictedType: string;
  confidenceScore: number;
  createdAt: Date;
}

/**
 * Represents a payment record in Firestore.
 */
export interface Payment {
  id: string;
  userId: string;
  wasteId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  stripeSessionId?: string | null;
  transactionId?: string | null; // Stripe PaymentIntent ID after success
  createdAt: string;
  updatedAt: string;
}
