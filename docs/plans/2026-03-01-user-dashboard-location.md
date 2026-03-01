# User Dashboard Location Section — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a location section to the user dashboard main column (below pickup history) with county/sub-region dropdowns aligned to collector registration, a live-preview embedded map, and a save button backed by a new PATCH API route.

**Architecture:** Server-side page fetches user's current `county` and `region` from Firestore and passes them as props to `UserDashboardClient`, which passes them to a new `LocationSection` client component. The component manages local state for dropdowns, calls `PATCH /api/user/location` on save, and renders a dynamic Google Maps iframe.

**Tech Stack:** Next.js 14 App Router, Firebase Admin SDK, Zod, Framer Motion, Lucide React, `KENYA_COUNTIES` from `lib/constants/regions.ts`

---

### Task 1: API Route — `PATCH /api/user/location`

**Files:**
- Create: `app/api/user/location/route.ts`

**Step 1: Create the route file**

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { authorize } from "@/lib/middleware/authorize";
import { handleApiError } from "@/lib/api-handler";
import { adminDb } from "@/lib/firebase/admin";
import { KENYA_COUNTIES } from "@/lib/constants/regions";

const schema = z.object({
  county: z.string().min(1),
  region: z.string().min(1),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    await authorize(session, ["USER", "COLLECTOR", "ADMIN"]);

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { county, region } = parsed.data;

    const countyData = KENYA_COUNTIES.find((c) => c.value === county);
    if (!countyData) {
      return NextResponse.json({ error: "Invalid county" }, { status: 400 });
    }

    const subRegion = countyData.subRegions.find((sr) => sr.value === region);
    if (!subRegion) {
      return NextResponse.json(
        { error: "Invalid region for this county" },
        { status: 400 }
      );
    }

    await adminDb
      .collection("users")
      .doc(session!.user.id)
      .update({ county, region });

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err, "PATCH /api/user/location");
  }
}
```

**Step 2: Verify the file compiles (no test needed — covered by integration)**

```bash
cd /home/chacha/Projects/green-loop
npx tsc --noEmit 2>&1 | grep "user/location" | head -10
```
Expected: no output (no type errors in the new file).

**Step 3: Commit**

```bash
git add app/api/user/location/route.ts
git commit -m "feat: add PATCH /api/user/location endpoint

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: `LocationSection` Client Component

**Files:**
- Create: `components/user/location-section.tsx`

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Save, Loader2, CheckCircle2 } from "lucide-react";
import { KENYA_COUNTIES } from "@/lib/constants/regions";

interface LocationSectionProps {
  initialCounty?: string | null;
  initialRegion?: string | null;
}

