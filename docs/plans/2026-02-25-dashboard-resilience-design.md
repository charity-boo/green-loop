# Design Document: Dashboard Resilience & Granular Error Boundaries

**Date:** 2026-02-25
**Status:** Approved
**Topic:** Improving dashboard reliability through granular decomposition of failure domains.

---

## 1. Overview
The current Admin Dashboard bundles multiple data-fetching operations into coarse sections. If one query fails, the entire section (e.g., all charts) crashes. This design refactors the dashboard into a "Balanced Granularity" model where sections are aligned with their business domains and logical failure boundaries.

## 2. Architecture: Granular Section Injection

### 2.1 Failure Domains
| Section | Business Domain | Strategy |
|---------|-----------------|----------|
| **KPISection** | System Health Snapshot | Unified failure boundary. If one metric is missing, the snapshot is considered unreliable. |
| **WasteTrendSection** | Temporal Analytics | Independent analytical stream. Failure does not affect composition data. |
| **WasteDistributionSection** | Composition Analytics | Independent analytical stream. Failure does not affect trend data. |

### 2.2 Data Flow & Rendering
- **Page Controller (`page.tsx`)**: Orchestrates the section placement and layout. Acts as the control plane.
- **Section Components**: Server Components in `page.tsx` (defined outside the main component) that handle their own data fetching and error states.
- **Client Components**: `WasteTrendChart` and `WasteDistributionChart` receive data directly from their respective sections. `DashboardClient` is refactored to focus exclusively on the KPI cluster.

## 3. Implementation Details

### 3.1 `page.tsx` Refactor
- Remove `ChartsSection`.
- Implement `KPISection`, `WasteTrendSection`, and `WasteDistributionSection`.
- Each section will use a `try/catch` block.
- Each section will be wrapped in its own `Suspense` boundary in the main `AdminDashboardPage`.

### 3.2 `DashboardClient` Refactor
- Remove chart management logic.
- Remove `onlyKPIs` and `onlyCharts` props.
- Focus purely on the assembly and animation of the `KPICard` grid.

### 3.3 Error Strategy
- **KPIs**: Fail as a cluster using `KPIErrorState`.
- **Charts**: Fail independently using `ChartErrorState` with specific titles (e.g., "Waste Trend").

## 4. Success Criteria
- [ ] If `getWasteTrendData()` throws, the "Waste Distribution" chart still renders.
- [ ] If `getDashboardKPIs()` throws, both charts still render.
- [ ] Each section has its own skeleton loading state (avoiding layout shifts where possible).
- [ ] No "God Component" orchestrating independent analytical streams.
