# Design Document: Dashboard Access from Public Pages

**Date:** 2026-03-23
**Topic:** Improving UX for logged-in users by providing direct dashboard access from public pages.

## Overview
Currently, users who are logged in must either use the "Admin" link (if they are admins) or manually navigate to `/dashboard` to access their personalized view after returning to the homepage. This design adds a visible "Dashboard" link for all authenticated users in the primary navigation.

## Architecture
This change is a UI-level update in the main navigation component, leveraging the existing `AuthContext` to determine visibility.

## Components
- `components/layout/navbar.tsx`: Primary target for changes.
  - **Desktop Menu**: Add a conditional `<Link href="/dashboard">` visible when `user` is present.
  - **Mobile Menu**: Add a conditional `<Link href="/dashboard">` visible when `user` is present.

## Data Flow
- Uses `user` and `status` from `useAuth()` hook.
- `isLoading` status will be respected to prevent layout shift during session hydration.

## Error Handling
- If the dashboard route becomes inaccessible, the standard `middleware.ts` will redirect the user to login, maintaining security integrity.

## Testing Strategy
1. **Unauthenticated User**: Verify that "Dashboard" is NOT visible.
2. **Authenticated User (Customer)**: Verify that "Dashboard" IS visible and points to `/dashboard`.
3. **Authenticated User (Admin)**: Verify that both "Dashboard" and "Admin" are visible.
4. **Mobile Responsiveness**: Verify the link appears correctly in the mobile burger menu when logged in.
