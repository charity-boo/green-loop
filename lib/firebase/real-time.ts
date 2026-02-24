import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { Notification, UserRole } from './notifications';

/**
 * Real-time listener for notifications
 * Automatically updates whenever notifications change in Firestore
 */
export class NotificationListener {
  private unsubscribe: Unsubscribe | null = null;
  private listeners: Set<(notifications: Notification[]) => void> = new Set();

  /**
   * Subscribe to user's role-based notifications in real-time
   * @param userRole - User's role (admin, collector, user)
   * @param userId - Optional: user's UID for personal notifications
   * @param maxResults - Optional: limit number of results (default: 50)
   */
  subscribeToRoleNotifications(
    userRole: UserRole,
    userId?: string,
    maxResults: number = 50
  ): void {
    if (!db) {
      console.warn('Firestore is not initialized. Skipping subscription.');
      return;
    }
    const notificationsRef = collection(db, 'notifications');

    // Query for role-based notifications, ordered by newest first
    const q = query(
      notificationsRef,
      where('role', '==', userRole),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    this.unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifications: Notification[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          // Include if it's for their role or specifically for their userId
          if (!data.userId || data.userId === userId) {
            notifications.push({
              id: doc.id,
              ...data,
            } as Notification);
          }
        });

        // Notify all listeners
        this.listeners.forEach((listener) => listener(notifications));
      },
      (error) => {
        console.error('Error listening to notifications:', error);
      }
    );
  }

  /**
   * Subscribe to personal notifications for a specific user
   * @param userId - User's UID
   * @param userRole - User's role for role-based broadcast notifications
   * @param maxResults - Optional: limit number of results (default: 50)
   */
  subscribeToPersonalNotifications(
    userId: string,
    userRole: UserRole,
    maxResults: number = 50
  ): void {
    if (!db) {
      console.warn('Firestore is not initialized. Skipping subscription.');
      return;
    }
    const notificationsRef = collection(db, 'notifications');

    // Query for both role-based AND personal notifications
    // Note: Firestore doesn't support OR queries, so we use two separate listeners
    const roleQuery = query(
      notificationsRef,
      where('role', '==', userRole),
      where('userId', '==', null),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    const personalQuery = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    let roleNotifications: Notification[] = [];
    let personalNotifications: Notification[] = [];

    // Subscribe to role notifications
    const unsubscribeRole = onSnapshot(
      roleQuery,
      (snapshot) => {
        roleNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Notification));

        this.notifyListeners([...roleNotifications, ...personalNotifications]);
      },
      (error) => {
        console.error('Error listening to role notifications:', error);
      }
    );

    // Subscribe to personal notifications
    const unsubscribePersonal = onSnapshot(
      personalQuery,
      (snapshot) => {
        personalNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Notification));

        this.notifyListeners([...roleNotifications, ...personalNotifications]);
      },
      (error) => {
        console.error('Error listening to personal notifications:', error);
      }
    );

    // Store unsubscribe function
    this.unsubscribe = () => {
      unsubscribeRole();
      unsubscribePersonal();
    };
  }

  /**
   * Subscribe to unread notifications only
   * @param userRole - User's role
   * @param userId - Optional: user's UID
   */
  subscribeToUnreadNotifications(
    userRole: UserRole,
    userId?: string
  ): void {
    if (!db) {
      console.warn('Firestore is not initialized. Skipping subscription.');
      return;
    }
    const notificationsRef = collection(db, 'notifications');

    const q = query(
      notificationsRef,
      where('role', '==', userRole),
      where('status', '==', 'unread'),
      orderBy('createdAt', 'desc')
    );

    this.unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifications: Notification[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.userId || data.userId === userId) {
            notifications.push({
              id: doc.id,
              ...data,
            } as Notification);
          }
        });

        this.listeners.forEach((listener) => listener(notifications));
      },
      (error) => {
        console.error('Error listening to unread notifications:', error);
      }
    );
  }

  /**
   * Register a callback to be called when notifications update
   * @param callback - Function to call with updated notifications
   * @returns Function to unregister the callback
   */
  onUpdate(
    callback: (notifications: Notification[]) => void
  ): () => void {
    this.listeners.add(callback);

    // Return unregister function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all registered listeners
   */
  private notifyListeners(notifications: Notification[]): void {
    this.listeners.forEach((listener) => listener(notifications));
  }

  /**
   * Stop listening to notifications
   */
  unsubscribeAll(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.listeners.clear();
  }

  /**
   * Get number of active listeners
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * Global notification listener instance (singleton)
 */
let notificationListenerInstance: NotificationListener | null = null;

/**
 * Get or create the global notification listener
 */
export function getNotificationListener(): NotificationListener {
  if (!notificationListenerInstance) {
    notificationListenerInstance = new NotificationListener();
  }
  return notificationListenerInstance;
}

/**
 * Dispose the global notification listener
 */
export function disposeNotificationListener(): void {
  if (notificationListenerInstance) {
    notificationListenerInstance.unsubscribeAll();
    notificationListenerInstance = null;
  }
}