export default function LocationSection({
  initialCounty,
  initialRegion,
}: LocationSectionProps) {
  const [county, setCounty] = useState(initialCounty ?? "");
  const [region, setRegion] = useState(initialRegion ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const selectedCounty = KENYA_COUNTIES.find((c) => c.value === county);
  const subRegions = selectedCounty?.subRegions ?? [];
  const selectedSubRegion = subRegions.find((sr) => sr.value === region);

  const mapQuery = selectedSubRegion && selectedCounty
    ? `${selectedSubRegion.label},${selectedCounty.label},Kenya`
    : selectedCounty
    ? `${selectedCounty.label},Kenya`
    : "Kenya";

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const handleCountyChange = (val: string) => {
    setCounty(val);
    setRegion("");
    setSaved(false);
    setError("");
  };

  const handleSave = async () => {
    if (!county || !region) {
      setError("Please select both a county and a service area.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/user/location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ county, region }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save location. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
          <MapPin className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">
            Your Location
          </p>
          <h3 className="text-sm font-black text-slate-900 leading-tight">
            Service Area
          </h3>
        </div>
      </div>

      {/* Map */}
      <div className="relative mx-4 h-52 rounded-2xl overflow-hidden border border-slate-100">
        <iframe
          key={mapQuery}
          title="Your Service Area Map"
          src={mapSrc}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
        {selectedSubRegion && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm">
            <MapPin className="h-3 w-3 text-emerald-600" />
            <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
              {selectedSubRegion.label}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-4 pt-4 pb-5 space-y-3">
        {/* County */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">
            County
          </label>
          <select
            value={county}
            onChange={(e) => handleCountyChange(e.target.value)}
            className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
          >
            <option value="">Select county…</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-region — only shown once a county is picked */}
        {county && (
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1.5">
              Service Area
            </label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setSaved(false);
                setError("");
              }}
              className="w-full text-sm font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
            >
              <option value="">Select area…</option>
              {subRegions.map((sr) => (
                <option key={sr.value} value={sr.value}>
                  {sr.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !county || !region}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save Location
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
```

**Step 2: Check no type errors**

```bash
cd /home/chacha/Projects/green-loop
npx tsc --noEmit 2>&1 | grep "location-section" | head -10
```
Expected: no output.

**Step 3: Commit**

```bash
git add components/user/location-section.tsx
git commit -m "feat: add LocationSection component with map and region dropdowns

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Dashboard Page — Fetch User County/Region

**Files:**
- Modify: `app/(website)/dashboard/page.tsx`

**Step 1: Update the page to fetch and pass user location**

The existing import of `adminDb` is NOT in this file — add it. Full new content:

```tsx
import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { adminDb } from "@/lib/firebase/admin";
import { redirect } from "next/navigation";
import UserDashboardClient from "./user-dashboard-client";
import CollectorDashboard from "./collector-dashboard-client";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard");
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin/dashboard");
    }

    if (session.user.role === "COLLECTOR") {
        return <CollectorDashboard />;
    }

    // USER
    const [dashboardData, userDoc] = await Promise.all([
        getUserDashboardData(session.user.id),
        adminDb.collection("users").doc(session.user.id).get(),
    ]);

    const userData = userDoc.data();
    const userCounty: string | null = userData?.county ?? null;
    const userRegion: string | null = userData?.region ?? null;

    return (
        <div className="min-h-screen">
            <UserDashboardClient
                data={dashboardData}
                userName={session.user.name || ""}
                userCounty={userCounty}
                userRegion={userRegion}
            />
        </div>
    );
}
```

**Step 2: Check for type errors**

```bash
cd /home/chacha/Projects/green-loop
npx tsc --noEmit 2>&1 | grep "dashboard/page" | head -10
```
Expected: no output (UserDashboardClient props type error is expected until Task 4 is done — check after Task 4).

**Step 3: Commit after Task 4 is complete (batched commit)**

---

### Task 4: Update `UserDashboardClient` — Accept Props & Render LocationSection

**Files:**
- Modify: `app/(website)/dashboard/user-dashboard-client.tsx`

**Step 1: Add `userCounty` / `userRegion` props and render `LocationSection`**

Change the `DashboardClientProps` interface and add the import + render:

```tsx
// Add to imports at top:
import LocationSection from "@/components/user/location-section";

// Update the interface:
interface DashboardClientProps {
    data: UserDashboardData;
    userName: string;
    userCounty?: string | null;
    userRegion?: string | null;
}

// Update function signature:
export default function DashboardClient({ data, userName, userCounty, userRegion }: DashboardClientProps) {
```

Then, **after `<PickupTable history={data.pickupHistory} />`** in the primary column, add:

```tsx
<LocationSection
    initialCounty={userCounty}
    initialRegion={userRegion}
/>
```

**Step 2: Verify no type errors across both files**

```bash
cd /home/chacha/Projects/green-loop
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors.

**Step 3: Commit Tasks 3 and 4 together**

```bash
git add app/(website)/dashboard/page.tsx app/(website)/dashboard/user-dashboard-client.tsx
git commit -m "feat: wire user county/region into dashboard and render LocationSection

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Smoke Test

**Step 1: Start the dev server**

```bash
cd /home/chacha/Projects/green-loop
pnpm dev
```

**Step 2: Verify in browser**

1. Log in as a USER
2. Go to `/dashboard`
3. Scroll below pickup history — the **Location / Service Area** card should appear
4. The map should load showing Kenya (or the user's existing county/region if set)
5. Select a county → sub-region list appears, map updates
6. Click **Save Location** → shows spinner, then "✓ Saved!"
7. Hard-refresh the page → the saved county/region should still be selected

**Step 3: Verify the API directly (optional)**

```bash
curl -X PATCH http://localhost:3000/api/user/location \
  -H "Content-Type: application/json" \
  -d '{"county":"nairobi","region":"nairobi-westlands"}' \
  -w "\n%{http_code}\n"
```
Expected: `401` (no auth token). With a valid token: `{"success":true}` and `200`.

---

## Summary of Files

| File | Change |
|------|--------|
| `app/api/user/location/route.ts` | **New** — PATCH endpoint |
| `components/user/location-section.tsx` | **New** — location card component |
| `app/(website)/dashboard/page.tsx` | Fetch `county`/`region` from Firestore, pass as props |
| `app/(website)/dashboard/user-dashboard-client.tsx` | Accept new props, render `LocationSection` |
