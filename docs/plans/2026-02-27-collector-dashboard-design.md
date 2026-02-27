# Collector "Field-Ops" Dashboard Design

**Goal:** Create a high-performance, real-time mobile interface for collectors to manage their workload, synchronize data in low-signal areas, and track their performance within the Green Loop ecosystem.

## 1. Route Architecture (Mobile-First)

The dashboard will be a dedicated segmented area of the application, optimized for mobile browsers.

- **Base Route:** `/dashboard/collector` (Root view for real-time task queue)
- **Active Job Mode:** `/dashboard/collector/active/[jobId]` (Focus view for arrival, verification, and completion)
- **Performance Hub:** `/dashboard/collector/performance` (Metrics, rewards, and reporting)

## 2. Design System & Aesthetics (Premium Dual-Mode)

Strict adherence to the "Green Loop" brand identity with extreme focus on field legibility.

### Light Mode (Direct Sunlight Optimized)
- **Background:** `#F8FAFC` (Slate 50) with Emerald-100 translucent overlays.
- **Surface:** White glassmorphism (`backdrop-blur-md`).
- **Primary Text:** `#064E3B` (Emerald 900) for high-contrast reading.

### Dark Mode (Low Light / Evening Optimized)
- **Background:** `#022C22` (Emerald 950).
- **Surface:** `#064E3B` / 40% opacity glassmorphism.
- **Primary Text:** `#F0FDF4` (Emerald 50).

### Shared Elements
- **Primary Action:** Neon Emerald (`#10B981`) buttons with HSL-tailored shadows.
- **Priority Tags:** 
  - Organic: Terra Cotta (`#D97706`)
  - Recyclable: Ocean Green (`#059669`)
  - Bulky: Slate Gray (`#4B5563`)

## 3. Data Architecture (Firebase Backend)

### Firestore Schema: `waste_schedules` (Top-Level)
| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore Auto-ID |
| `collectorId` | string | Matches Firebase Auth UID |
| `userId` | string | UID of the waste producer |
| `status` | string | `PENDING`, `ACTIVE`, `COMPLETED`, `CANCELLED` |
| `priority` | string | `ORGANIC`, `RECYCLABLE`, `BULKY` |
| `address` | string | Human-readable address |
| `coordinates` | geopoint | For navigation |
| `weight` | number | Collected weight in kg |
| `beforeImageUrl` | string | Storage link (verification) |
| `afterImageUrl` | string | Storage link (proof of service) |
| `aiCategory` | string | Predicted type from user upload |
| `aiConfidence` | number | AI confidence score |
| `createdAt` | timestamp | Creation time |
| `updatedAt` | timestamp | Last modification |

### Real-Time Synchronization
- **Hook Pattern:** `useCollectorTasks(uid)` utilizing `onSnapshot` with `includeMetadataChanges: true`.
- **Offline Mode:** Enabled via `enableIndexedDbPersistence` in `lib/firebase/config.ts`.
- **Indicators:** UI will show a subtle pulsate/spinner on task cards when `hasPendingWrites` is true (syncing to cloud).

## 4. Interaction Workflow

### Step 1: Real-Time Queue (Home)
- Collectors see a list of assigned jobs.
- Cards show AI-suggested categories and a preview photo.
- Real-time updates push new jobs to the top with a subtle notification sound/haptic.

### Step 2: Active Job Mode
- **Navigation:** Deep link to native maps via coordinates.
- **Weight Entry:** Large-scale numeric input with haptic feedback.
- **Verification:** Side-by-side comparison of "User Photo" vs "Collector Observation".
- **Storage:** Direct upload to Firebase Storage with background retry logic.

### Step 3: Performance & Reporting
- **Incentive Visuals:** Progress rings for daily targets.
- **Incident Module:** Text entry for road blockages or contamination reports, stored in a sub-collection of the specific schedule.

## 5. Security & RBAC
- **Firestore Rules:** 
  - `allow read, update: if request.auth.uid == resource.data.collectorId`.
  - Only Admins can reassign jobs once marked `ACTIVE`.
- **Middleware:** Ensuring only users with the `COLLECTOR` role can access `/dashboard/collector/*`.
