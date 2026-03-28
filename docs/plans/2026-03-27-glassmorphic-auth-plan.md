# Implementation Plan: Glassmorphic Floating Card Auth

> **For Claude:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign login and registration pages with a full-screen, nature-background, and a floating glassmorphic card.

---

### Task 1: Unify LoginPage with Full-Screen Background

**Files:**
- Modify: `app/(website)/auth/login/page.tsx`

**Steps:**
1.  **Change layout structure** to `relative min-h-screen overflow-hidden flex items-center justify-end`.
2.  **Add a full-screen background image** with `absolute inset-0 z-0 bg-cover bg-center`.
3.  **Add a dark-to-light linear gradient overlay** to the background for contrast.
4.  **Wrap the form container** in a `relative z-10 w-full max-w-lg p-6 lg:p-12 h-screen flex flex-col items-center justify-center`.

---

### Task 2: Refactor LoginForm to Glassmorphic Style

**Files:**
- Modify: `app/(website)/auth/login/login-form.tsx`

**Steps:**
1.  **Add a floating card wrapper** to the form: `bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 lg:p-10`.
2.  **Update Typography**: Ensure headlines and descriptions are high-contrast white (or neutral).
3.  **Refine Input fields**: Keep the current minimalist look but ensure they sit perfectly in the glass container.
4.  **Improve Login/Google buttons** with high-impact color.

---

### Task 3: Apply Glassmorphic Layout to RegisterPage

**Files:**
- Modify: `app/(website)/auth/register/page.tsx`

**Steps:**
1.  **Refactor the current split layout (flex-row)** into the `relative min-h-screen` full-screen structure.
2.  **Apply the same glassmorphic card styling** to the registration form container.
3.  **Audit for consistency** in spacing, animation, and background images.

---

### Task 4: Responsive Verification

**Steps:**
1.  **Verify desktop "Floating Right" behavior.**
2.  **Verify mobile "Centered" behavior.**
3.  **Test both Login and Registration workflows.**
