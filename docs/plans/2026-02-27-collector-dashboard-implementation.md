# Collector "Field-Ops" Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a mobile-optimized, real-time dashboard for collectors using Firestore snapshots and Approach A (Hook Pattern).

**Architecture:** A segmented Next.js route structure (`/dashboard/collector`) using specialized Firestore hooks for real-time state management and a touch-optimized UI.

**Tech Stack:** Next.js, Firebase (Auth, Firestore, Storage), Tailwind CSS, Framer Motion.

---

### Task 1: Route Setup & Role-Based Middleware

**Files:**
- Create: `app/(website)/dashboard/collector/page.tsx`
- Modify: `middleware.ts`

**Step 1: Create the collector dashboard placeholder**
Create a basic page at `app/(website)/dashboard/collector/page.tsx` that displays "Collector Dashboard".

**Step 2: Update middleware**
Modify `middleware.ts` to include `/dashboard/collector` in the protected routes.

**Step 3: Verification**
Try to access `/dashboard/collector` without being logged in. Expect redirection to login.

**Step 4: Commit**
`git add app/(website)/dashboard/collector/page.tsx middleware.ts`
`git commit -m "feat: setup collector dashboard route and middleware"`

---

### Task 2: Real-time Firestore Hook (`useCollectorTasks`)

**Files:**
- Create: `hooks/use-collector-tasks.ts`
- Modify: `lib/firebase/config.ts`

**Step 1: Enable Firestore Persistence**
Ensure `enableIndexedDbPersistence` is correctly configured in `lib/firebase/config.ts`.

**Step 2: Implement the hook**
Create `hooks/use-collector-tasks.ts` using `onSnapshot` to listen to `waste_schedules` where `collectorId` matches the current user.

**Step 3: Commit**
`git add hooks/use-collector-tasks.ts lib/firebase/config.ts`
`git commit -m "feat: add useCollectorTasks real-time hook"`

---

### Task 3: Home Tab - Task Queue UI

**Files:**
- Create: `components/dashboard/collector/task-list.tsx`
- Create: `components/dashboard/collector/task-card.tsx`

**Step 1: Build TaskCard**
Create a mobile-optimized card showing job priority, AI category, and status.

**Step 2: Build TaskList**
Create a list component that uses `useCollectorTasks` and maps over the data.

**Step 3: Commit**
`git add components/dashboard/collector/`
`git commit -m "feat: implement real-time task queue UI"`

---

### Task 4: Active Job View & Status Management

**Files:**
- Create: `app/(website)/dashboard/collector/active/[jobId]/page.tsx`
- Create: `hooks/use-active-job.ts`

**Step 1: Create the active job page**
Implement a focused view for a single job.

**Step 2: Implement status updates**
Add buttons to transition status from `PENDING` -> `ACTIVE` -> `COMPLETED`.

**Step 3: Commit**
`git add app/(website)/dashboard/collector/active/ hooks/use-active-job.ts`
`git commit -m "feat: add active job view and status management"`

---

### Task 5: Weight Entry & Photo Confirmation

**Files:**
- Create: `components/dashboard/collector/weight-entry.tsx`
- Create: `components/dashboard/collector/photo-upload.tsx`

**Step 1: Implement WeightEntry**
Large, touch-friendly numeric input for kg.

**Step 2: Implement PhotoUpload**
Integrate with Firebase Storage to upload before/after photos.

**Step 3: Commit**
`git add components/dashboard/collector/`
`git commit -m "feat: add weight entry and photo upload"`

---

### Task 6: Dual-Mode Polish & Animations

**Files:**
- Modify: `app/globals.css`
- Modify: `app/(website)/dashboard/collector/layout.tsx` (If exists)

**Step 1: Apply glassmorphism**
Refine Tailwind classes for premium light/dark modes.

**Step 2: Add transitions**
Use Framer Motion for smooth tab and card transitions.

**Step 3: Commit**
`git commit -m "style: final polish for collector dashboard aesthetics"`
