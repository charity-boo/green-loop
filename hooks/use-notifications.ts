import { useEffect, useState } from 'react';
import { Notification, UserRole } from '@/lib/firebase/notifications';
import {
  getNotificationListener,
} from '@/lib/firebase/real-time';

/**
 * Hook for subscribing to real-time notifications
 * Automatically cleans up listeners on unmount
 */
export function useNotifications(userRole: UserRole, userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // The getNotificationListener function retrieves a singleton instance of our real-time
      // listener. This listener is responsible for subscribing to Firestore updates.
      const listener = getNotificationListener();

      // Subscribe to role-based and personal notifications. This method uses Firestore's
      // onSnapshot functionality under the hood, which pushes real-time updates from the
      // database to the client.
      listener.subscribeToPersonalNotifications(userId || '', userRole);

      // Register a callback that fires whenever the onSnapshot listener in Firebase detects
      // a change (e.g., a new AI classification notification). The new array of notifications
      // is passed to our component's state, triggering an immediate UI update.
      const unregister = listener.onUpdate((newNotifications) => {
        setNotifications(newNotifications);
        setLoading(false);
      });

      // Cleanup on unmount: The unregister function detaches the onUpdate callback, and
      // the listener is fully unsubscribed from Firestore if no other components are using it.
      return () => {
        unregister();
        if (listener.getListenerCount() === 0) {
          listener.unsubscribeAll();
        }
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setLoading(false);
    }
  }, [userRole, userId]);

  return { notifications, loading, error };
}

/**
 * Hook for subscribing to unread notifications only
 */
export function useUnreadNotifications(userRole: UserRole, userId?: string) {
  const [unreadNotifications, setUnreadNotifications] = useState<
    Notification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const listener = getNotificationListener();

      // Subscribe to unread notifications only
      listener.subscribeToUnreadNotifications(userRole, userId);

      // Register callback
      const unregister = listener.onUpdate((newNotifications) => {
        setUnreadNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
        setLoading(false);
      });

      // Cleanup on unmount
      return () => {
        unregister();
      };
    } catch (err) {
      console.error('Error in useUnreadNotifications:', err);
      setLoading(false);
    }
  }, [userRole, userId]);

  return { unreadNotifications, unreadCount, loading };
}

/**
 * Hook to get unread notification count only (lightweight)
 * Useful for badge displays
 */
export function useUnreadNotificationCount(
  userRole: UserRole,
  userId?: string
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const listener = getNotificationListener();
      listener.subscribeToUnreadNotifications(userRole, userId);

      const unregister = listener.onUpdate((notifications) => {
        setCount(notifications.length);
      });

      return () => {
        unregister();
      };
    } catch (err) {
      console.error('Error in useUnreadNotificationCount:', err);
    }
  }, [userRole, userId]);

  return count;
}
