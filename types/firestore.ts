export type Role = 'USER' | 'COLLECTOR' | 'ADMIN';
export type Status = 'PENDING' | 'COMPLETED' | 'MISSED';

export interface UserDoc {
  id: string;
  name: string | null;
  email: string;
  phoneNumber?: string | null;
  role: Role;
  active: boolean;
  region?: string | null;
  county?: string | null;
  address?: string | null;
  placeId?: string | null;
  locationSource?: 'manual' | 'gps' | 'google_autocomplete' | null;
  status?: string | null;
  subscribedCategories?: string[]; // Waste categories user wants notifications for
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface NotificationDoc {
  id: string;
  userId: string;
  type: string;
  message: string;
  relatedScheduleId?: string | null;
  isRead: boolean;
  createdAt: string; // ISO string
}

export interface ScheduleDoc {
  id: string;
  userId: string;
  collectorId?: string | null;
  date: string; // ISO string
  status: Status;
  wasteVolume: number;
  wasteType: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface AIAnalysisDoc {
  id: string;
  userId: string;
  isCorrect: boolean;
  createdAt: string; // ISO string
}

export interface HostelDoc {
  id: string;
  name: string;
  location: string;
  points: number;
  managerId: string;
  studentCount: number;
  totalWasteRecycled: number; // in kg
  tier: 'standard' | 'premium' | 'enterprise';
  verified: boolean;
  pickupSchedule?: {
    days: string[]; // ['Mon', 'Wed', 'Fri']
    time: string; // '7:00 AM'
    instructions: string; // 'at main gate'
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApartmentDoc {
  id: string;
  name: string;
  location: string;
  points: number;
  managerId: string;
  unitCount: number;
  totalWasteRecycled: number; // in kg
  tier: 'standard' | 'premium' | 'enterprise';
  verified: boolean;
  pickupSchedule?: {
    days: string[]; // ['Mon', 'Wed', 'Fri']
    time: string; // '7:00 AM'
    instructions: string; // 'at main gate'
  };
  createdAt: string;
  updatedAt: string;
}

export interface AdminActionLogDoc {
  id: string;
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  reason?: string | null;
  createdAt: string; // ISO string
  updatedAt?: string;
}

// Community Content Types
export type ContentStatus = 'draft' | 'published';
export type EventStatus = 'draft' | 'published' | 'completed';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed';

export interface GreenTipDoc {
  id: string;
  title: string;
  description: string; // Can store rich text as HTML or markdown
  imageUrl?: string | null;
  category: string; // e.g., "Recycling", "Composting", "Energy Saving"
  status: ContentStatus;
  createdBy: string; // adminId
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface EventDoc {
  id: string;
  title: string;
  description: string; // Can store rich text as HTML or markdown
  imageUrl?: string | null;
  eventDate: string; // ISO string
  location: string;
  category: string; // e.g., "Cleanup Drive", "Workshop", "Awareness Campaign"
  status: EventStatus;
  registrationRequired: boolean;
  maxParticipants?: number | null;
  currentParticipants?: number;
  createdBy: string; // adminId
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CommunityStoryDoc {
  id: string;
  title: string;
  story: string; // Can store rich text as HTML or markdown
  authorName: string;
  imageUrl?: string | null;
  category: string; // e.g., "Success Story", "Impact", "Testimonial"
  featured: boolean;
  status: ContentStatus;
  createdBy: string; // adminId
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ChallengeDoc {
  id: string;
  title: string;
  description: string; // Can store rich text as HTML or markdown
  imageUrl?: string | null;
  category: string; // e.g., "Waste Reduction", "Community Cleanup"
  startDate: string; // ISO string
  endDate: string; // ISO string
  goal: string; // e.g., "Collect 100kg waste"
  currentProgress: number;
  status: ChallengeStatus;
  participants: string[]; // array of userIds
  createdBy: string; // adminId
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface HostelBookingDoc {
  id: string;
  propertyName: string;
  location: string;
  contactPerson: string;
  email: string;
  tier: 'Standard' | 'Premium' | 'Enterprise';
  status: 'pending' | 'contacted' | 'onboarded' | 'rejected';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  placeId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  county?: string | null;
  region?: string | null;
  locationSource?: 'google_autocomplete' | 'manual' | null;
  notes?: string | null;
}

export type InquiryStatus = 'PENDING' | 'CONTACTED' | 'ONBOARDED' | 'REJECTED' | 'NEW' | 'OPEN' | 'CLOSED' | 'RESOLVED';

export interface ContactMessageDoc {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'OPEN' | 'CLOSED';
  createdAt: string; // ISO string
}

export interface ReportDoc {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  issueType: string;
  location?: string;
  dateTime: string;
  description: string;
  preferredContact: 'email' | 'sms';
  imageFile?: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string; // ISO string
}

export type Inquiry = {
  id: string;
  type: 'Hostel Booking' | 'Contact Message' | 'Issue Report';
  title: string;
  subtitle: string;
  date: string;
  status: InquiryStatus;
  data: HostelBookingDoc | ContactMessageDoc | ReportDoc;
};

// Pickup Schedule Types
export type WasteCategory = 'organic' | 'plastic' | 'metal' | 'general' | 'mixed';

export interface PickupScheduleDoc {
  id: string;
  categoryId: WasteCategory;
  categoryName: string; // Human-readable name (e.g., "Organic Waste", "Plastic & Bottles")
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // 24-hour format (e.g., "09:00")
  region?: string | null; // Optional region filter
  preparationInstructions: string; // Instructions for users on how to prepare waste
  active: boolean; // Can be toggled on/off by admin
  createdBy: string; // Admin userId
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
