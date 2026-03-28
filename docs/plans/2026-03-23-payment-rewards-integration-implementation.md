# Payment and Rewards Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a hybrid reward system where Green Points are earned on pickup completion based on waste classification, but redemption is restricted if the user has unpaid pickups.

**Architecture:** Modified collector completion API to calculate and award points, updated dashboard API to provide a `canRedeem` flag, and a new redemption endpoint with a payment status guard.

**Tech Stack:** Next.js, Firebase Admin SDK (Firestore), Zod, Stripe (existing), Vitest.

---

### Task 1: Create Point Calculation Utility

**Files:**
- Create: `lib/utils/reward-calculator.ts`
- Test: `lib/utils/__tests__/reward-calculator.test.ts`

**Step 1: Write the failing test**

```typescript
import { calculateRewardPoints } from '../reward-calculator';

describe('calculateRewardPoints', () => {
  it('calculates points correctly for plastic with high confidence', () => {
    const points = calculateRewardPoints('plastic', 0.95);
    expect(points).toBe(150); // (50 base * 1.5 plastic) * 2 bonus
  });

  it('calculates points correctly for general waste with low confidence', () => {
    const points = calculateRewardPoints('general', 0.5);
    expect(points).toBe(50); // (50 base * 1.0 general) * 1 bonus
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest lib/utils/__tests__/reward-calculator.test.ts`
Expected: FAIL (module not found)

**Step 3: Write minimal implementation**

```typescript
export function calculateRewardPoints(formValue: string, probability: number): number {
  const basePoints = 50;
  const categoryMultipliers: Record<string, number> = {
    plastic: 1.5,
    metal: 2.0,
    organic: 1.2,
    mixed: 1.1,
    general: 1.0,
  };

  const multiplier = categoryMultipliers[formValue] || 1.0;
  const accuracyBonus = probability > 0.9 ? 2.0 : 1.0;

  return Math.floor(basePoints * multiplier * accuracyBonus);
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest lib/utils/__tests__/reward-calculator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add lib/utils/reward-calculator.ts lib/utils/__tests__/reward-calculator.test.ts
git commit -m "feat: add reward calculation utility"
```

---

### Task 2: Update Collector Completion API to Award Points

**Files:**
- Modify: `app/api/collector/tasks/[id]/complete/route.ts`
- Test: `app/api/collector/tasks/[id]/complete/__tests__/route.test.ts`

**Step 1: Write the failing test**

Modify existing test or create new one to check if `user.rewardPoints` increments.

```typescript
// Add to app/api/collector/tasks/[id]/complete/__tests__/route.test.ts
// Mock adminDb.collection('users').doc(userId).update to verify increment
```

**Step 2: Run test to verify it fails**

Run: `npx vitest app/api/collector/tasks/[id]/complete/__tests__/route.test.ts`
Expected: FAIL (points not awarded)

**Step 3: Update implementation**

```typescript
// Import calculateRewardPoints
// Inside POST:
// const pointsEarned = calculateRewardPoints(wasteItem.formValue, wasteItem.probability || 1.0);
// await adminDb.collection('waste').doc(id).update({ ...updateData, pointsEarned });
// await adminDb.collection('users').doc(wasteItem.userId).update({
//   rewardPoints: admin.firestore.FieldValue.increment(pointsEarned)
// });
```

**Step 4: Run test to verify it passes**

Run: `npx vitest app/api/collector/tasks/[id]/complete/__tests__/route.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add app/api/collector/tasks/[id]/complete/route.ts
git commit -m "feat: award points on pickup completion"
```

---

### Task 3: Update Dashboard API with `canRedeem` Flag

**Files:**
- Modify: `lib/dashboard-data.ts`
- Modify: `types/index.ts`

**Step 1: Update type definition**

Add `canRedeem: boolean` to `RewardsData` interface in `types/index.ts`.

**Step 2: Update `fetchDashboardData` in `lib/dashboard-data.ts`**

```typescript
// Fetch schedules for the user
const unpaidSchedules = await adminDb.collection('schedules')
  .where('userId', '==', userId)
  .where('paymentStatus', '==', 'Unpaid')
  .limit(1)
  .get();

const canRedeem = unpaidSchedules.empty;

// Return canRedeem in rewards object
```

**Step 3: Run existing dashboard tests**

Run: `npx vitest lib/__tests__/dashboard-data.test.ts`
Expected: PASS (with updated expectation for canRedeem)

**Step 4: Commit**

```bash
git add lib/dashboard-data.ts types/index.ts
git commit -m "feat: add canRedeem flag to dashboard data"
```

---

### Task 4: Implement Redemption Protection in UI

**Files:**
- Modify: `components/user/rewards-tracker.tsx`

**Step 1: Use `canRedeem` prop to disable redemption UI**

```tsx
// If !canRedeem, show warning message and disable 'Redeem' buttons
```

**Step 2: Commit**

```bash
git add components/user/rewards-tracker.tsx
git commit -m "ui: disable redemption when unpaid pickups exist"
```

---

### Task 5: Final Verification

**Step 1: Manual/E2E check**
1. Create a pickup.
2. Complete it as a collector.
3. Verify points increased.
4. Verify `canRedeem` is false (if unpaid).
5. Pay for pickup.
6. Verify `canRedeem` becomes true.

**Step 2: Commit final documentation updates**
