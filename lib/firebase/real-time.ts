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
    this.subscribeToPersonalNotifications(userId, userRole, maxResults);
  }

  /**
   * Subscribe to personal notifications for a specific user
   * @param userId - User's UID
   * @param userRole - User's role for role-based broadcast notifications
   * @param maxResults - Optional: limit number of results (default: 50)
   */
  subscribeToPersonalNotifications(
    userId?: string,
    userRole: UserRole = 'USER',
    maxResults: number = 50
  ): void {
    if (!db) {
      console.warn('Firestore is not initialized. Skipping subscription.');
      return;
    }
    const notificationsRef = collection(db, 'notifications');

    // Query for role-based notifications (where userId is explicitly null)
    const roleQuery = query(
      notificationsRef,
      where('role', '==', userRole),
      where('userId', '==', null),
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

        this.updateAndNotify(roleNotifications, personalNotifications);
      },
      (error) => {
        console.error('Error listening to role notifications:', error);
      }
    );

    let unsubscribePersonal = () => {};

    if (userId) {
      // Query for personal notifications (specifically for this user)
      const personalQuery = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );

      // Subscribe to personal notifications
      unsubscribePersonal = onSnapshot(
        personalQuery,
        (snapshot) => {
          personalNotifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Notification));

          this.updateAndNotify(roleNotifications, personalNotifications);
        },
        (error) => {
          console.error('Error listening to personal notifications:', error);
        }
      );
    }

    // Store combined unsubscribe function
    this.unsubscribe = () => {
      unsubscribeRole();
      unsubscribePersonal();
    };
  }

  /**
   * Helper to merge and sort notifications from two different queries
   */
  private updateAndNotify(roleNotes: Notification[], personalNotes: Notification[]): void {
    const combined = [...roleNotes, ...personalNotes].sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || 0;
      const timeB = b.createdAt?.toMillis() || 0;
      return timeB - timeA;
    });
    this.listeners.forEach((listener) => listener(combined));
  }

  /**
   * Subscribe to unread notifications only
   * @param userRole - User's role
   * @param userId - Optional: user's UID
   * @param maxResults - Optional: limit number of results (default: 50)
   */
  subscribeToUnreadNotifications(
    userRole: UserRole,
    userId?: string,
    maxResults: number = 50
  ): void {
    if (!db) {
      console.warn('Firestore is not initialized. Skipping subscription.');
      return;
    }
    const notificationsRef = collection(db, 'notifications');

    // Role-based unread
    const roleQuery = query(
      notificationsRef,
      where('role', '==', userRole),
      where('userId', '==', null),
      where('status', '==', 'unread'),
      orderBy('createdAt', 'desc'),
      limit(maxResults)
    );

    let roleUnread: Notification[] = [];
    let personalUnread: Notification[] = [];

    const unsubscribeRole = onSnapshot(
      roleQuery,
      (snapshot) => {
        roleUnread = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Notification));
        this.updateAndNotify(roleUnread, personalUnread);
      },
      (error) => {
        console.error('Error listening to role unread notifications:', error);
      }
    );

    let unsubscribePersonal = () => {};

    if (userId) {
      // Personal unread
      const personalQuery = query(
        notificationsRef,
        where('userId', '==', userId),
        where('status', '==', 'unread'),
        orderBy('createdAt', 'desc'),
        limit(maxResults)
      );

      unsubscribePersonal = onSnapshot(
        personalQuery,
        (snapshot) => {
          personalUnread = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Notification));
          this.updateAndNotify(roleUnread, personalUnread);
        },
        (error) => {
          console.error('Error listening to personal unread notifications:', error);
        }
      );
    }

    this.unsubscribe = () => {
      unsubscribeRole();
      unsubscribePersonal();
    };
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
