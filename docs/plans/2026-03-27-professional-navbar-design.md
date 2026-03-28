# Design Document: Professional Innovator Navbar

## Overview
The goal is to transform the current "Green Loop" navbar into a "Professional Innovator" style that balances corporate authority with modern tech sleekness. This involves upgrading the second (main) navbar to include Mega Menus, Glassmorphism, and a prominent primary CTA.

## Goals
- **Authority:** Look like an established, trustworthy organization through structured Mega Menus.
- **Innovation:** Highlight the "AI-powered" nature with sleek, modern UI effects (Glassmorphism, sticky headers).
- **Conversion:** Drive users toward the primary action: "Schedule a Pickup".

## Architecture
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS with `backdrop-blur` for Glassmorphism.
- **Animations:** `framer-motion` for smooth dropdown transitions and hover effects.
- **Icons:** `lucide-react` (already in project dependencies).
- **Components:**
  - `Navbar`: Main container with sticky/glassmorphism logic.
  - `MegaMenu`: A wide dropdown component for "About Us" and "Learning Hub".
  - `NavLink`: Refined link component with animated hover states.
  - `PrimaryCTA`: High-contrast button for "Schedule a Pickup".
  - `MobileSheet`: A slide-out mobile menu that mirrors the professional hierarchy.

## Design Sections

### 1. Sticky Base & Glassmorphism
- **Background:** Semi-transparent white (or slate-950 in dark mode) with `bg-opacity-80` and `backdrop-blur-md`.
- **Border:** A very thin `border-b` with a subtle gray/slate color (e.g., `border-gray-200/50`).
- **Shadow:** A soft `shadow-sm` that becomes slightly more pronounced on scroll.

### 2. Mega Menus
- **Layout:** 2-column grid within the dropdown panel.
- **Content:**
  - **About Us:** Icons for "Who We Are" (Users), "Service Areas" (MapPin), "Methodology" (Leaf), etc.
  - **Learning Hub:** Icons for "Recycling Guides" (BookOpen), "Educational Videos" (PlayCircle), "Waste Classification" (Layers).
- **Styling:** Each item will have a title, a 1-sentence description, and an icon. Hovering over an item will show a subtle background change.

### 3. Primary CTA
- **Text:** "Schedule a Pickup"
- **Style:** Solid background (Green-700/800), white text, rounded corners, and a subtle hover lift/shadow effect.
- **Placement:** Positioned at the far right of the menu items, before the theme toggle and profile dropdown.

### 4. Animations (Framer Motion)
- **Dropdowns:** Fade-in and slight slide-down (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
- **Links:** A subtle underline that expands from the center or shifts color on hover.

## Data Flow
- **Auth state:** Consumes `user`, `role`, and `status` from `useAuth` hook (already implemented).
- **Navigation:** Uses Next.js `Link` for client-side routing.

## Testing Strategy
- **Visual:** Verify Glassmorphism and blur effects in both light and dark modes.
- **Interaction:** Ensure Mega Menus open smoothly and don't flicker on mouse leave.
- **Responsive:** Test the mobile drawer for accessibility and ease of use.
