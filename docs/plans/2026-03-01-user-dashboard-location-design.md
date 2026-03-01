# User Dashboard — Location Section Design

**Date:** 2026-03-01  
**Status:** Approved

## Problem

The user dashboard has no location section. Users cannot set or view their service county/area. The Firestore `users` collection already stores `county` and `region` fields (same structure used by collector registration), but there is no UI to display or edit them.

## Goal

Add a location section to the user dashboard main column (below pickup history) that lets users view their current county and sub-region, change them via dropdowns, preview the location on an embedded map, and save.

## Design

### Component: `components/user/location-section.tsx`

- Client component accepting `initialCounty` and `initialRegion` props
- Local state: `county`, `region`, `saving`, `saved`, `error`
- Changing county resets region to `""` and clears saved state
- Embedded Google Maps iframe URL built dynamically from selected county + sub-region: `https://maps.google.com/maps?q={SubRegion},{County},Kenya&z=13&output=embed`
- Map previews live as user changes selection (React `key={mapQuery}` forces re-render)
- Save button calls `PATCH /api/user/location`; shows spinner and ✓ confirmation

### Dropdowns

Both county and sub-region dropdowns use `KENYA_COUNTIES` from `lib/constants/regions.ts` — the same data as collector registration. Sub-region list is filtered by selected county.

### Data Load

`app/(website)/dashboard/page.tsx`:
- After fetching session, reads `users/{userId}` from Firestore via `adminDb`
- Passes `userCounty` and `userRegion` as props to `UserDashboardClient`
- `UserDashboardClient` passes them to `LocationSection`

### API Route: `PATCH /api/user/location`

- Requires authenticated session (401 if missing)
- Validates `county` against `KENYA_COUNTIES` and `region` against the county's `subRegions`
- Writes `{ county, region }` to `users/{userId}` in Firestore

## Files Changed

| File | Change |
|------|--------|
| `components/user/location-section.tsx` | **New** — location card component |
| `app/api/user/location/route.ts` | **New** — PATCH endpoint |
| `app/(website)/dashboard/page.tsx` | Fetch user county/region, pass as props |
| `app/(website)/dashboard/user-dashboard-client.tsx` | Accept county/region props, render LocationSection |
