import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

export type NotificationType = 'info' | 'warning' | 'alert' | 'AI-suggestion' | 'reward_earned';
export type NotificationStatus = 'unread' | 'read';
export type UserRole = 'ADMIN' | 'COLLECTOR' | 'USER';

export interface Notification {
  id: string;
  userId: string | null; // Explicitly null for broadcasts
  role: UserRole; // admin, collector, user
  title: string;
  message: string;
  type: NotificationType; // info, warning, alert, AI-suggestion
  status: NotificationStatus; // unread, read
  createdAt: Timestamp;
}

// Add notification to Firestore
export async function addNotification(
  notification: Omit<Notification, 'id' | 'createdAt'>
): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');
  const notificationsRef = collection(db, 'notifications');
  const docRef = await addDoc(notificationsRef, {
    ...notification,
    userId: notification.userId || null,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Get notifications for current user
export async function getUserNotifications(
  userId: string,
  userRole: UserRole
): Promise<Notification[]> {
  if (!db) return [];
  const notificationsRef = collection(db, 'notifications');

  // We need to fetch both role-based (broadcast) and personal notifications.
  // Since Firestore doesn't support 'OR' on different fields easily, we do two queries.
  const queries = [
    getDocs(query(
      notificationsRef, 
      where('role', '==', userRole), 
      where('userId', '==', null)
    ))
  ];

  if (userId) {
    queries.push(
      getDocs(query(
        notificationsRef, 
        where('userId', '==', userId)
      ))
    );
  }

  const snapshots = await Promise.all(queries);

  const notifications: Notification[] = [];
  
  snapshots.forEach(snap => {
    snap.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification);
    });
  });

  // Sort by date manually if needed, or let the caller handle it
  return notifications.sort((a, b) => {
    const timeA = a.createdAt?.toMillis() || 0;
    const timeB = b.createdAt?.toMillis() || 0;
    return timeB - timeA;
  });
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  if (!db) return;
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    status: 'read',
  });
}

// Batch mark notifications as read
export async function markNotificationsAsRead(notificationIds: string[]): Promise<void> {
  if (!db) return;
  const batch = writeBatch(db);

  notificationIds.forEach((id) => {
    const notificationRef = doc(db, 'notifications', id);
    batch.update(notificationRef, { status: 'read' });
  });

  await batch.commit();
}

// Broadcast notification to role (e.g., all admins, all collectors)
export async function broadcastNotification(
  role: UserRole,
  title: string,
  message: string,
  type: NotificationType
): Promise<void> {
  await addNotification({
    userId: null,
    role,
    title,
    message,
    type,
    status: 'unread',
  });
}

// Send notification to specific user
export async function sendPersonalNotification(
  userId: string,
  role: UserRole,
  title: string,
  message: string,
  type: NotificationType
): Promise<void> {
  await addNotification({
    userId,
    role,
    title,
    message,
    type,
    status: 'unread',
  });
}
