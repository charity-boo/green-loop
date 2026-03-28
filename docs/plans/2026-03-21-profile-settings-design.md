# Design Document: Profile Settings and Password Change

**Date:** 2026-03-21
**Status:** Approved
**Topic:** Implementation of a user profile management hub with secure password change functionality.

## 1. Overview
This feature provides authenticated users with a dedicated space to manage their personal information (name, profile photo) and update their security credentials (password) directly from the application.

## 2. Architecture & Components

### 2.1. Routing & Protection
- **Path:** `/profile`
- **File:** `app/(website)/profile/page.tsx`
- **Security:** Wrapped in `ProtectedRoute` component to ensure only logged-in users can access the page. Unauthenticated users will be redirected to `/auth/login`.

### 2.2. User Interface (UI)
- **Layout:** A centered, responsive card containing a tabbed interface (using `shadcn/ui` Tabs).
- **Tab 1: Account (Personal Details)**
    - **Avatar:** Circular display of the current `photoURL`. Includes an "Edit" button that triggers a file picker for uploading a new image.
    - **Display Name:** Editable text input initialized with the current `displayName`.
    - **Email:** Read-only text input (primary identifier).
    - **Action:** "Save Changes" button that persists updates to both Firebase Auth and the Firestore `users` collection.
- **Tab 2: Security (Password Management)**
    - **Current Password:** Required for re-authentication before sensitive changes.
    - **New Password:** Must meet minimum length requirements (6+ characters).
    - **Confirm New Password:** Must match the New Password field.
    - **Action:** "Update Password" button that performs the change.

## 3. Data Flow & Logic

### 3.1. Profile Updates
1.  **Image Upload:** New photos are uploaded to Firebase Storage via `lib/storage/image-service.ts` (`uploadImageAndGetURL`).
2.  **Auth Sync:** Use `updateProfile(auth.currentUser, { displayName, photoURL })` to update the Firebase Authentication state.
3.  **Firestore Sync:** Update the corresponding document in the `users` collection to keep data consistent across the platform.

### 3.2. Password Change
1.  **Re-authentication:** Before updating, the app will re-authenticate the user using their current credentials (email + current password) to ensure the session is fresh.
2.  **Update:** Use the Firebase Client SDK's `updatePassword(user, newPassword)` method.
3.  **Success Handling:** On success, clear the password fields and show a success toast.

## 4. Error Handling & Feedback
- **Validation:** Client-side validation for password length and matching.
- **Feedback:** Use `shadcn/ui` toast notifications (or standard alerts if toasts are unavailable) for both success and error states (e.g., "Profile updated successfully", "Incorrect current password").
- **Loading States:** Disable buttons and show spinners during async operations (uploading, saving, updating).

## 5. Testing Plan
- **Unit Tests:** Verify validation logic for password fields.
- **Integration Tests:** Ensure that updating the name in the Profile tab correctly reflects in the Navbar and Sidebar.
- **Security Tests:** Confirm that a user cannot change their password without providing the correct *current* password.
