import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  Timestamp,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from './config';
import { Notification, NotificationType, NotificationStatus } from './notifications';

/**
 * Filter options for advanced queries
 */
export interface NotificationFilter {
  role?: string;
  status?: NotificationStatus;
  type?: NotificationType;
  userId?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  pageSize?: number;
  startAfterDoc?: unknown;
}

/**
 * Get notifications with advanced filtering
 */
export async function getFilteredNotifications(
  filter: NotificationFilter,
  options: PaginationOptions = {}
): Promise<{ notifications: Notification[]; lastDoc?: unknown }> {
  const { pageSize = 20, startAfterDoc } = options;
  const notificationsRef = collection(db, 'notifications');
  const constraints = [];

  // Build query constraints
  if (filter.role) {
    constraints.push(where('role', '==', filter.role));
  }
  if (filter.status) {
    constraints.push(where('status', '==', filter.status));
  }
  if (filter.type) {
    constraints.push(where('type', '==', filter.type));
  }
  if (filter.userId) {
    constraints.push(where('userId', '==', filter.userId));
  }

  // Add ordering
  constraints.push(orderBy('createdAt', 'desc'));

  // Add pagination
  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }
  constraints.push(limit(pageSize));

  const q = query(notificationsRef, ...constraints);
  const snapshot = await getDocs(q);

  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return {
    notifications,
    lastDoc: lastDoc?.ref,
  };
}

/**
 * Get notifications by type
 */
export async function getNotificationsByType(
  type: NotificationType,
  userRole: string,
  userId?: string
): Promise<Notification[]> {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('type', '==', type),
    where('role', '==', userRole),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  // Filter personal notifications on client
  if (userId) {
    return notifications.filter((n) => !n.userId || n.userId === userId);
  }

  return notifications;
}

/**
 * Get recent notifications (last N hours)
 */
export async function getRecentNotifications(
  userRole: string,
  hoursAgo: number = 24,
  userId?: string
): Promise<Notification[]> {
  const notificationsRef = collection(db, 'notifications');
  const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  const cutoffTimestamp = Timestamp.fromDate(cutoffTime);

  const q = query(
    notificationsRef,
    where('role', '==', userRole),
    where('createdAt', '>=', cutoffTimestamp),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  // Filter personal notifications on client
  if (userId) {
    return notifications.filter((n) => !n.userId || n.userId === userId);
  }

  return notifications;
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(
  userRole: string,
  userId?: string
): Promise<number> {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('role', '==', userRole),
    where('status', '==', 'unread')
  );

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  if (userId) {
    return notifications.filter((n) => !n.userId || n.userId === userId).length;
  }

  return notifications.length;
}

/**
 * Batch delete notifications
 */
export async function deleteNotifications(notificationIds: string[]): Promise<void> {
  if (notificationIds.length === 0) return;

  // const _batch = writeBatch(db);
  const BATCH_SIZE = 500; // Firestore batch limit

  for (let i = 0; i < notificationIds.length; i += BATCH_SIZE) {
    const batchIds = notificationIds.slice(i, i + BATCH_SIZE);
    const batchOp = writeBatch(db);

    batchIds.forEach((id) => {
      const notificationRef = doc(db, 'notifications', id);
      batchOp.delete(notificationRef);
    });

    await batchOp.commit();
  }
}

/**
 * Archive old notifications (change status to read if older than specified days)
 */
export async function archiveOldNotifications(daysOld: number = 30): Promise<number> {
  const notificationsRef = collection(db, 'notifications');
  const cutoffTime = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  const cutoffTimestamp = Timestamp.fromDate(cutoffTime);

  const q = query(
    notificationsRef,
    where('createdAt', '<', cutoffTimestamp),
    where('status', '==', 'unread')
  );

  const snapshot = await getDocs(q);
  let archivedCount = 0;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnapshot) => {
    batch.update(docSnapshot.ref, { status: 'read' });
    archivedCount++;

    // Commit in batches of 500
    if (archivedCount % 500 === 0) {
      batch.commit();
    }
  });

  if (archivedCount % 500 !== 0) {
    await batch.commit();
  }

  return archivedCount;
}

/**
 * Search notifications by keywords in title or message
 * Note: This is client-side search. For production, use Firestore full-text search
 */
export async function searchNotifications(
  userRole: string,
  searchTerm: string,
  userId?: string
): Promise<Notification[]> {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('role', '==', userRole),
    orderBy('createdAt', 'desc'),
    limit(100)
  );

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  const lowerSearchTerm = searchTerm.toLowerCase();

  return notifications.filter((n) => {
    const matchesFilter =
      n.title.toLowerCase().includes(lowerSearchTerm) ||
      n.message.toLowerCase().includes(lowerSearchTerm);

    if (!matchesFilter) return false;

    // Also filter by userId if provided
    if (userId) {
      return !n.userId || n.userId === userId;
    }

    return true;
  });
}

/**
 * Get notification statistics for a user
 */
export async function getNotificationStats(
  userRole: string,
  userId?: string
): Promise<{
  total: number;
  unread: number;
  byType: Record<string, number>;
}> {
  const notificationsRef = collection(db, 'notifications');
  const q = query(
    notificationsRef,
    where('role', '==', userRole),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  const notifications = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  } as Notification));

  let filtered = notifications;
  if (userId) {
    filtered = notifications.filter((n) => !n.userId || n.userId === userId);
  }

  const stats = {
    total: filtered.length,
    unread: filtered.filter((n) => n.status === 'unread').length,
    byType: {} as Record<string, number>,
  };

  filtered.forEach((n) => {
    stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
  });

  return stats;
}
