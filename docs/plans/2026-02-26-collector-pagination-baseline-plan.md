# Collector Pagination Baseline Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a server-driven paginated table for collector performance metrics with Next.js 15 async `searchParams`.

**Architecture:** RSC Page handles data fetching and `searchParams` awaiting/sanitization. Client Table handles rendering and navigation links with clamping.

**Tech Stack:** Next.js 15 (App Router), Tailwind CSS, Prisma, lucide-react.

---

### Task 1: Create the Performance Module Entry Point

**Files:**
- Create: `app/(admin)/dashboard/collectors/page.tsx`

**Step 1: Implement the Server Component**
Create a new file at `app/(admin)/dashboard/collectors/page.tsx` with async `searchParams` handling and meta mapping.

```tsx
import { getCollectorPerformance } from "@/lib/firebase/services/analytics";
import CollectorTable from "./collector-table";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CollectorPerformancePage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(Number(pageStr) || 1, 1);

  const result = await getCollectorPerformance({
    page,
    limit: 2, // small for testing
    sortBy: "completionRate",
    sortOrder: "desc",
  });

  const meta = {
    totalCount: result.total,
    totalPages: result.totalPages,
    currentPage: result.page,
    pageSize: result.limit,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Collector Performance</h1>
      <CollectorTable data={result.data} meta={meta} />
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add app/(admin)/dashboard/collectors/page.tsx
git commit -m "feat(admin): add collector performance server page"
```

---

### Task 2: Create the Client Table Component

**Files:**
- Create: `app/(admin)/dashboard/collectors/collector-table.tsx`

**Step 1: Implement the Client Component**
Create `app/(admin)/dashboard/collectors/collector-table.tsx` with semantic table and clamped pagination links.

```tsx
"use client";

import Link from "next/link";

interface CollectorPerformance {
  collectorId: string;
  name: string;
  assigned: number;
  completed: number;
  missed: number;
  completionRate: number;
}

interface Meta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface Props {
  data: CollectorPerformance[];
  meta: Meta;
}

export default function CollectorTable({ data, meta }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th>Assigned</th>
            <th>Completed</th>
            <th>Missed</th>
            <th>Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.collectorId} className="border-b">
              <td className="py-2 font-medium">{c.name}</td>
              <td>{c.assigned}</td>
              <td>{c.completed}</td>
              <td>{c.missed}</td>
              <td>{c.completionRate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href={`?page=${Math.max(meta.currentPage - 1, 1)}`}
          className={`px-3 py-1 rounded border ${
            meta.currentPage <= 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Previous
        </Link>

        <span className="text-xs text-gray-500">
          Page {meta.currentPage} of {meta.totalPages}
        </span>

        <Link
          href={`?page=${meta.currentPage + 1}`}
          className={`px-3 py-1 rounded border ${
            meta.currentPage >= meta.totalPages
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
```

**Step 2: Commit**
```bash
git add app/(admin)/dashboard/collectors/collector-table.tsx
git commit -m "feat(admin): add collector performance table component"
```

---

### Task 3: Final Verification

**Step 1: Run Verification Script**
I'll use the browser subagent to verify the UI behavior.

**Step 2: Confirm Success Criteria**
1. Visit `/dashboard/collectors`.
2. Confirm Bob & Alice are there.
3. Click "Next" -> Confirm Charlie is there.
4. Refresh -> Confirm Page 2 persists.
5. Check for console errors.
