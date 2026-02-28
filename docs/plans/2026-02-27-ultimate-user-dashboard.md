# Ultimate User Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the user dashboard into a data-rich, social, and utility-focused command center.

**Architecture:** Extend existing dashboard data fetching to include carbon metrics and social standings, then implement a modular bento grid with interactive data visualizations and quick-access actions.

**Tech Stack:** Next.js (App Router), Framer Motion, Recharts, Lucide React, Tailwind CSS.

---

### Task 1: Carbon Calculation Utility

**Files:**
- Create: `lib/utils/carbon.ts`
- Test: `lib/utils/carbon.test.ts`

**Step 1: Write the failing test**
```typescript
import { calculateCarbonSavings } from './carbon';

describe('calculateCarbonSavings', () => {
  it('calculates correct savings for multiple material types', () => {
    const materials = [
      { type: 'Plastic', weight: 10 },
      { type: 'Paper', weight: 5 }
    ];
    const result = calculateCarbonSavings(materials);
    expect(result.totalCo2Saved).toBe(19.5); // (10 * 1.5) + (5 * 0.9)
  });
});
```

**Step 2: Run test to verify it fails**
Run: `pnpm vitest lib/utils/carbon.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
```typescript
export const CARBON_OFFSETS = {
  Plastic: 1.5,
  Paper: 0.9,
  Glass: 0.3,
  Metal: 2.8,
  Organic: 0.5,
  Unknown: 0.4
} as const;

export type MaterialWeight = { type: string; weight: number };

export function calculateCarbonSavings(materials: MaterialWeight[]) {
  const totalCo2Saved = materials.reduce((acc, curr) => {
    const factor = CARBON_OFFSETS[curr.type as keyof typeof CARBON_OFFSETS] || CARBON_OFFSETS.Unknown;
    return acc + (curr.weight * factor);
  }, 0);

  return {
    totalCo2Saved: Number(totalCo2Saved.toFixed(2)),
    treesEquivalent: Math.floor(totalCo2Saved / 20) // 1 tree approx 20kg CO2/year
  };
}
```

**Step 4: Run test to verify it passes**
Run: `pnpm vitest lib/utils/carbon.test.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add lib/utils/carbon.ts lib/utils/carbon.test.ts
git commit -m "feat(data): add carbon calculation utility"
```

---

### Task 2: Extend Dashboard Types

**Files:**
- Modify: `types/index.ts`

**Step 1: Update `UserDashboardData` and `UserMetrics` interfaces**
```typescript
// types/index.ts

export interface UserDashboardData {
  metrics: UserMetrics;
  pickupHistory: PickupHistoryItem[];
  rewards: RewardsData;
  social: SocialMetrics; // New
}

export interface UserMetrics {
  totalPickups: number;
  totalWeight: number;
  recyclingRate: number;
  rewardPoints: number;
  lastPickup: string;
  nextPickup?: string;
  skippedPickups?: number;
  materialBreakdown: Array<{ type: string; weight: number; percentage: number }>; // New
  carbonImpact: { totalCo2Saved: number; treesEquivalent: number }; // New
}

export interface SocialMetrics {
  rank: number;
  totalNeighbors: number;
  percentile: number;
  streak: number;
}
```

**Step 2: Commit**
```bash
git add types/index.ts
git commit -m "types: extend user dashboard data structures"
```

---

### Task 3: Update Data Fetching Logic

**Files:**
- Modify: `lib/dashboard-data.ts`

**Step 1: Implement Material Breakdown and Social Metrics logic**
- In `getUserDashboardData`, calculate material distribution from `wasteItems`.
- Integrate `calculateCarbonSavings`.
- Add mock social metrics (for now).

**Step 2: Verify data structure via console log or test**
- Ensure `getUserDashboardData` returns the new fields.

**Step 3: Commit**
```bash
git add lib/dashboard-data.ts
git commit -m "feat(data): update dashboard data fetching with material and carbon metrics"
```

---

### Task 4: Material Impact Chart Component

**Files:**
- Create: `components/user/material-impact-chart.tsx`

**Step 1: Implement Recharts Donut Chart**
- Use `PieChart` and `Cell` from `recharts`.
- Style with Green Loop brand colors (Emerald, Blue, Amber).

**Step 2: Commit**
```bash
git add components/user/material-impact-chart.tsx
git commit -m "feat(ui): add MaterialImpactChart component"
```

---

### Task 5: Carbon Savings Pulse Component

**Files:**
- Create: `components/user/carbon-savings-pulse.tsx`

**Step 1: Implement animated metric card**
- Show CO2 saved and Tree equivalent.
- Use Framer Motion for a "pulsing" effect on the tree icon.

**Step 2: Commit**
```bash
git add components/user/carbon-savings-pulse.tsx
git commit -m "feat(ui): add CarbonSavingsPulse component"
```

---

### Task 6: Quick Action Hub (Command Bar)

**Files:**
- Create: `components/user/quick-action-hub.tsx`

**Step 1: Implement tactile button group**
- "Schedule Pickup" (Primary)
- "Scan with AI" (Secondary)
- "Refer Friend" (Tertiary)

**Step 2: Commit**
```bash
git add components/user/quick-action-hub.tsx
git commit -m "feat(ui): add QuickActionHub component"
```

---

### Task 7: Social Mini Board Component

**Files:**
- Create: `components/user/social-mini-board.tsx`

**Step 1: Implement compact leaderboard**
- Show user's rank and "Green Streak".
- Simple list of 3 items (Neighbor, You, Neighbor).

**Step 2: Commit**
```bash
git add components/user/social-mini-board.tsx
git commit -m "feat(ui): add SocialMiniBoard component"
```

---

### Task 8: Dashboard Client Refactor

**Files:**
- Modify: `app/(website)/dashboard/user/dashboard-client.tsx`

**Step 1: Reorganize bento grid**
- Replace `ImpactHero` with the new Layout.
- Integrate `MaterialImpactChart`, `CarbonSavingsPulse`, `QuickActionHub`, and `SocialMiniBoard`.
- Update layout to be a 12-column grid.

**Step 2: Commit**
```bash
git add app/(website)/dashboard/user/dashboard-client.tsx
git commit -m "feat(ui): refactor user dashboard layout to ultimate version"
```

---

### Task 9: Final Polish & Verification

**Files:**
- Modify: `app/globals.css` (if needed for custom animations)

**Step 1: Manual review of responsive behavior**
- Check mobile vs desktop layout.
- Ensure all charts and actions are accessible.

**Step 2: Final Commit**
```bash
git commit -m "style: final polish and responsive adjustments for user dashboard"
```
