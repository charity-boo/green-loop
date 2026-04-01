# Region-Based Auto Assignment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make job assignment fully application-managed and region-based, with automatic assignment (no manual collector claim), using least-active-workload selection among active collectors in the matching region.

**Architecture:** `schedules` remains the assignment source-of-truth; every assignment decision is made server-side via a single assignment service and mirrored into `waste` for collector task workflows. Assignment is triggered on payment success and for eligible backlog jobs, and is idempotent using Firestore transactions plus assignment guards.

**Tech Stack:** Next.js App Router API routes, Firebase Admin SDK (Firestore transactions), Firebase client hooks, TypeScript, Vitest.

---

### Task 1: Lock assignment policy with failing tests

**Files:**
- Modify: `app/api/payment/webhook/__tests__/route.test.ts`
- Create: `lib/admin/__tests__/assignment-selection.test.ts`
- Create: `lib/admin/__tests__/assignment-eligibility.test.ts`

**Step 1: Write failing tests for the required behavior**

Add tests that assert:
- payment webhook triggers assignment via server logic only
- collector is selected by least active workload in matching region
- no assignment happens for missing region / unpaid / non-pending / already assigned
- assignment is idempotent if retried

**Step 2: Run tests to verify failures**

Run:
`pnpm -s exec vitest app/api/payment/webhook/__tests__/route.test.ts lib/admin/__tests__/assignment-selection.test.ts lib/admin/__tests__/assignment-eligibility.test.ts`

Expected:
- FAIL on new assertions/functions not implemented yet

**Step 3: Commit**

```bash
git add app/api/payment/webhook/__tests__/route.test.ts lib/admin/__tests__/assignment-selection.test.ts lib/admin/__tests__/assignment-eligibility.test.ts
git commit -m "test: specify region-based auto-assignment policy"
```

### Task 2: Introduce unified assignment engine (least workload, region-based)

**Files:**
- Modify: `lib/admin/assignment.ts`
- Create: `lib/admin/assignment-policy.ts`
- Create: `lib/admin/assignment-types.ts`

**Step 1: Write minimal implementation in new policy module**

Implement pure helpers:
- `isEligibleForAssignment(schedule)`
- `collectorMatchesRegion(collector, scheduleRegion, scheduleCounty)`
- `selectLeastLoadedCollector(collectors, workloads)`

**Step 2: Refactor assignment flow into a single entrypoint**

In `lib/admin/assignment.ts`, implement:
- `assignScheduleAutomatically(scheduleId: string): Promise<{ assignedCollectorId: string | null; reason?: string }>`
- Reads schedule, validates eligibility, finds active collectors in region/county, computes workload, selects least loaded collector
- Transaction updates `schedules` assignment fields and status atomically
- Mirrors to `waste` with consistent IDs/fields for collector task flow
- Writes workflow logs for success/failure reasons

**Step 3: Run assignment unit tests**

Run:
`pnpm -s exec vitest lib/admin/__tests__/assignment-selection.test.ts lib/admin/__tests__/assignment-eligibility.test.ts`

Expected:
- PASS

**Step 4: Commit**

```bash
git add lib/admin/assignment.ts lib/admin/assignment-policy.ts lib/admin/assignment-types.ts lib/admin/__tests__/assignment-selection.test.ts lib/admin/__tests__/assignment-eligibility.test.ts
git commit -m "feat: add region-based least-load assignment engine"
```

### Task 3: Route all assignment triggers through the unified engine

**Files:**
- Modify: `app/api/payment/webhook/route.ts`
- Modify: `app/api/admin/schedules/route.ts`
- Modify: `app/api/admin/users/[id]/approve/route.ts`
- Modify: `app/api/payment/verify/route.ts`

**Step 1: Replace direct/legacy assignment calls**

Use `assignScheduleAutomatically` in:
- payment webhook after `paymentStatus` becomes `Paid`
- payment verify fallback path
- admin schedule status transitions to `assigned` (only via engine)
- collector approval backlog assignment loop (for matching region jobs)

**Step 2: Enforce auto-assignment-only policy**

Ensure no route directly sets assignment fields unless inside assignment engine transaction.

**Step 3: Add/adjust route tests**

Update webhook/admin route tests to assert:
- engine invoked
- no manual field writes bypassing engine
- proper responses for no eligible collector

**Step 4: Run route tests**

Run:
`pnpm -s exec vitest app/api/payment/webhook/__tests__/route.test.ts app/api/admin/schedules/__tests__/route.test.ts`

Expected:
- PASS

**Step 5: Commit**

```bash
git add app/api/payment/webhook/route.ts app/api/admin/schedules/route.ts app/api/admin/users/[id]/approve/route.ts app/api/payment/verify/route.ts app/api/payment/webhook/__tests__/route.test.ts app/api/admin/schedules/__tests__/route.test.ts
git commit -m "refactor: route all assignment triggers through unified engine"
```

### Task 4: Remove manual collector-claim path from collector UI/API behavior

