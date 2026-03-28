# Design Document: Online Services Hub & Waste Calculator

**Date:** 2026-03-25
**Topic:** UI/UX Redesign for "Online Services" with interactive features.

## 1. Objective
Refactor the static `/services` page into a dynamic **Service Hub** that provides real-time value to both guests and logged-in users. The primary goal is to increase user engagement by adding an interactive **Waste Impact Calculator**.

## 2. Architecture & UI/UX
The new services page will follow a "Glassmorphism" aesthetic (semi-transparent, blurred backgrounds) and be divided into three main functional zones:

### A. Dynamic Header & Welcome
- **Guest View:** Standard hero title "Our Online Services."
- **Logged-in View:** Personalized greeting (e.g., "Welcome back, [Name]") with a status chip showing the next scheduled pickup date/time.

### B. The Waste Impact Calculator (New Feature)
- **Inputs:**
  - `Waste Type` (Dropdown: Plastic, Paper, Organic, E-Waste, Metal).
  - `Estimated Quantity` (Number input for kg or bags).
- **Instant Outputs:**
  - `Estimated Cost`: Based on a pre-defined rate per kg.
  - `Environmental Offset`: Calculated CO2 savings (kg CO2e).
- **CTA:** "Schedule This Pickup" button that redirects to `/schedule-pickup` with the selected type and quantity pre-filled in the URL/state.

### C. Active Service Tiles (Refactored)
- **Smart Collection (Residential):** High-priority for standard users. Includes a "Live Pulse" icon for regional activity.
- **Enterprise Solutions (Commercial):** High-priority for institutional users. Shows NEMA compliance badge prominently.
- **Circular Economy Hub:** Educational resources, recycling guidelines, and AI sorting info.
- **Impact Analytics:** Direct link to the user's dashboard reports.

## 3. Data Flow & Logic
- **`useWasteCalculator` Hook:** A custom React hook managing the state of the calculator and the calculation constants (e.g., Plastic = 0.5kg CO2/kg).
- **Firestore Integration:** For logged-in users, the page will fetch the latest `pickups` entry to display the status of the "Next Pickup" in the header.
- **Client-Side Navigation:** Use `Next.js` query parameters or a shared state to pass calculator data to the scheduling page.

## 4. Design Elements (UI)
- **Colors:** Deep emerald for primary actions, slate for secondary text, and white glass for cards.
- **Animations:** `framer-motion` for entrance staggers and hover scales on service tiles.
- **Accessibility:** High-contrast text on glass cards and ARIA labels for the calculator inputs.

## 5. Success Criteria
- Users can calculate their waste impact in under 10 seconds.
- Reduced friction for scheduling pickups (pre-filled forms).
- Modernized look that aligns with high-end eco-tech branding.
