# Online Services Hub & Waste Calculator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor the `/services` page into a dynamic hub with an interactive waste impact calculator.

**Architecture:** A React-based service hub using a custom `useWasteCalculator` hook for logic and `framer-motion` for Glassmorphism UI effects. It integrates with Firestore to show personalized user status.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, Lucide React, Firestore.

---

### Task 1: Create the `useWasteCalculator` Hook

**Files:**
- Create: `hooks/use-waste-calculator.ts`
- Test: `hooks/__tests__/use-waste-calculator.test.ts`

**Step 1: Write the failing test**

```typescript
import { renderHook, act } from '@testing-library/react';
import { useWasteCalculator } from '../use-waste-calculator';

describe('useWasteCalculator', () => {
  it('calculates cost and CO2 offset for plastic', () => {
    const { result } = renderHook(() => useWasteCalculator());
    
    act(() => {
      result.current.setWasteType('plastic');
      result.current.setQuantity(10);
    });

    // Plastic: 50 Ksh/kg, 0.5kg CO2/kg (assumed rates)
    expect(result.current.cost).toBe(500);
    expect(result.current.co2Offset).toBe(5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest hooks/__tests__/use-waste-calculator.test.ts`
Expected: FAIL (Module not found)

**Step 3: Write minimal implementation**

```typescript
import { useState, useMemo } from 'react';

export type WasteType = 'plastic' | 'paper' | 'organic' | 'e-waste' | 'metal';

const RATES = {
  plastic: { cost: 50, co2: 0.5 },
  paper: { cost: 30, co2: 0.3 },
  organic: { cost: 20, co2: 0.8 },
  'e-waste': { cost: 200, co2: 1.2 },
  metal: { cost: 100, co2: 0.6 },
};

export function useWasteCalculator() {
  const [wasteType, setWasteType] = useState<WasteType>('plastic');
  const [quantity, setQuantity] = useState<number>(0);

  const { cost, co2Offset } = useMemo(() => {
    const rate = RATES[wasteType];
    return {
      cost: quantity * rate.cost,
      co2Offset: quantity * rate.co2,
    };
  }, [wasteType, quantity]);

  return {
    wasteType,
    setWasteType,
    quantity,
    setQuantity,
    cost,
    co2Offset,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest hooks/__tests__/use-waste-calculator.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add hooks/use-waste-calculator.ts hooks/__tests__/use-waste-calculator.test.ts
git commit -m "feat: add useWasteCalculator hook with TDD"
```

---

### Task 2: Create the WasteCalculator Component

**Files:**
- Create: `components/features/services/waste-calculator.tsx`

**Step 1: Create the component with Glassmorphism styling**

```tsx
"use client";

import { useWasteCalculator, WasteType } from "@/hooks/use-waste-calculator";
import { Leaf, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

export function WasteCalculator() {
  const { wasteType, setWasteType, quantity, setQuantity, cost, co2Offset } = useWasteCalculator();

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-900/5">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
          <Leaf className="w-5 h-5" />
        </span>
        Waste Impact Calculator
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Waste Type</label>
            <select 
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value as WasteType)}
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-semibold focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="plastic">Plastic Bottles / Containers</option>
              <option value="paper">Paper & Cardboard</option>
              <option value="organic">Organic / Food Waste</option>
              <option value="e-waste">E-Waste (Electronics)</option>
              <option value="metal">Scrap Metal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Quantity (kg)</label>
            <input 
              type="number"
              value={quantity || ''}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-50 border-0 rounded-2xl p-4 text-lg font-semibold focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-emerald-900/5 rounded-3xl p-8 flex flex-col justify-between border border-emerald-900/5">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Estimated Cost</span>
              <span className="text-2xl font-black text-emerald-700">Ksh {cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">CO2 Offset</span>
              <span className="text-2xl font-black text-emerald-600">{co2Offset.toFixed(1)} kg</span>
            </div>
          </div>

          <Link 
            href={`/schedule-pickup?type=${wasteType}&qty=${quantity}`}
            className="mt-8 w-full bg-emerald-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all group"
          >
            Schedule This Pickup
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/features/services/waste-calculator.tsx
git commit -m "feat: implement Glassmorphism Waste Calculator component"
```

---

### Task 3: Refactor Services Page Layout

**Files:**
- Modify: `app/(website)/services/page.tsx`

**Step 1: Update the page to include the Calculator and personalized Header**

- Replace static hero text with personalized greeting.
- Inject `WasteCalculator` component below the hero.
- Update `ServiceCard` styles to use Glassmorphism blur effects.

**Step 2: Commit**

```bash
git add app/(website)/services/page.tsx
git commit -m "style: refactor services page with personalized header and calculator"
```

---

### Task 4: Integrate Real-time Pickup Status

**Files:**
- Modify: `app/(website)/services/page.tsx`
- Modify: `hooks/use-auth.ts` (if needed to expose user data)

**Step 1: Add Firestore fetch logic for active pickups**

```tsx
// Inside ServicesPage component
const { user } = useAuth();
const [nextPickup, setNextPickup] = useState<any>(null);

useEffect(() => {
  if (user) {
    const q = query(
      collection(db, "pickups"),
      where("userId", "==", user.uid),
      where("status", "in", ["scheduled", "in-progress"]),
      orderBy("scheduledDate", "asc"),
      limit(1)
    );
    // ... onSnapshot or getDocs logic
  }
}, [user]);
```

**Step 2: Update Header UI to show status**

```tsx
{nextPickup && (
  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
    Next Pickup: {formatDate(nextPickup.scheduledDate)}
  </div>
)}
```

**Step 3: Commit**

```bash
git add app/(website)/services/page.tsx
git commit -m "feat: add real-time pickup status to services header"
```
