# User Dashboard Redesign

## Problem

The current user dashboard at `/dashboard/user` uses a simple 3-column grid with no persistent
navigation, no top-level stat cards, a card-based pickup history (missing ID/Type columns), and
no right-sidebar widgets (campaigns, tips, notifications). The global top navbar renders on all
pages including the dashboard.

## Proposed Approach

Replace the current layout with a full app-shell experience: a collapsible fixed left sidebar
visible on all `/dashboard/*` routes, a main content area with top stat cards + pickup history
table + right sidebar widgets, and the existing charts preserved below.

---

## Architecture

### Route & Layout Changes

- **`app/(website)/dashboard/layout.tsx`** — NEW. Wraps all `/dashboard/*` routes in the
  sidebar shell. Next.js nested layouts ensure this renders inside the root layout but
  overrides the (website) layout for dashboard-scoped pages.
- **`components/layout/dynamic-navbar.tsx`** — Updated to hide on `/dashboard/*` via
  `usePathname()`.
- **`components/layout/dynamic-footer.tsx`** — Updated to hide on `/dashboard/*` via
  `usePathname()`.

### New Components

| Component | Purpose |
|-----------|---------|
| `components/dashboard/sidebar-nav.tsx` | Collapsible sidebar: icon-only (64px) ↔ expanded (240px). Highlights active route with emerald accent. Shows user avatar + name at bottom. |
| `components/user/stat-cards.tsx` | Row of 3 metric cards: **Green Points** (current points), **Waste Sorted** (total kg), **Impact Rank** (community rank badge). |
| `components/user/pickup-table.tsx` | Table-style pickup history with columns: ID, Date/Time, Type (Organic/Plastic/Recyclable/Hazardous), Status (Pending/Confirmed/Picked Up/Recycled). Includes a prominent **"Scan New Waste"** button at the top-right. |
| `components/user/active-campaigns.tsx` | Right sidebar widget listing 2–3 static/mock community campaigns cards. |
| `components/user/sorting-tips.tsx` | Right sidebar widget with rotating AI sorting tip snippets. |
| `components/user/notifications-widget.tsx` | Right sidebar widget showing real-time alerts for missed/upcoming pickups. |

### Updated Components

- **`app/(website)/dashboard/user/dashboard-client.tsx`** — New 3-zone layout:
  1. **Top**: `StatCards` (3 metric cards)
  2. **Center**: `PickupTable` (left, ~60% width) + right sidebar widgets (Active Campaigns,
     AI Tips, Notifications, ~40% width)
  3. **Bottom**: Existing `MaterialImpactChart` + `CarbonSavingsPulse` charts

---

## Sidebar Navigation Items

| Label | Icon | Route |
|-------|------|-------|
| Dashboard | LayoutDashboard | `/dashboard/user` |
| Schedule Pickup | CalendarPlus | `/schedule-pickup` |
| AI Sorting | Scan | `/learning-hub` |
| Green Points | Star | `/rewards-program` |
| Maps & Sites | MapPin | `/service-areas` |
| Settings/Support | Settings | `/report` |

---

## Data

All new components consume props already available in `UserDashboardData`:
- `data.rewards.currentPoints` → Green Points card
- `data.metrics.totalWeight` → Waste Sorted card
- `data.social.rank` + `data.social.percentile` → Impact Rank card
- `data.pickupHistory` → Pickup table rows

Active Campaigns, AI Tips, and Notifications use static mock data for now, with
documented Firestore collection paths for future wiring.

---

## Preserved Work

The following existing components are **kept unchanged** and rendered below the main table:
- `MaterialImpactChart`
- `CarbonSavingsPulse`
- `QuickActionHub`
- `SocialMiniBoard`
- `RewardsTracker`
