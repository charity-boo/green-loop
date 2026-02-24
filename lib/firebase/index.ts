/**
 * Firebase Notifications Module Index
 * 
 * Centralized exports for all Firebase notification features
 */

// Configuration
export { db, auth, default as app } from './config';

// Core notifications API
export {
  addNotification,
  getUserNotifications,
  markNotificationAsRead,
  markNotificationsAsRead,
  broadcastNotification,
  sendPersonalNotification,
  type Notification,
  type NotificationType,
  type NotificationStatus,
  type UserRole,
} from './notifications';

// Real-time listeners
export {
  NotificationListener,
  getNotificationListener,
  disposeNotificationListener,
} from './real-time';

// Advanced queries and batch operations
export {
  getFilteredNotifications,
  getNotificationsByType,
  getRecentNotifications,
  getUnreadCount,
  deleteNotifications,
  archiveOldNotifications,
  searchNotifications,
  getNotificationStats,
  type NotificationFilter,
  type PaginationOptions,
} from './advanced';

// Authentication integration
export {
  signInFirebase,
  signInWithGoogle,
  signOutFirebase,
  getFirebaseIdToken,
  verifyFirebaseToken,
} from './auth-integration';

export type { FirebaseAuthUser } from './auth-integration';
