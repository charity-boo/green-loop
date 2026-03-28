# Hostel Page UI/UX Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the hostel waste management page into a modern, minimalist hybrid portal serving both students and managers.

**Architecture:** A tabbed interface using shadcn/ui Tabs, featuring a Hero section, a Student View (tracker, leaderboard, guide), and a Manager View (request form, pricing, reporting).

**Tech Stack:** React (Next.js), Tailwind CSS, Lucide React icons, shadcn/ui components.

---

### Task 1: Create Student View Component

**Files:**
- Create: `components/features/waste/hostels/student-view.tsx`
- Test: `components/features/waste/hostels/__tests__/student-view.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { StudentView } from '../student-view';

describe('StudentView', () => {
  it('renders the pickup tracker', () => {
    render(<StudentView />);
    expect(screen.getByText(/Next pickup/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test components/features/waste/hostels/__tests__/student-view.test.tsx`
Expected: FAIL (file not found)

**Step 3: Write minimal implementation**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, Recycle, Gift } from "lucide-react";

export function StudentView() {
  return (
    <div className="space-y-8">
      {/* Tracker */}
      <Card className="border-indigo-100 bg-indigo-50/30">
        <CardHeader className="flex flex-row items-center space-x-4">
          <Clock className="h-8 w-8 text-indigo-600" />
          <div>
            <CardTitle className="text-xl">Next Pickup</CardTitle>
            <p className="text-indigo-600 font-bold text-2xl">Today at 2:00 PM</p>
          </div>
        </CardHeader>
      </Card>

      {/* Leaderboard & Guide */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Hostel Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>1. Chuka Uni. Hostel A</span>
                <span className="font-bold">12,450 pts</span>
              </li>
              <li className="flex justify-between items-center text-indigo-600 font-bold bg-indigo-50 p-2 rounded">
                <span>3. Chuka Uni. Hostel B</span>
                <span>9,850 pts</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-green-500" />
              Recycling Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 border rounded hover:bg-slate-50 cursor-help">
              <div className="text-xs font-semibold">Plastic</div>
            </div>
            <div className="text-center p-2 border rounded hover:bg-slate-50 cursor-help">
              <div className="text-xs font-semibold">Paper</div>
            </div>
            <div className="text-center p-2 border rounded hover:bg-slate-50 cursor-help">
              <div className="text-xs font-semibold">Metal</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test components/features/waste/hostels/__tests__/student-view.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/features/waste/hostels/student-view.tsx
git commit -m "feat(hostels): add StudentView component"
```

---

### Task 2: Create Manager View Component

**Files:**
- Create: `components/features/waste/hostels/manager-view.tsx`
- Test: `components/features/waste/hostels/__tests__/manager-view.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import { ManagerView } from '../manager-view';

describe('ManagerView', () => {
  it('renders the service tiers', () => {
    render(<ManagerView />);
    expect(screen.getByText(/Pricing Plans/i)).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test components/features/waste/hostels/__tests__/manager-view.test.tsx`
Expected: FAIL

**Step 3: Write minimal implementation**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart3, Package } from "lucide-react";

export function ManagerView() {
  return (
    <div className="space-y-8">
      {/* Quick Action */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-24 flex flex-col gap-2">
          <ClipboardList className="h-6 w-6" />
          Request Pickup
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2">
          <Package className="h-6 w-6" />
          Order New Bins
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2">
          <BarChart3 className="h-6 w-6" />
          View Reports
        </Button>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Standard</CardTitle>
            <p className="text-sm text-muted-foreground italic">Weekly Pickup</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">KES 5,000/mo</p>
          </CardContent>
        </Card>
        <Card className="border-indigo-500 shadow-md">
          <CardHeader>
            <CardTitle className="flex justify-between">
              Premium
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Popular</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground italic">Daily Pickup</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono text-indigo-600">KES 12,000/mo</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Custom</CardTitle>
            <p className="text-sm text-muted-foreground italic">Tailored Volume</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono">Contact Us</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test components/features/waste/hostels/__tests__/manager-view.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add components/features/waste/hostels/manager-view.tsx
git commit -m "feat(hostels): add ManagerView component"
```

---

### Task 3: Redesign the Main Hostel Page

**Files:**
- Modify: `app/(website)/waste/residential/hostels/page.tsx`

**Step 1: Write the failing test**

Modify `app/(website)/waste/residential/hostels/page.test.tsx` (create if needed) to expect Tabs.

**Step 2: Run test to verify it fails**

Run: `npm test app/(website)/waste/residential/hostels/page.test.tsx`
Expected: FAIL

**Step 3: Implement the new page layout**

```tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentView } from "@/components/features/waste/hostels/student-view";
import { ManagerView } from "@/components/features/waste/hostels/manager-view";
import { GraduationCap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HostelsWastePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-8 border-b bg-indigo-50/20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart Waste Management for <span className="text-indigo-600">Shared Student Housing</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Reliable collection, real-time tracking, and community rewards—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Find Your Hostel</Button>
            <Button size="lg" variant="outline">Book a Service</Button>
          </div>
        </div>
      </section>

      {/* Interactive Portal */}
      <main className="max-w-5xl mx-auto py-16 px-4 sm:px-8">
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 h-14 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger value="students" className="rounded-lg gap-2 text-lg">
              <GraduationCap className="h-5 w-5" /> For Students
            </TabsTrigger>
            <TabsTrigger value="managers" className="rounded-lg gap-2 text-lg">
              <Building2 className="h-5 w-5" /> For Managers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="animate-in fade-in duration-500">
            <StudentView />
          </TabsContent>
          
          <TabsContent value="managers" className="animate-in fade-in duration-500">
            <ManagerView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm test app/(website)/waste/residential/hostels/page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add app/(website)/waste/residential/hostels/page.tsx
git commit -m "feat(hostels): redesign hostel page with tabbed hybrid interface"
```
