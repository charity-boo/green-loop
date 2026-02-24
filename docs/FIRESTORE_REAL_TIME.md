# Firestore Real-Time Notifications - Implementation Guide

## Overview

The real-time notification system provides live updates to client applications using Firestore's `onSnapshot` listener. This guide covers all available features and best practices.

## Files Added

1. **`lib/firebase/real-time.ts`** - Real-time listener implementation
2. **`hooks/useNotifications.ts`** - React hooks for component integration
3. **`lib/firebase/advanced.ts`** - Advanced filtering, pagination, and batch operations

## Real-Time Listeners

### Basic Usage

```typescript
import { getNotificationListener } from '@/lib/firebase/real-time';

const listener = getNotificationListener();

// Subscribe to notifications for a role
listener.subscribeToRoleNotifications('admin', userId);

// Register callback for updates
const unregister = listener.onUpdate((notifications) => {
  console.log('Notifications updated:', notifications);
});

// Cleanup
unregister();
listener.unsubscribeAll();
```

### Available Listener Methods

#### `subscribeToRoleNotifications(userRole, userId?, maxResults?)`
- Subscribes to role-based broadcast notifications
- Optional: filter by personal notifications (userId)
- Returns: Updates automatically via registered callbacks

```typescript
listener.subscribeToRoleNotifications('collector', userId, 50);
```

#### `subscribeToPersonalNotifications(userId, userRole, maxResults?)`
- Subscribes to both role-based AND personal notifications
- Merges results from both queries
- Recommended for most use cases

```typescript
listener.subscribeToPersonalNotifications(userId, 'user', 100);
```

#### `subscribeToUnreadNotifications(userRole, userId?)`
- Subscribes to unread notifications only
- Lightweight for badge/counter displays

```typescript
listener.subscribeToUnreadNotifications('admin', userId);
```

## React Hooks

### `useNotifications` Hook

