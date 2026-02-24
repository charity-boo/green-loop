# Firestore Notifications - Quick Reference

## Files Created

1. **`lib/firebase/config.ts`** - Firebase initialization and configuration
2. **`lib/firebase/notifications.ts`** - Notification service functions with TypeScript types
3. **`firestore.rules`** - Firestore security rules
4. **`FIRESTORE_NOTIFICATIONS.md`** - Complete documentation

## Quick Start

### 1. Setup Environment Variables
Add Firebase credentials to `.env.local`:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### 2. Deploy Security Rules
```bash
firebase deploy --only firestore:rules
```

### 3. Usage Examples

#### Send Broadcast Notification to All Admins
```typescript
import { broadcastNotification } from '@/lib/firebase/notifications';

await broadcastNotification(
  'admin',
  'System Maintenance',
  'Scheduled maintenance on Feb 10 at 2:00 AM UTC',
  'alert'
);
```

#### Send Personal Notification to User
```typescript
import { sendPersonalNotification } from '@/lib/firebase/notifications';

await sendPersonalNotification(
  userId,
  'user',
  'Reward Points Earned',
  'You earned 50 points!',
  'AI-suggestion'
);
```

#### Get User's Notifications
```typescript
import { getUserNotifications } from '@/lib/firebase/notifications';

const notifications = await getUserNotifications(userId, 'collector');
```

#### Mark as Read
```typescript
import { markNotificationAsRead } from '@/lib/firebase/notifications';

await markNotificationAsRead(notificationId);
```

## Document Structure

```
Collection: notifications/

notifications/{docId}
├── id: string (auto-generated)
├── userId: string (optional - for personal notifications)
├── role: string (admin | collector | user)
├── title: string
├── message: string
├── type: string (info | warning | alert | AI-suggestion)
├── status: string (unread | read)
└── createdAt: Timestamp
```

## Security Rules Summary

### What Users Can Do ✅
- Read notifications for their role
- Read personal notifications (userId matches their UID)
- Update status field only (mark as read)
- Delete personal notifications

### What Users Cannot Do ❌
- Read other roles' notifications
- Modify title, message, type fields
- Delete broadcast notifications
- Write invalid notification types/status values

## Key Features

1. **Role-Based Broadcasting** - Send notifications to all admins/collectors/users
2. **Personal Notifications** - Send to specific users by userId
3. **Type Flexibility** - info, warning, alert, or AI-suggestion
4. **Automatic Timestamps** - Server-side generated createdAt
5. **Status Tracking** - unread/read status management
6. **Type Safety** - Full TypeScript support with interfaces

## Notes

- Requires Firebase Auth with custom claims including `role` field
- All operations require user authentication
- No admin SDK needed for client-side operations
- Timestamps are server-generated to prevent tampering
- Personal notifications can only be deleted by the user they belong to
