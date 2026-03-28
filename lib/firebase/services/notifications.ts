/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbService } from './db';
import { NotificationDoc } from '@/types/firestore';

/**
 * Send notification to a user
 */
export async function sendNotification(
  userId: string,
  type: string,
  message: string,
  relatedId?: string,
  relatedType?: 'Schedule' | 'IssueReport' | 'WasteReport'
): Promise<string> {
  const notification: Omit<NotificationDoc, 'id'> = {
    userId,
    type,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  if (relatedId) {
    (notification as any).relatedId = relatedId;
    (notification as any).relatedType = relatedType;
  }

  return dbService.add<NotificationDoc>('notifications', notification as any);
}

/**
 * Notify user of moderation action
 */
export async function notifyModerationAction(
  userId: string,
  targetId: string,
  targetType: 'IssueReport' | 'WasteReport',
  status: string,
  comment?: string
): Promise<void> {
  const message = `Your ${targetType === 'IssueReport' ? 'issue report' : 'waste report'} status has been updated to ${status}.${comment ? ` Admin comment: ${comment}` : ''}`;
  
  await sendNotification(userId, 'MODERATION_UPDATE', message, targetId, targetType);
}