**Files:**
- Modify: `app/api/collector/accept-job/route.ts`
- Modify: `hooks/use-available-jobs.ts`
- Modify: `app/(website)/dashboard/collector/available/page.tsx`
- Modify: `app/(website)/dashboard/collector/layout.tsx`
- Modify: `components/dashboard/sidebar-nav.tsx`

**Step 1: Decommission manual claim API behavior**

Change `POST /api/collector/accept-job` to return `409`/`410` with clear message:
- `"Manual claiming is disabled. Jobs are assigned automatically by region."`

**Step 2: Update collector UI**

- Remove/disable Accept button action
- Replace “Available Jobs” view with “Auto Assignment Status” panel (read-only)
- Keep dashboard stats consistent with auto-assignment model (no misleading open-claim counts)

**Step 3: Update client tests (if present) or add focused rendering tests**

Verify collector cannot trigger claim flow and sees system-managed assignment message.

**Step 4: Run targeted checks**

Run:
`pnpm -s exec eslint app/api/collector/accept-job/route.ts hooks/use-available-jobs.ts app/(website)/dashboard/collector/available/page.tsx app/(website)/dashboard/collector/layout.tsx components/dashboard/sidebar-nav.tsx`

Expected:
- PASS

**Step 5: Commit**

```bash
git add app/api/collector/accept-job/route.ts hooks/use-available-jobs.ts app/(website)/dashboard/collector/available/page.tsx app/(website)/dashboard/collector/layout.tsx components/dashboard/sidebar-nav.tsx
git commit -m "feat: enforce auto-assignment-only collector flow"
```

### Task 5: Add backlog reconciliation for already-paid unassigned schedules

**Files:**
- Create: `scripts/reconcile-region-assignments.ts`
- Modify: `package.json`
- (Optional) Modify: `README.md` (ops command section)

**Step 1: Write reconciliation script**

Script behavior:
- query `schedules` where `paymentStatus == 'Paid'` and assignment missing
- run `assignScheduleAutomatically(scheduleId)` per item
- output totals: assigned / skipped / failed with reasons

**Step 2: Add script command**

Add script:
- `"assign:reconcile": "tsx scripts/reconcile-region-assignments.ts"`

**Step 3: Dry-run and then execute locally against emulator/dev**

Run:
- `pnpm assign:reconcile -- --dry-run`
- `pnpm assign:reconcile`

Expected:
- deterministic summary and no crashes on malformed records

**Step 4: Commit**

```bash
git add scripts/reconcile-region-assignments.ts package.json README.md
git commit -m "chore: add reconciliation script for paid unassigned schedules"
```

### Task 6: Firestore indexing and safety validation

**Files:**
- Modify: `firebase/rules/firestore.indexes.json` (or project index file in use)
- Modify: `docs/FIRESTORE_QUICK_REFERENCE.md`

**Step 1: Add required composite indexes**

Indexes for common assignment queries, e.g.:
- collectors by `(role, region, status/active)`
- workload queries by `(assignedCollectorId, status)`
- schedules backlog by `(paymentStatus, status, region)`

**Step 2: Validate rules/index workflow**

Run:
`pnpm test:rules`

Expected:
- PASS

**Step 3: Commit**

```bash
git add firebase/rules/firestore.indexes.json docs/FIRESTORE_QUICK_REFERENCE.md
git commit -m "chore: add firestore indexes for assignment queries"
```

### Task 7: End-to-end verification and regression sweep

**Files:**
- Modify (if needed): `docs/API_TEST_PLAN.md`

**Step 1: Execute verification matrix**

Run:
- `pnpm -s exec vitest app/api/payment/webhook/__tests__/route.test.ts app/api/admin/schedules/__tests__/route.test.ts lib/admin/__tests__/assignment-selection.test.ts lib/admin/__tests__/assignment-eligibility.test.ts`
- `pnpm -s exec eslint app/api/payment/webhook/route.ts app/api/admin/schedules/route.ts lib/admin/assignment.ts app/api/collector/accept-job/route.ts`

Expected:
- PASS for targeted tests/lint

**Step 2: Manual smoke tests**

Validate in app:
- create schedule with region, complete payment, job auto-assigned to least-loaded active collector in region
- collector sees assigned task in normal task flow
- manual claim endpoint/UI blocked with clear message
- retry webhook/verify does not duplicate/reassign

**Step 3: Final commit**

```bash
git add docs/API_TEST_PLAN.md
git commit -m "test: document and verify region-based auto-assignment flow"
```

## Notes / Guardrails

- Keep assignment writes centralized in `lib/admin/assignment.ts`; other routes call service only.
- Preserve backward compatibility while migrating mixed fields (`collectorId` and `assignedCollectorId`) but standardize writes from engine.
- Prefer explicit failure reasons (`missing_region`, `no_active_collectors`, `not_eligible`, `already_assigned`) for observability and support.
- Do not broaden catch-and-ignore behavior; surface errors and log workflow events.

