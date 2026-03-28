# Design Document: Minimalist User Dashboard Redesign (White & Green Theme)

**Date**: 2026-03-25
**Topic**: Simplification of the User Dashboard to a task-focused, two-tone (White & Green) utility interface.

## 1. Objective
Redesign the current multi-tiered, complex user dashboard into a minimal, "Task-Focused" utility. The goal is to remove all visual clutter (charts, social boards, complex tiers) and strictly adhere to a white and emerald green color palette.

## 2. Global Aesthetic
- **Background**: Pure `bg-white`.
- **Palette**: Strictly white (`#FFFFFF`) and shades of green (Emerald: `#10B981`, `#059669`).
- **Typography**: Slate-900 for headings, Slate-500 for secondary text, Bold Emerald for primary metrics.
- **Layout**: High whitespace, clean borders (`border-slate-50` or `border-emerald-100`), no mesh gradients or glassmorphism.

## 3. UI Components

### 3.1. Header & Global Impact
- **Greeting**: Simple `Welcome, [Name]` text in Slate-900.
- **Metrics Row**: A single horizontal row of 3 metrics (no cards, just text and icons).
    - **Total Weight**: (e.g., `124.5 kg`) in Emerald.
    - **Eco-Points**: (e.g., `1,250 pts`) in Emerald.
    - **CO2 Saved**: (e.g., `15 kg`) in Emerald.
- **Visuals**: Emerald icons next to each metric.

### 3.2. Active Task Card (The "Hero" Section)
- **Status: Pickup Scheduled**:
    - **Background**: Solid Emerald (`bg-emerald-600`), White text.
    - **Primary Info**: `Next Collection: [Date]` (Large, Bold).
    - **Actions**: White primary button for `Reschedule`, white text link for `Cancel Pickup`.
- **Status: No Pickup Scheduled**:
    - **Background**: White with Emerald border.
    - **Primary Action**: Centered large Emerald button (`bg-emerald-600`) for `Schedule Your Next Pickup`.

### 3.3. Main Content (Two Columns)
- **Primary Column (75% - Left)**:
    - **History List**: A clean, flat list of the last 5 collections.
    - **Data Points**: Date (Slate-900), Weight (Emerald), Status (Small green badge).
    - **Footer Action**: `View Full History` link in Emerald.
- **Sidebar Column (25% - Right)**:
    - **Quick Actions**: Vertical list of 3 icon-links.
        1. **Report a Problem** (Red icon for alert).
        2. **Refer a Neighbor** (Emerald icon).
        3. **View Sorting Tips** (Emerald icon).

## 4. Components to Remove
- **Material Impact Chart** (Doughnut chart).
- **Weekly Collection Trends Chart** (Bar chart).
- **Social Mini Board** (Rank, Percentile, Streak).
- **Complex "Tiers"** (Impact Hero, Tiered Sections).
- **Mesh Gradients & Glassmorphism** (From previous iterations).

## 5. Success Criteria
- The interface must feel like a "clean tool."
- No more than two shades of green should be used as accents.
- All non-essential data (social rank, educational tips on the main screen) is removed or relegated to sidebar links.
- The user can see their next task and their history in under 3 seconds.
