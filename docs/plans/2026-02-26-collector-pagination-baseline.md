# Design Document: Collector Performance Pagination Baseline

**Date:** 2026-02-26
**Status:** Approved (Approach 1)
**Topic:** Implementation of server-driven pagination for collector performance metrics.

---

## 1. Overview
The goal is to build a reliable, server-driven paginated table. This baseline will ensure that navigation, state persistence via URLs, and data rendering are stable before adding more complex features like sorting or filtering.

## 2. Requirements
- Use Next.js 15 async `searchParams`.
- Small page limit (`limit: 2`) to force pagination testing.
- Manual mapping of backend `meta` to UI `Meta`.
- No additional styling or complex UX (sorting, colors) until baseline is confirmed.

## 3. Component Architecture

### 3.1 Server Page (`page.tsx`)
This component acts as the data entry point.
- **Inputs**: `searchParams` (Promise).
- **Logic**: 
  - Await and sanitize `page` param.
  - Fetch data from `getCollectorPerformance`.
  - Transform metadata to match UI requirements.
- **Output**: Renders `CollectorTable`.

### 3.2 Client Table Component (`collector-table.tsx`)
This component handles the visual representation and navigation links.
- **Props**: `data` (CollectorPerformance[]), `meta` (Meta).
- **Navigation**: Use `<Link>` with `?page=N`.
- **Safety**: Clamp "Previous" link to `page=1`.
- **Accessibility**: Disable Next/Previous buttons visually and functionally when at bounds.

## 4. Key Implementation Details

### Next.js 15 `searchParams` Handling
```tsx
const { page: pageStr } = await searchParams;
const page = Math.max(Number(pageStr) || 1, 1);
```

### Explicit Meta Mapping
The UI component expects keys that differ from the backend response to maintain architectural hygiene.
- `result.meta.total` -> `totalCount`
- `result.meta.totalPages` -> `totalPages`
- `result.meta.page` -> `currentPage`
- `result.meta.limit` -> `pageSize`

## 5. Success Criteria
- [ ] `/dashboard/collectors` loads Bob & Alice (page 1).
- [ ] Clicking "Next" loads Charlie (page 2).
- [ ] URL reflects the current page.
- [ ] Page refresh preserves the current page.
- [ ] No console errors or hydration warnings.
