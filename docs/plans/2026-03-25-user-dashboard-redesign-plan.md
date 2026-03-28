# User Dashboard Redesign (Minimalist) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the user dashboard to be a task-focused, minimal interface using strictly white and emerald green.

**Architecture:** Refactor `UserDashboardClient` into a two-column layout with a simplified header and active task card. Use flat lists instead of complex cards and charts.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Lucide React, Framer Motion.

---

### Task 1: Refactor Dashboard Header & Impact Metrics

**Files:**
- Modify: `app/(website)/dashboard/user-dashboard-client.tsx`
- Modify: `components/user/impact-hero.tsx` (or simplify inline)

**Step 1: Simplify ImpactHero component**
Update `components/user/impact-hero.tsx` to be a minimal text-based section instead of a large card.

```tsx
// components/user/impact-hero.tsx
import { Leaf, Award, Zap } from 'lucide-react';

export default function ImpactHero({ userName, totalWeight, co2Saved, currentPoints }: any) {
    return (
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {userName}</h1>
            <div className="flex flex-wrap items-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Waste</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{totalWeight}kg</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Eco-Points</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{currentPoints}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">CO2 Saved</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{co2Saved}kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

**Step 2: Update UserDashboardClient to use new Header**
Remove old tiers and replace with the simple header.

---

### Task 2: Redesign Active Task Card

**Files:**
- Modify: `app/(website)/dashboard/user-dashboard-client.tsx`

**Step 1: Replace complex Next Pickup section with simple card**
If scheduled: Emerald card. If not: White card with emerald border.

```tsx
// Inside user-dashboard-client.tsx
{nextPickup ? (
    <div className="bg-emerald-600 p-8 rounded-2xl text-white shadow-lg shadow-emerald-200 mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-2">Next Collection</p>
        <h2 className="text-4xl font-bold tracking-tight mb-6">{nextPickup}</h2>
        <div className="flex items-center gap-4">
            <Link href="/schedule-pickup" className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                Reschedule
            </Link>
            <button className="text-emerald-100 text-sm font-semibold hover:text-white transition-colors">
                Cancel Pickup
            </button>
        </div>
    </div>
) : (
    <div className="bg-white border-2 border-emerald-100 p-10 rounded-2xl text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Collection Scheduled</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Ready to clear some waste? Schedule your next collection in seconds.</p>
        <Link href="/schedule-pickup" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors inline-block shadow-lg shadow-emerald-200">
            Schedule Now
        </Link>
    </div>
)}
```

---

### Task 3: Implement Simple Two-Column Content Layout

**Files:**
- Modify: `app/(website)/dashboard/user-dashboard-client.tsx`
- Modify: `components/user/pickup-table.tsx`

**Step 1: Create two-column grid below Task Card**
Left (75%) for history, Right (25%) for actions.

**Step 2: Simplify PickupTable**
Ensure `components/user/pickup-table.tsx` is a flat list on white background with no heavy styling.

**Step 3: Implement Quick Actions Sidebar**
Create a vertical list of links: Report Problem, Refer Neighbor, Sorting Tips.

---

### Task 4: Final Cleanup and Aesthetic Polish

**Files:**
- Modify: `app/(website)/dashboard/user-dashboard-client.tsx`

**Step 1: Remove all unused component imports**
Remove `MaterialImpactChart`, `SocialMiniBoard`, `RewardsTracker`, `CarbonSavingsPulse`, etc.

**Step 2: Ensure background is pure white**
Wrap the dashboard in a `bg-white` div if the global layout doesn't handle it.

**Step 3: Verify white/green consistency**
Check all icons and text links are using Emerald colors.
