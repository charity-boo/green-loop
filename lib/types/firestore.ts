export type Role = 'USER' | 'COLLECTOR' | 'ADMIN';
export type Status = 'PENDING' | 'COMPLETED' | 'MISSED';

export interface UserDoc {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  active: boolean;
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
