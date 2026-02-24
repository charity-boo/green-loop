import { WasteStatus } from '@/lib/types/waste-status';
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
  createdAt: string;
  updatedAt: string;
}

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
  createdAt: string;
  updatedAt: string;
  firebaseStatus?: string;
}

/**
 * Represents a waste collection task assigned to a collector.
 */
export interface CollectorTask extends Waste {
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
  firebaseStatus?: string;
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
}

/**
 * Data related to the user's progress in the rewards program.
 */
export interface RewardsData {
  currentPoints: number;
  nextMilestone: number;
  milestoneProgress: number; // 0 to 100
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  availableRewards: Array<{
    id: string;
    title: string;
    pointsCost: number;
    description: string;
  }>;
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
  transactionId?: string | null;
  createdAt: string;
  updatedAt: string;
}
