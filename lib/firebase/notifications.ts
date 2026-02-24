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

export type NotificationType = 'info' | 'warning' | 'alert' | 'AI-suggestion';
export type NotificationStatus = 'unread' | 'read';
export type UserRole = 'ADMIN' | 'COLLECTOR' | 'USER';

export interface Notification {
  id: string;
  userId?: string; // Optional - for individual notifications
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

  // Query for notifications that match user's role OR are specifically for this user
  const q = query(
    notificationsRef,
    where('role', '==', userRole)
  );

  const querySnapshot = await getDocs(q);
  const notifications: Notification[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Include if it's for their role or specifically for their userId
    if (!data.userId || data.userId === userId) {
      notifications.push({
        id: doc.id,
        ...data,
      } as Notification);
    }
  });

  return notifications;
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
