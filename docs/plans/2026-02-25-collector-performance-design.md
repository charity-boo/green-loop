# Design Document: Collector Performance (Operational Intelligence)

**Date:** 2026-02-25
**Status:** Approved
**Topic:** Transform the collector performance module into a performant, managerial-grade analytics engine.

---

## 1. Overview
The current performance module uses client-side filtering and mapping on Prisma objects, which causes N+1 queries and memory spikes as the dataset grows. This refactor moves all performance calculations to the database using Raw SQL (`$queryRaw`) to provide scalable, paginated, and sortable operational intelligence.

## 2. Managerial Requirements
- **Recency first**: Default to a 30-day window for metrics.
- **Actionability**: Rank collectors by completion rate.
- **Visibility**: Include collectors with 0 assignments (meaningful workload insight).
- **Scalability**: Paginated results with metadata.

## 3. Data Interface

### `PaginatedPerformance`
```ts
export interface PaginatedPerformance {
    data: {
        collectorId: string;
        name: string;
        assigned: number;
        completed: number;
        missed: number;
        completionRate: number;
    }[];
    meta: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}
```

## 4. Technical Strategy

### 4.1 SQL-Level Aggregation
We will use a single optimized SQL query to calculate metrics for a slice of data:
- `COUNT(s.id)` for total assignments.
- `SUM(CASE WHEN status = 'COMPLETED')` for success metrics.
- Computed `completion_rate`.
- Handles date-range filtering as part of the `LEFT JOIN` or `WHERE` clause.

### 4.2 Security: Sort Whitelisting
To prevent SQL injection while allowing dynamic sorting on computed fields:
- Whitelist map: `completionRate` -> `completion_rate`, `assigned` -> `assigned`, etc.
- Reject any sort fields not in the whitelist.

### 4.3 Pagination Architecture
- **Offset Pagination**: Standard for admin tables/datasets < 10k rows.
- **Double Query**: One for metadata count, one for the slice of data.

## 5. Success Criteria
- [ ] No schedule objects are loaded into Node.js memory.
- [ ] Sorting by "Completion Rate" is handled at the SQL level.
- [ ] Pagination metadata is accurate (total pages calculated).
- [ ] Collectors with 100% failure or 0 work are correctly represented.
