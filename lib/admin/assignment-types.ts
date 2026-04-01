export type AssignmentStatus = 'pending' | 'assigned' | 'active' | 'completed' | 'cancelled' | string;

export type AssignmentReasonCode =
  | 'assigned'
  | 'already_assigned'
  | 'missing_region'
  | 'no_active_collectors'
  | 'not_eligible'
  | 'schedule_not_found'
  | 'unexpected_error';

export type AssignmentSchedule = {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string | null;
  status?: AssignmentStatus;
  paymentStatus?: string;
  collectorId?: string;
  assignedCollectorId?: string;
  county?: string;
  region?: string;
  placeId?: string | null;
  locationSource?: string;
  latitude?: number | null;
  longitude?: number | null;
  wasteType?: string;
  address?: string;
  pickupDate?: string | null;
  timeSlot?: string;
  stripeSessionId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type AssignmentCollector = {
  id: string;
  role?: string;
  active?: boolean;
  status?: string;
  region?: string;
  county?: string;
  activeAssignments?: number;
};

export type AssignmentResult = {
  assignedCollectorId: string | null;
  reason?: AssignmentReasonCode;
};
