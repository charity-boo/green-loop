# Design Doc: Hostel Page UI/UX Redesign

**Date:** 2026-03-05
**Topic:** UI/UX Redesign for the Hostel Waste Management Page
**Status:** Approved by User

## 1. Overview
The goal is to transform the basic, informational hostel waste management page into a modern, minimalist, and highly functional hybrid portal. It must serve both students (residents) and hostel owners/managers.

## 2. Key Objectives
- **Hybrid Audience:** Cater to both student needs (tracking, rewards) and manager needs (service requests, reporting).
- **Modern/Minimalist Aesthetic:** Use Geist Sans, ample whitespace, and clean components.
- **Immediate Value:** Provide real-time data or simulated real-time data for engagement.

## 3. Architecture & Components
The page will follow a **Tabbed Hybrid** approach.

### 3.1 Hero Section
- **Title:** "Smart Waste Management for Shared Student Housing."
- **CTAs:** "Find Your Hostel" (jumps to student tab) and "Book a Service" (jumps to manager tab).

### 3.2 Student View (Tab 1)
- **Real-time Tracker:** "Next pickup is in [X] hours."
- **Community Impact:** A leaderboard showing rankings and Green Points for each hostel.
- **Interactive Recycling Guide:** Cards with icons (plastic, paper, metal) providing quick-hit tips.
- **Rewards Section:** Highlighting Green Points benefits.

### 3.3 Manager View (Tab 2)
- **Service Request Form:** A simplified form for pickups/bins.
- **Pricing Tiers:** Cards showing "Standard," "Premium," and "Custom" plans.
- **Reporting Mini-Dashboard:** Total waste collected and Green Points generated.
- **Service Highlights:** Bulk waste, dumpster optimization, compliance tools.

## 4. Design Elements
- **Typography:** Geist Sans (sans-serif).
- **Colors:** Indigo-700/50 (as per current hostel page colors) but with a more sophisticated, minimalist palette.
- **Icons:** Lucide-React for clean, modern symbols.
- **Animation:** Subtle scroll hints and transitions between tabs.

## 5. Testing Strategy
- **Responsive Test:** Ensure the tabbed layout works on mobile (swiping or vertical stacking).
- **Accessibility:** Ensure tab controls are keyboard-accessible and screen-reader friendly.
- **Data Flow:** Verify that points and leaderboard data correctly reflect the current system state.
