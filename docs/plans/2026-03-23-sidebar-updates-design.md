# Sidebar Updates Design

## Overview
This document outlines the updates to the user dashboard sidebar navigation for the Green Loop project. The goal is to improve clarity, rename existing sections for better user understanding, and add a new section for tracking activity history.

## Proposed Changes

### Navigation Items Structure
The `NAV_ITEMS` array in `components/dashboard/sidebar-nav.tsx` will be updated to reflect the chosen "Balanced Recycler" approach.

| Label | Icon (Lucide) | Href | Description |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `LayoutDashboard` | `/dashboard` | Main overview page. |
| **Schedule Pickup** | `CalendarPlus` | `/schedule-pickup` | Primary action for scheduling waste collection. |
| **Activity History** | `History` | `/dashboard/history` | **NEW:** Track past pickups, recycled items, and earned points. |
| **AI Sorting** | `Scan` | `/learning-hub` | Educational section for AI-assisted waste sorting. |
| **Green Points** | `Star` | `/rewards-program` | Rewards and loyalty program. |
| **Drop-off Points** | `MapPin` | `/service-areas` | **RENAMED:** From "Maps & Sites". Shows collection locations. |
| **Help & Support** | `Settings` | `/report` | **RENAMED:** From "Settings/Support". Access help and reporting tools. |

## UI/UX Considerations
- **Theme Consistency:** Maintain the current `bg-slate-900` background and `emerald-600` active state highlights.
- **Iconography:** Use standard Lucide icons that match the current aesthetic.
- **Responsiveness:** Ensure the sidebar remains functional and correctly highlights active routes using Next.js `usePathname`.

## Data Flow
- **Active States:** Highlight logic will remain based on `pathname === href || pathname.startsWith(href + "/")`.
- **Placeholder Route:** `/dashboard/history` will be added to the sidebar, even if the page itself is a placeholder initially.

## Verification Plan
- **Manual UI Check:** Verify that all labels and icons are correctly displayed.
- **Navigation Check:** Ensure clicking each item navigates to the correct path.
- **Active State Check:** Confirm that the active route is highlighted with the emerald accent.
