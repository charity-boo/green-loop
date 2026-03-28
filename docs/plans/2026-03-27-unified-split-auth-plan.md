# Implementation Plan: Unified Split-Screen Auth

> **For Claude:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the login and registration pages into a cohesive 50/50 split layout.

---

### Task 1: Unify Login Page Structure

**Files:**
- Modify: `app/(website)/auth/login/page.tsx`

**Steps:**
1.  **Replace current centered container** with the `flex-col lg:flex-row` split structure.
2.  **Add Left Side Visual** using `sustainablity.png`.
3.  **Use updated "Welcome Back" copy** for the headline and sub-headline.
4.  **Add Mobile Hero image** at the top of the form side.

---

### Task 2: Refactor LoginForm for Minimalist Aesthetic

**Files:**
- Modify: `app/(website)/auth/login/login-form.tsx`

**Steps:**
1.  **Remove `Card` component** wrap to flow naturally in the split layout.
2.  **Update Input and Label styling** to match the "border-none" minimalist style used in registration.
3.  **Refine the "Sign In" button** with consistent size and hover effects.
4.  **Ensure Google/Social buttons** are consistently sized.

---

### Task 3: Audit & Sync Register Page

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Steps:**
1.  **Ensure spacing and typography** exactly match the newly updated login page.
2.  **Verify animations** (e.g., `animate-in fade-in`) are applied consistently.

---

### Task 4: Verification

**Steps:**
1.  **Check desktop layout** for both `/auth/login` and `/auth/register`.
2.  **Check mobile layout** (stacked view) for both.
3.  **Verify login functionality** with an existing user.
4.  **Verify registration functionality** for a new user.
