# Design Doc: Modern Split-Layout Registration Page

**Date:** 2026-03-27
**Status:** Approved
**Topic:** Redesigning the `RegisterNow` page into a modern 50/50 split layout.

## 1. Overview
The goal is to replace the current centered-card registration page with a high-impact, modern split layout. This design aims to increase user engagement by visually representing the "Green Loop" mission on one side while providing a clean, distraction-free registration experience on the other.

## 2. Design Direction: Minimalist & High-Impact
The chosen direction focuses on professional aesthetics, bold typography, and a seamless user experience.

### 2.1 Layout & Structure
- **Desktop (≥ 1024px)**: A 50/50 horizontal split.
  - **Left Pane (Visual)**: Fixed position, full-height (100vh). Features a high-resolution background image with a text overlay.
  - **Right Pane (Form)**: Scrollable, full-height. Contains the registration form, vertically and horizontally centered.
- **Mobile (< 1024px)**: Stacks vertically. The image becomes a smaller hero section at the top, followed by the form.

### 2.2 Visual Style
- **Left Side (The "Mission" Side)**:
  - **Image**: Nature/Recycling theme (`/public/images/sustainablity.png`).
  - **Overlay**: A subtle dark-to-transparent linear gradient (`bg-gradient-to-t from-black/60 to-transparent`).
  - **Headline**: "Join the Green Revolution" (Bold, high-contrast white text, `text-5xl`).
  - **Sub-headline**: "Manage your waste, earn rewards, and save the planet."
- **Right Side (The "Action" Side)**:
  - **Background**: Clean, neutral (`bg-background` or `bg-slate-50`).
  - **Form Style**: Borderless, airy design with generous whitespace.
  - **Inputs**: Minimalist fields with Green Loop signature green (`#16a34a`) for focus states.
  - **Primary Button**: High-contrast "Register Account" button with a hover scale effect.

## 3. Technical Implementation
- **Framework**: Next.js (App Router).
- **Styling**: Tailwind CSS for responsive layout and animations.
- **Icons**: Lucide-react (Eye, EyeOff, etc.).
- **Auth/Database**: Integration with Firebase Auth and Firestore (preserving existing logic).
- **Animations**: Subtle fade-in for form elements on page load.

## 4. Success Criteria
- Responsive and functional across all device sizes.
- Maintains all existing registration logic (role selection, region selection for collectors, Firebase integration).
- Visually aligns with the Green Loop brand and the "Minimalist & High-Impact" aesthetic.
