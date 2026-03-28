# Firebase Storage Rules Deployment Guide

## Overview
The Firebase Storage rules have been updated to remove the critical vulnerability where unrestricted access was granted until 2026-03-26.

## New Rules Summary

### Security Features
1. **Authentication Required**: All access requires Firebase authentication
2. **Role-Based Access Control**: Uses custom claims (USER, ADMIN, COLLECTOR roles)
3. **File Size Limits**: Maximum 10MB for uploads
4. **File Type Validation**: Only image files allowed for uploads
5. **Owner-Based Access**: Users can only upload to their own paths

### Path Structure and Permissions

#### `/users/{userId}/profile/{fileName}`
- **Read**: Any authenticated user
- **Write**: Owner only + valid image + <10MB
- **Delete**: Owner or Admin

#### `/waste/{userId}/{scheduleId}/{fileName}`
- **Read**: Any authenticated user (allows collectors to view)
- **Write**: Owner only + valid image + <10MB
- **Delete**: Owner or Admin

#### `/waste-reports/{userId}/{reportId}/{fileName}`
- **Read**: Any authenticated user
- **Write**: Owner only + valid image + <10MB
- **Delete**: Owner or Admin

#### `/admin/{category}/{fileName}`
- **Read**: Any authenticated user
- **Write/Delete**: Admin only

#### Default (all other paths)
- **All access denied**

## Deployment Instructions

### For Production Deployment

The storage rules are configured in `firebase.json` to use `storage.rules`.

**Deploy to Firebase:**
```bash
firebase deploy --only storage
```

**Note**: You need appropriate Google Cloud IAM permissions:
- `roles/serviceusage.serviceUsageConsumer` or
- Custom role with `serviceusage.services.use` permission

If you encounter permission errors, contact your Firebase project admin to grant access via:
https://console.cloud.google.com/iam-admin/iam

### For Local Testing (Emulator)

The Firebase emulators automatically load rules from `storage.rules`.

**Start emulators:**
```bash
firebase emulators:start
```

**Or with auto-import/export:**
```bash
firebase emulators:exec --import=.firebase-emulator-data --export-on-exit=.firebase-emulator-data "npm run dev"
```

**Important**: After modifying `storage.rules`, restart the emulators to reload the rules.

## Testing

A comprehensive test suite is available:

```bash
npx tsx scripts/test-storage-rules.ts
```

**Test Coverage:**
1. ✅ Unauthenticated access (should fail)
2. ✅ Authenticated user uploading own profile (should succeed)
3. ✅ User uploading to another user's profile (should fail)
4. ✅ File size validation (>10MB should fail)
5. ✅ File type validation (non-images should fail)
6. ✅ Waste images upload/read
7. ✅ Default path access (should fail)

**Prerequisites for testing:**
- Firebase emulators must be running
- Run: `firebase emulators:start` in a separate terminal

## Rollback Plan

If issues arise, you can temporarily restore the old rules (NOT RECOMMENDED - security vulnerability):

```bash
git checkout HEAD~1 -- storage.rules
firebase deploy --only storage
```

However, this would restore the expiring wildcard rule. Instead, adjust the new rules as needed.

## Monitoring

After deployment, monitor Firebase Console for:
- Denied requests (expected for unauthenticated users)
- Unexpected permission errors (may indicate role assignment issues)
- Storage usage patterns

**Firebase Console:**
https://console.firebase.google.com/project/green-loop-c9b5f/storage

## Related Files
- `storage.rules` - Security rules definition
- `firebase.json` - Firebase configuration
- `scripts/test-storage-rules.ts` - Test suite
- `scripts/set-user-role.ts` - Tool to assign user roles (ADMIN, USER, COLLECTOR)

## Custom Claims Setup

Users need proper role claims for admin access:

```bash
# Set a user as admin
npx tsx scripts/set-user-role.ts admin@example.com ADMIN

# Set a user as collector
npx tsx scripts/set-user-role.ts collector@example.com COLLECTOR
```

Users must sign out and sign back in for role changes to take effect.
