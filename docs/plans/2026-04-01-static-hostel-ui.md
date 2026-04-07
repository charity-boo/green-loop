# Static Student Hub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the dynamic, state-heavy Student Hub into a high-fidelity, static-first landing page section that showcases features without requiring initial user input.

**Architecture:** Replace the conditional `StudentView` (onboarding/dashboard) with a cohesive `StaticStudentHub` component that displays a "Live Campus Leaderboard" preview, a "Find Your Hostel" search interface, and "Student Rewards" in a single, unified layout.

**Tech Stack:** Next.js (App Router), Tailwind CSS, Framer Motion, Lucide Icons.

---

### Task 1: Create the Static Student Hub Component

**Files:**
- Create: `components/features/waste/hostels/static-student-hub.tsx`
- Modify: `app/(website)/waste/residential/hostels/page.tsx`

**Step 1: Implement the `StaticStudentHub` component**
This component will combine the best parts of the onboarding and dashboard into a single, high-fidelity layout.

```tsx
'use client';

import { motion } from "framer-motion";
import { Trophy, Search, Sparkles, Gift, Star, Zap, MapPin, CheckCircle2 } from "lucide-react";
import { HostelSearch } from "./hostel-search";

export function StaticStudentHub() {
  const topHostels = [
    { id: "1", name: "Sunset Gardens", location: "Ndagani West", points: 12450, rank: 1 },
    { id: "2", name: "Elite Heights", location: "Upper Campus", points: 11200, rank: 2 },
    { id: "3", name: "Green Park", location: "Riverside", points: 9800, rank: 3 },
  ];

  return (
    <div className="space-y-16">
      {/* Feature Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Search & Join */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 md:p-12 shadow-2xl shadow-slate-200/50">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest mb-4">
                <Search className="w-3.5 h-3.5" /> Join the movement
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Find your campus home</h3>
              <p className="text-slate-500 font-medium text-lg">
                Enter your hostel name to join its sustainability hub and start earning points for every bag sorted.
              </p>
            </div>
            
            <HostelSearch />
            
            <div className="mt-10 grid grid-cols-2 gap-4">
               {[
                 { icon: <Gift className="text-pink-500" />, label: "Earn Points", desc: "For every verified bag" },
                 { icon: <Star className="text-amber-500" />, label: "Win Awards", desc: "Monthly hostel prizes" },
               ].map((benefit, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                      {benefit.icon}
                    </div>
                    <p className="font-black text-slate-900 text-sm">{benefit.label}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{benefit.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Leaderboard Preview */}
        <div className="lg:col-span-5">
           <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/20 text-white">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black tracking-tight">Live Rankings</h4>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">Campus-wide Board</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
              </div>
              
              <div className="divide-y divide-white/5">
                {topHostels.map((h, i) => (
                  <div key={h.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        i === 0 ? 'bg-amber-400 text-amber-900' : 
                        i === 1 ? 'bg-slate-300 text-slate-700' : 
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-black text-[15px]">{h.name}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5">{h.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-400">{h.points.toLocaleString()}</p>
                      <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Points</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-8 bg-white/5 text-center">
                 <button className="text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors">
                    View Full Leaderboard
                 </button>
              </div>
           </div>
           
           <div className="mt-8 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Zap className="h-6 w-6 text-green-600 fill-green-600" />
              </div>
              <p className="text-sm font-bold text-green-900">
                Over <span className="text-lg">4,200</span> students active this week in Ndagani.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Update `HostelsWastePage` to use the static hub**

Modify `app/(website)/waste/residential/hostels/page.tsx`:
- Import `StaticStudentHub`.
- Remove `StudentView` and its associated state/logic if any.
- Replace the `<StudentView />` call with `<StaticStudentHub />`.

**Step 3: Commit**

```bash
git add components/features/waste/hostels/static-student-hub.tsx app/(website)/waste/residential/hostels/page.tsx
git commit -m "feat(ui): convert student hub to static-first layout"
```

---

### Task 2: Refine the Hero and Stats Sections

**Files:**
- Modify: `app/(website)/waste/residential/hostels/page.tsx`

**Step 1: Enhance the Hero section with better typography and spacing**
- Update the hero background and text colors to be more "premium".
- Ensure the buttons are prominent and have better hover states.

**Step 2: Improve the Stats strip**
- Add more visual flair to the stats section (e.g., subtle shadows, better icons).

**Step 3: Commit**

```bash
git add app/(website)/waste/residential/hostels/page.tsx
git commit -m "style(ui): refine hero and stats sections"
```

---

### Task 3: Visual Polish of "Waste Guide" and "How it Works"

**Files:**
- Modify: `app/(website)/waste/residential/hostels/page.tsx`

**Step 1: Update "How it works" steps**
- Make the step numbers larger and more stylized.
- Add a subtle connecting line between steps on desktop.

**Step 2: Redesign "Waste Guide" cards**
- Use the colors more effectively (Blue for Plastic, Green for Organic, Slate for Paper).
- Add high-contrast text and better padding.

**Step 3: Commit**

```bash
git add app/(website)/waste/residential/hostels/page.tsx
git commit -m "style(ui): polish waste guide and how-it-works sections"
```
