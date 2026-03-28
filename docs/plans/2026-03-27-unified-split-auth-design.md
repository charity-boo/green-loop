# Design Doc: Unified Split-Screen Auth

**Date:** 2026-03-27
**Status:** Approved
**Topic:** Unifying the registration and login pages with a 50/50 split layout.

## 1. Overview
The goal is to create a consistent, high-impact authentication experience by applying the existing split-layout design from the `RegisterPage` to the `LoginPage`. This ensures that all entry points into the platform feel premium and align with the Green Loop brand.

## 2. Design Direction: Minimalist & High-Impact
The chosen direction focuses on professional aesthetics, bold typography, and a "clean" feel.

### 2.1 Layout & Structure
- **Desktop (≥ 1024px)**: A 50/50 horizontal split.
  - **Left Pane (Visual)**: Fixed position, full-height (100vh). Features a high-resolution outdoor nature photo (`sustainablity.png`).
  - **Right Pane (Form)**: Scrollable, full-height, centered form.
- **Mobile (< 1024px)**: Stacks vertically. The image becomes a smaller hero section at the top, followed by the form.

### 2.2 Visual Style
- **Left Side (Branding)**: 
  - **Register**: "Join the Green Revolution"
  - **Login**: "Welcome Back to the Loop"
  - **Overlay**: Dark gradient fade for text legibility.
- **Right Side (Form)**:
  - **Background**: Neutral bg (`bg-background`).
  - **Form Style**: No heavy cards or nested borders; clean labels and minimalist inputs with green `#16a34a` for focus.
  - **Primary Button**: High-contrast green button with hover scale effects.

## 3. Technical Implementation
- **Framework**: Next.js (App Router).
- **Files Affected**:
  - `app/(website)/auth/login/page.tsx`: Update layout to split-screen.
  - `app/(website)/auth/login/login-form.tsx`: Refactor from `Card` display to minimalist form.
  - `app/(website)/auth/register/page.tsx`: Small audit to ensure it matches the new login style.

## 4. Success Criteria
- Responsive across all device sizes.
- Perfectly consistent design between login and registration.
- All existing Firebase and redirection logic is intact.
