# Dashboard Access from Public Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a conditional "Dashboard" link to the primary navigation bar for authenticated users, allowing them to jump back into their account without re-logging.

**Architecture:** Update the `GreenLoopNavBar` component to conditionally render a Link based on the `user` object from `useAuth`.

**Tech Stack:** React, Next.js (Link), Tailwind CSS.

---

### Task 1: Add Dashboard link to Desktop Menu

**Files:**
- Modify: `components/layout/navbar.tsx`

**Step 1: Identify insertion point in Desktop Menu**
Locate the desktop menu links (around lines 70-150). We want to place it after "Our Services" and before the "About Us" dropdown.

**Step 2: Add conditional logic for Dashboard link**
Add the following code block:
```tsx
{user && (
  <Link href="/dashboard" className="text-gray-700 hover:text-green-700 font-medium transition">
    Dashboard
  </Link>
)}
```

**Step 3: Commit**
```bash
git add components/layout/navbar.tsx
git commit -m "feat(ui): add dashboard link to desktop navbar for authenticated users"
```

---

### Task 2: Add Dashboard link to Mobile Menu

**Files:**
- Modify: `components/layout/navbar.tsx`

**Step 1: Identify insertion point in Mobile Menu**
Locate the mobile menu links (around lines 180-200). We want to place it after "Our Services".

**Step 2: Add conditional logic for Mobile Dashboard link**
Add the following code block:
```tsx
{user && (
  <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="text-gray-700 hover:text-green-700">
    Dashboard
  </Link>
)}
```

**Step 3: Commit**
```bash
git add components/layout/navbar.tsx
git commit -m "feat(ui): add dashboard link to mobile navbar for authenticated users"
```

---

### Task 3: Verification

**Step 1: Manual Verification (Simulated/Check)**
Since I cannot interactively browse:
1. Ensure the code compiles.
2. Verify that `user` is correctly destructured from `useAuth()`.
3. Verify that `setIsMobileOpen(false)` is called on the mobile link click to close the drawer.

Run build to check for type errors:
`pnpm build`
