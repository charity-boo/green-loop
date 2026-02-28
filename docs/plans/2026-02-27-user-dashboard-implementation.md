# User Impact Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a premium, glassmorphic User Dashboard at `/dashboard/user` that visualizes recycling impact and rewards.

**Architecture:** RSC Page (`page.tsx`) fetches user-specific data from Firestore via `getUserDashboardData`. A Client Component (`dashboard-client.tsx`) manages the glassmorphic UI, animations, and bento grid layout.

**Tech Stack:** Next.js 15, Tailwind CSS, Framer Motion, Lucide React, Firebase Admin SDK.

---

### Task 1: Consolidate Redirection Logic
**Files:**
- Modify: `app/(website)/auth/login/login-form.tsx`
- Modify: `app/(website)/auth/login/page.tsx`

**Step 1: Update LoginForm to use `/dashboard/user` consistently**
Ensure the client-side redirect points exactly to `/dashboard/user`.

**Step 2: Update LoginPage (RSC) to use `/dashboard/user`**
Change the server-side session redirect from `/dashboard` to `/dashboard/user` for non-admin/collector roles.

**Step 3: Commit**
```bash
git add app/(website)/auth/login/
git commit -m "chore(auth): align user redirects to /dashboard/user"
```

---

### Task 2: Create User Dashboard UI Components
**Files:**
- Create: `components/user/impact-hero.tsx`
- Create: `components/user/rewards-tracker.tsx`
- Create: `components/user/activity-history.tsx`

**Step 1: Implement `ImpactHero`**
Build a glassmorphic component that displays the total weight diverted with a prominent animated counter.

**Step 2: Implement `RewardsTracker`**
Create the "Green Points" card with a gradient progress bar and tier badges (Bronze, Silver, Gold, Platinum).

**Step 3: Implement `ActivityHistory`**
Develop a clean table/list for pickup history using the existing `PickupHistoryItem` type.

**Step 4: Commit**
```bash
git add components/user/
git commit -m "feat(ui): add glassmorphic user dashboard components"
```

---

### Task 3: Implement the User Dashboard Page
**Files:**
- Create: `app/(website)/dashboard/user/page.tsx`
- Create: `app/(website)/dashboard/user/dashboard-client.tsx`

**Step 1: Build the Dashboard Client (`dashboard-client.tsx`)**
Assemble the Bento Grid using `ImpactHero`, `RewardsTracker`, and `ActivityHistory`. Add `framer-motion` for entrance animations.

**Step 2: Build the Server Page (`page.tsx`)**
1. Import `getSession` and `getUserDashboardData`.
2. Await the session and fetch data for the current user.
3. Pass the data to `DashboardClient`.
4. Wrap the whole thing in a `ProtectedRoute` for role: `USER`.

**Step 3: Commit**
```bash
git add app/(website)/dashboard/user/
git commit -m "feat(dashboard): implement user impact dashboard page"
```

---

### Task 4: Final Verification
**Step 1: Test Login Flow**
Sign in with a test user account and verify the browser lands on `/dashboard/user`.

**Step 2: Check Layout & Data**
1. Verify the Glassmorphic effect (blur/transparency) is visible.
2. Ensure metrics (Weight, Points) load correctly.
3. Click "Schedule Pickup" to ensure it routes correctly.