Get all notifications with automatic real-time updates:

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function NotificationCenter() {
  const { notifications, loading, error } = useNotifications('admin', userId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {notifications.map((notif) => (
        <NotificationItem key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
```

**Return Type:**
```typescript
{
  notifications: Notification[];
  loading: boolean;
  error: Error | null;
}
```

### `useUnreadNotifications` Hook

Get unread notifications only:

```typescript
import { useUnreadNotifications } from '@/hooks/useNotifications';

function UnreadPanel() {
  const { unreadNotifications, unreadCount, loading } = useUnreadNotifications(
    'user',
    userId
  );

  return (
    <div>
      <h2>Unread ({unreadCount})</h2>
      {unreadNotifications.map((notif) => (
        <UnreadItem key={notif.id} notification={notif} />
      ))}
    </div>
  );
}
```

**Return Type:**
```typescript
{
  unreadNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
}
```

### `useUnreadNotificationCount` Hook

Lightweight hook for badge displays:

```typescript
import { useUnreadNotificationCount } from '@/hooks/useNotifications';

function NotificationBadge() {
  const unreadCount = useUnreadNotificationCount('admin', userId);

  return <span className="badge">{unreadCount}</span>;
}
```

**Return Type:** `number`

## Advanced Features

### Filtered Queries

```typescript
import { getFilteredNotifications } from '@/lib/firebase/advanced';

// Get specific notification types
const result = await getFilteredNotifications(
  {
    role: 'admin',
    type: 'alert',
    status: 'unread',
  },
  { pageSize: 20 }
);

const { notifications, lastDoc } = result;
```

### Pagination

```typescript
// First page
const { notifications: page1, lastDoc } = await getFilteredNotifications(
  { role: 'user' },
  { pageSize: 10 }
);

// Next page
const { notifications: page2, lastDoc: nextDoc } = await getFilteredNotifications(
  { role: 'user' },
  { pageSize: 10, startAfterDoc: lastDoc }
);
```

### Get Notifications by Type

```typescript
import { getNotificationsByType } from '@/lib/firebase/advanced';

const alerts = await getNotificationsByType('alert', 'admin', userId);
const suggestions = await getNotificationsByType('AI-suggestion', 'user', userId);
```

### Recent Notifications

```typescript
import { getRecentNotifications } from '@/lib/firebase/advanced';

// Get notifications from last 24 hours
const recent = await getRecentNotifications('collector', 24, userId);

// Get notifications from last 7 days
const weekly = await getRecentNotifications('collector', 168, userId);
```

### Unread Count (Fast Query)

```typescript
import { getUnreadCount } from '@/lib/firebase/advanced';

const count = await getUnreadCount('admin', userId);
```

### Statistics

```typescript
import { getNotificationStats } from '@/lib/firebase/advanced';

const stats = await getNotificationStats('user', userId);
// Returns:
// {
//   total: 42,
//   unread: 8,
//   byType: { alert: 3, warning: 2, info: 2, 'AI-suggestion': 1 }
// }
```

### Search Notifications

```typescript
import { searchNotifications } from '@/lib/firebase/advanced';

const results = await searchNotifications(
  'admin',
  'maintenance alert',
  userId
);
```

### Batch Operations

#### Archive Old Notifications

```typescript
import { archiveOldNotifications } from '@/lib/firebase/advanced';

// Mark unread notifications older than 30 days as read
const archived = await archiveOldNotifications(30);
console.log(`Archived ${archived} notifications`);
```

#### Delete Notifications

```typescript
import { deleteNotifications } from '@/lib/firebase/advanced';

const ids = ['notif1', 'notif2', 'notif3'];
await deleteNotifications(ids);
```

## Performance Considerations

### Memory Management

1. **Unsubscribe properly**: Always call `unsubscribeAll()` when done
2. **Multiple listeners**: Each listener creates a connection - reuse when possible
3. **Component unmount**: React hooks automatically clean up on unmount

### Query Optimization

1. **Limit results**: Use `pageSize` parameter to limit fetched data
2. **Filter early**: Use Firestore queries instead of client-side filtering
3. **Real-time vs one-time**: Use `getDocs()` for one-time queries, `onSnapshot()` for live updates

### Best Practices

```typescript
// ✅ Good: Reuse global listener
const listener = getNotificationListener();
listener.subscribeToPersonalNotifications(userId, role);

// ❌ Avoid: Creating new listeners repeatedly
for (let i = 0; i < 10; i++) {
  new NotificationListener().subscribeToRoleNotifications(role);
}

// ✅ Good: Register multiple callbacks on one listener
listener.onUpdate(callback1);
listener.onUpdate(callback2);

// ❌ Avoid: Separate listeners for each callback
const listener1 = getNotificationListener();
const listener2 = getNotificationListener();
```

## Error Handling

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function SafeNotificationPanel() {
  const { notifications, error } = useNotifications('admin', userId);

  if (error) {
    return (
      <div className="error">
        <h3>Failed to load notifications</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return <NotificationList notifications={notifications} />;
}
```

## Indexing Requirements

For optimal performance, Firestore needs these indexes:

1. **`notifications` collection, `role` + `createdAt`**
   - Used by: `subscribeToRoleNotifications`
   - Status: Auto-created on first query

2. **`notifications` collection, `userId` + `createdAt`**
   - Used by: `subscribeToPersonalNotifications`
   - Status: Auto-created on first query

3. **`notifications` collection, `role` + `status` + `createdAt`**
   - Used by: `subscribeToUnreadNotifications` with filtering
   - Status: May require manual creation

Firestore will suggest index creation automatically when queries require them.

## Testing Real-Time Features

### With Firebase Emulator

```bash
# Start emulator
firebase emulators:start

# Update config to use emulator
import { connectFirestoreEmulator } from 'firebase/firestore';

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

### Example Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

test('notifications update in real-time', async () => {
  const { rerender } = render(
    <NotificationPanel userId="test-user" />
  );

  // Wait for initial load
  await waitFor(() => {
    expect(screen.getByText(/loading/i)).not.toBeInTheDocument();
  });

  // Verify notifications rendered
  expect(screen.getByText(/notifications/i)).toBeInTheDocument();
});
```

## Common Patterns

### Notification Center Component

```typescript
function NotificationCenter() {
  const { notifications, loading } = useNotifications(userRole, userId);
  const unreadCount = useUnreadNotificationCount(userRole, userId);

  return (
    <div className="notification-center">
      <header>
        <h2>Notifications</h2>
        {unreadCount > 0 && <Badge count={unreadCount} />}
      </header>

      {loading ? (
        <Skeleton />
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
}
```

### Notification Bell with Badge

```typescript
function NotificationBell() {
  const unreadCount = useUnreadNotificationCount(userRole, userId);
  const [open, setOpen] = useState(false);

  return (
    <div className="notification-bell">
      <button onClick={() => setOpen(!open)} className="bell-icon">
        🔔
        {unreadCount > 0 && <Badge count={unreadCount} />}
      </button>

      {open && <NotificationPanel />}
    </div>
  );
}
```

### Auto-refresh with Interval

```typescript
function NotificationPoll() {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Optional: Manual refresh (real-time listeners handle this automatically)
      setLastUpdate(new Date());
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const { notifications } = useNotifications(userRole, userId);

  return <NotificationList notifications={notifications} lastUpdate={lastUpdate} />;
}
```

## Troubleshooting

### Notifications not updating

1. Check Firestore security rules are correct
2. Verify user auth token has `role` custom claim
3. Check browser console for errors
4. Enable Firestore logging: `enableLogging(true);`

### Performance issues

1. Reduce `maxResults` parameter
2. Use `subscribeToUnreadNotifications` instead of full list
3. Implement pagination with `getFilteredNotifications`
4. Check Firestore quota usage in Firebase Console

### Memory leaks

1. Always call `listener.unsubscribeAll()` in cleanup
2. Use React hooks (automatic cleanup on unmount)
3. Avoid creating listeners in render functions

## API Reference

See `lib/firebase/real-time.ts`, `hooks/useNotifications.ts`, and `lib/firebase/advanced.ts` for complete API documentation.
