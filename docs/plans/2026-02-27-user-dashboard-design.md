# Design Document: User Impact Dashboard

**Date:** 2026-02-27
**Status:** Approved
**Topic:** Implementing a high-fidelity, impact-driven dashboard for regular users.

---

## 1. Overview
The User Dashboard is designed to gamify and visualize the environmental impact of individual users. It transitions the user from a "customer" to a "circular economy participant" by highlighting their metrics, rewards, and history.

## 2. Aesthetic Direction: "Eco-Tech Premium"
- **Visuals**: Glassmorphic cards with semi-transparent backgrounds and heavy blurs.
- **Palette**: `Forest Mist` (dark/soft background), `Liquid Emerald` (primary gradients), and `Neon Grass` (accent for positive metrics).
- **Typography**: `Space Grotesk` or `Outfit` for large metrics; `Inter` or `HK Grotesk` for utility text.
- **Atmosphere**: Vibrant, alive, and responsive.

## 3. Architecture & Routing
- **New Page**: `app/(website)/dashboard/user/page.tsx`
- **Routing logic**: 
    - Users are redirected here after login.
    - Path is `/dashboard/user` to avoid conflicts with the admin dashboard at `/dashboard`.
- **RBAC**: Protected by `ProtectedRoute` and `middleware.ts`.

## 4. Logical Components
- **ImpactHero**: The focal point showing "Total Weight Diverted."
- **RewardsTracker**: A progress-based card for Green Points and Tier progression.
- **QuickActions**: A set of high-contrast triggers (e.g., "Schedule Pickup").
- **ActivityFeed**: A refined list/table of pickup history with point earnings.

## 5. Data Handling
- **Hydration**: Server-rendered KPIs using `getUserDashboardData(userId)`.
- **Interactivity**: Client-side components for charts (if needed) and progress animations.
- **Fallbacks**: Loading skeletons reflecting the Bento Grid structure.

## 6. Success Criteria
- [ ] User is correctly redirected to `/dashboard/user` after signing in.
- [ ] Dashboard renders without layout shifts using predefined skeletons.
- [ ] "Total Weight" and "Green Points" match the data in Firestore.
- [ ] "Schedule Pickup" button correctly links to `/schedule-pickup`.
