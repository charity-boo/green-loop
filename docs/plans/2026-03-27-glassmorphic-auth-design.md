# Design Doc: Glassmorphic Floating Card Auth

**Date:** 2026-03-27
**Status:** Approved
**Topic:** Implementing a modern, glassmorphic floating card layout for login and registration.

## 1. Overview
The goal is to elevate the authentication experience by transitioning from a standard 50/50 split to a "Glassmorphic Floating Card" design. This involves using a full-screen, high-resolution nature background and placing the form inside a frosted-glass card (`backdrop-blur-xl`) that "floats" on the right side of the screen.

## 2. Design Direction: Immersive & Futuristic
The direction focuses on depth, transparency, and high-impact visual immersion.

### 2.1 Layout & Structure
- **Desktop (≥ 1024px)**:
  - **Background**: Full-screen, high-res nature background (`sustainablity.png`).
  - **The Card**: A fixed-width, floating card (approx. 450px wide) on the right side of the screen.
  - **Floating Effect**: Subtle shadows (`shadow-2xl`) and a thin, white translucent border.
- **Mobile (< 1024px)**:
  - **Background**: Full-screen background (fixed).
  - **The Card**: Centered card with padding, taking up most of the screen width.

### 2.2 Visual Style (The "Glass" Effect)
- **Background**: `bg-white/10` or `bg-black/20` (depending on legibility).
- **Blur**: `backdrop-blur-xl` or `2xl` for a strong frosted-glass effect.
- **Typography**: Clean, high-contrast white (or very light gray) on the visual side, with sharp dark-green accents internally.
- **Inputs**: Transparent inputs with a subtle bottom border or soft background tints.
- **Animations**: The card should "float" in from a 5% transparency to 100% on page load.

## 3. Technical Implementation
- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS with custom backdrop filters.
- **Files Affected**:
  - `app/(website)/auth/login/page.tsx`
  - `app/(website)/auth/login/login-form.tsx`
  - `app/(website)/auth/register/page.tsx`

## 4. Success Criteria
- Immersive, full-screen visual experience.
- Consistent glassmorphism across both pages.
- Accessibility: Ensure form fields have sufficient contrast against the blurred background.
