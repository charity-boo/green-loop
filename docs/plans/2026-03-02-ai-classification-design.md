# AI Waste Classification — Design

**Date:** 2026-03-02  
**Status:** Approved

## Problem

Waste submissions contain user-uploaded images but carry no structured category data. Collectors and admins have no automated way to know what type of waste is being collected, and users receive no guidance on how to prepare their waste.

## Proposed Solution

Integrate Google Gemini Vision to classify waste images and return a free-form waste type label plus disposal/handling tips. Classification happens on two paths:

1. **Live path** — auto-triggered on image upload during pickup scheduling (immediate feedback in the form).
2. **Re-classify path** — on-demand button on any waste card, processed via a Firebase Cloud Function.

---

## Architecture

```
LIVE PATH (on upload)
  Schedule-pickup form
    → uploads image to Firebase Storage
    → calls POST /api/waste/classify { imageUrl }
    → Gemini Vision returns { wasteType, disposalTips }
    → shows badge inline in the form
    → classification stored in form state
    → included in waste document on submit

RE-CLASSIFY PATH (on-demand)
  User/collector/admin clicks "Re-classify" on a waste card
    → PATCH /api/waste/{id} sets classificationStatus: "pending"
    → Cloud Function triggers on that Firestore write
    → Calls Gemini Vision with stored imageUrl
    → Updates waste doc: wasteType, disposalTips, classificationStatus
    → Fires an AI-suggestion notification to the waste owner

Shared Gemini client: lib/ai/gemini.ts (used by API route)
Cloud Function has its own copy of the Gemini call (separate Node process)
```

---

## Data Model

New fields on each `waste` Firestore document:

| Field | Type | Description |
|---|---|---|
| `wasteType` | `string \| null` | Free-form AI label (e.g. "plastic bottle", "food waste") |
| `disposalTips` | `string \| null` | AI-generated handling/disposal guidance (2–3 sentences) |
| `classificationStatus` | `'none' \| 'pending' \| 'classified' \| 'failed'` | Tracks classification lifecycle |
| `classifiedAt` | `Timestamp \| null` | Timestamp of last successful classification |

`classificationStatus: 'pending'` is the Cloud Function trigger signal.  
The live path sets `classificationStatus: 'classified'` directly on waste creation (no CF trigger).

TypeScript type additions go into `lib/types/firestore.ts`.

---

## API Route — `POST /api/waste/classify`

**Auth:** Any authenticated user (USER, COLLECTOR, ADMIN).

**Request:**
```ts
{ imageUrl: string }
```

**Behavior:**
1. Validates `imageUrl` is a valid URL.
2. Calls Gemini Vision (`gemini-2.0-flash`) with a structured JSON prompt.
3. Returns `{ wasteType, disposalTips }` — no Firestore write (classification travels with the form submission on creation).

**Gemini prompt:**
```
Analyze this image of waste/garbage. Return ONLY valid JSON:
{
  "wasteType": "<concise label>",
  "disposalTips": "<2-3 sentence handling/disposal guidance>"
}
```

**Error handling:** Returns a 502 with a descriptive message if Gemini fails.

---

## Cloud Function — `classifyWaste`

**Trigger:** Firestore `onDocumentUpdated('waste/{wasteId}')` — only processes when `classificationStatus` transitions to `'pending'`.

**Behavior:**
1. Reads `imageUrl` from the updated waste document.
2. If no `imageUrl`, sets `classificationStatus: 'failed'` and exits.
3. Calls Gemini Vision with the same structured prompt.
4. On success: writes `wasteType`, `disposalTips`, `classificationStatus: 'classified'`, `classifiedAt` back to the document.
5. Creates an `AI-suggestion` notification in the `notifications` collection for the waste owner.
6. On Gemini error: sets `classificationStatus: 'failed'`.

**Location:** `functions/src/classifyWaste.ts` (registered in `functions/src/index.ts`).

**Environment:** Gemini API key stored as a Firebase Function secret (`GEMINI_API_KEY`).

---

## UI Changes

### Schedule-Pickup Form
- After image upload, auto-calls `POST /api/waste/classify`.
- Shows loading spinner → then `wasteType` badge + collapsible `disposalTips`.
- Classification stored in form state and included in the waste creation payload.

### Waste Cards (User dashboard + Collector/Admin dashboard)
- Display `wasteType` as a colored badge (color derived from label keywords: green for organic, blue for recyclable, red for hazardous, gray default).
- Show `disposalTips` in a collapsible/tooltip section.
- If `classificationStatus === 'failed'` or field is absent → show "Re-classify" button.
  - USER: only on their own waste.
  - COLLECTOR / ADMIN: on any waste.
- "Re-classify" calls `PATCH /api/waste/{id}` to set `classificationStatus: 'pending'`, then shows "Classifying…" state.

---

## Out of Scope

- Confidence scores (Gemini returns free-form text; no structured confidence value).
- Admin bulk re-classification job.
- Classification history / audit trail.
