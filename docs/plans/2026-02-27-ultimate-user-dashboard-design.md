# Design Document: Ultimate User Dashboard (Green Loop)

**Date:** 2026-02-27  
**Status:** Approved  
**Topic:** UI/UX Overhaul for User Dashboard

## 1. Objective
Transform the existing user dashboard into a "Dynamic Command Center" that integrates three core pillars:
- **Data-Rich:** Deep insights into material types and carbon footprint.
- **Social & Gamified:** Community ranking and achievement tracking.
- **Action-First:** Rapid access to scheduling and AI classification.

## 2. Architecture & Data Flow
### 2.1 Enhanced Data Model
The `UserDashboardData` will be extended to include:
- `materialBreakdown`: Object mapping types (Plastic, Paper, etc.) to weights.
- `carbonImpact`: Calculated `co2Saved` and `equivalentMetrics` (trees, cars off road).
- `socialMetrics`: `rank`, `percentile`, and `streak`.

### 2.2 Carbon Intelligence Utility
A new utility `lib/utils/carbon.ts` will provide conversion factors:
- Plastic: 1.5kg CO2 / kg
- Paper: 0.9kg CO2 / kg
- Glass: 0.3kg CO2 / kg
- Metal: 2.8kg CO2 / kg

## 3. Component Breakdown
### 3.1 Hero: Action-First Command
- **Current Status:** Dynamic text based on `nextPickup`.
- **Quick Actions:** High-visibility buttons for `Schedule` and `Scan`.

### 3.2 Impact: Data-Rich Visuals
- **MaterialImpactChart:** A Recharts Donut chart showing distribution.
- **CarbonMilestoneTracker:** Visual cards for "Trees Planted" equivalents.

### 3.3 Social: Gamification Hub
- **Leaderboard Snippet:** Shows user's rank relative to neighbors.
- **Streak Tracker:** Displays "Green Streak" (consecutive successful pickups).

## 4. Visual Design
- **Style:** Modern Glassmorphism with deep emerald gradients.
- **Interactions:** Framer Motion for entrance animations and state transitions.
- **Responsive:** Stacked bento grid for mobile with a sticky Action Bar.

## 5. Testing & Validation
- **Unit Tests:** Verify carbon calculation logic.
- **Integration Tests:** Ensure dashboard-client handles missing or empty data gracefully.
- **UI Tests:** Verify responsive layout breakpoints.
