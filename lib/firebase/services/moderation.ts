/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService } from './db';
import { AdminActionLogDoc } from '@/types/firestore';

export interface ReportDoc {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  issueType: string;
  location?: string;
  dateTime?: string;
  description: string;
  preferredContact?: string;
  imageFile?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WasteReportDoc {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  status: 'PENDING' | 'CLASSIFIED' | 'AI_REVIEW' | 'AI_FAILED' | 'MODERATED';
  classification?: {
    wasteType: string;
    confidence: number;
    labels: string[];
  };
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageDoc {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
  createdAt: string;
  updatedAt?: string;
}

export interface ModerationFilters {
  status?: string;
  type?: 'ISSUE' | 'WASTE' | 'MESSAGE';
  page?: number;
  limit?: number;
}

/**
 * Fetch issue reports
 */
export async function getIssueReports(filters: ModerationFilters = {}): Promise<ReportDoc[]> {
  const queryFilters: any[] = [];
  if (filters.status) queryFilters.push(['status', '==', filters.status]);

  return dbService.query<ReportDoc>('reports', {
    where: queryFilters as any,
    orderBy: [['createdAt', 'desc']],
  });
}

/**
 * Fetch waste reports (AI review needed)
 */
export async function getWasteReports(filters: ModerationFilters = {}): Promise<WasteReportDoc[]> {
  const queryFilters: any[] = [];
  if (filters.status) queryFilters.push(['status', '==', filters.status]);

  return dbService.query<WasteReportDoc>('wasteReports', {
    where: queryFilters as any,
    orderBy: [['createdAt', 'desc']],
  });
}

/**
 * Fetch contact messages
 */
export async function getContactMessages(filters: ModerationFilters = {}): Promise<ContactMessageDoc[]> {
  const queryFilters: any[] = [];
  if (filters.status) queryFilters.push(['status', '==', filters.status]);

  return dbService.query<ContactMessageDoc>('contact_messages', {
    where: queryFilters as any,
    orderBy: [['createdAt', 'desc']],
  });
}

/**
 * Update issue report status
 */
export async function updateIssueReport(
  adminId: string,
  reportId: string,
  status: ReportDoc['status'],
  comment?: string
): Promise<void> {
  const beforeState = await dbService.get<ReportDoc>('reports', reportId);
  
  await dbService.update('reports', reportId, {
    status,
    adminComment: comment,
    updatedAt: new Date().toISOString(),
  });

  // @ts-expect-error: AdminActionLogDoc structure mismatch with dbService.add
  await dbService.add<AdminActionLogDoc>('admin_action_logs', {
    adminId,
    actionType: 'MODERATE_ISSUE',
    targetType: 'IssueReport',
    targetId: reportId,
    beforeState: { status: beforeState?.status },
    afterState: { status, comment },
    createdAt: new Date().toISOString(),
  });
}

/**
 * Update waste report status (Moderation)
 */
export async function updateWasteReport(
  adminId: string,
  reportId: string,
  status: WasteReportDoc['status'],
  comment?: string
): Promise<void> {
  const beforeState = await dbService.get<WasteReportDoc>('wasteReports', reportId);

  await dbService.update('wasteReports', reportId, {
    status,
    adminComment: comment,
    updatedAt: new Date().toISOString(),
  });

  // @ts-expect-error: AdminActionLogDoc structure mismatch with dbService.add
  await dbService.add<AdminActionLogDoc>('admin_action_logs', {
    adminId,
    actionType: 'MODERATE_WASTE',
    targetType: 'WasteReport',
    targetId: reportId,
    beforeState: { status: beforeState?.status },
    afterState: { status, comment },
    createdAt: new Date().toISOString(),
  });
}

/**
 * Update contact message status
 */
export async function updateContactMessage(
  adminId: string,
  messageId: string,
  status: ContactMessageDoc['status']
): Promise<void> {
  const beforeState = await dbService.get<ContactMessageDoc>('contact_messages', messageId);

  await dbService.update('contact_messages', messageId, {
    status,
    updatedAt: new Date().toISOString(),
  });

  // @ts-expect-error: AdminActionLogDoc structure mismatch with dbService.add
  await dbService.add<AdminActionLogDoc>('admin_action_logs', {
    adminId,
    actionType: 'UPDATE_CONTACT_MESSAGE',
    targetType: 'ContactMessage',
    targetId: messageId,
    beforeState: { status: beforeState?.status },
    afterState: { status },
    createdAt: new Date().toISOString(),
  });
}
