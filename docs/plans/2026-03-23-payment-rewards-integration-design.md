# Design Document: Payment and Rewards Integration

## Overview
This document outlines the design for integrating the existing payment system with the Green Points rewards program. The goal is to incentivize correct waste classification and timely payments through a "Global Redemption Lock" model.

## User Experience
1.  **Earning Points:** Users earn Green Points immediately upon the completion of a pickup. Points are calculated based on the waste classification (AI-confirmed or manual) and weight/type.
2.  **Tracking Points:** Users can see their total Green Points in their dashboard.
3.  **Redemption Restriction:** If a user has any outstanding (unpaid) pickups, they can see their points but cannot redeem them for rewards (vouchers, discounts, etc.).
4.  **UI Feedback:** A warning icon and message are displayed in the rewards section if redemption is currently locked due to unpaid balances.

## Architecture & Data Flow

### 1. Point Calculation Engine
The points for a pickup are calculated when the collector marks a task as `COMPLETED` via `POST /api/collector/tasks/[id]/complete`.

**Formula:**
`TotalPoints = (BasePoints * CategoryMultiplier) * AccuracyBonus`

*   **BasePoints:** 50
*   **CategoryMultiplier:**
    *   Plastic: 1.5x
    *   Metal: 2.0x
    *   Organic: 1.2x
    *   Mixed: 1.1x
    *   General: 1.0x
*   **AccuracyBonus:** 2.0x if AI `probability` > 0.9 (high confidence).

### 2. Data Storage (Firestore)
*   **`users` Collection:**
    *   `rewardPoints` (number): The running total of usable points.
*   **`waste` Collection:**
    *   `pointsEarned` (number): Points awarded for this specific pickup.
*   **`schedules` Collection:**
    *   `paymentStatus` (string): 'Paid' or 'Unpaid' (synchronized via Stripe webhooks).

### 3. Redemption Lock Logic
*   **Backend Check:** Before returning dashboard data or processing a redemption request, the system checks for any `schedules` where `userId == currentUserId` AND `paymentStatus == 'Unpaid'`.
*   **`canRedeem` Flag:** A boolean flag is added to the dashboard API response to drive the UI state.

## Endpoint Changes

### `POST /api/collector/tasks/[id]/complete` (Modified)
*   **Logic:**
    1.  Mark status as `COMPLETED`.
    2.  Calculate `pointsEarned` using the engine.
    3.  Update `waste` document with `pointsEarned`.
    4.  Atomically increment `user.rewardPoints` using `admin.firestore.FieldValue.increment`.
    5.  Trigger a "Reward Earned" notification.

### `GET /api/dashboard/data` (Modified)
*   **Logic:**
    1.  Fetch user profile and schedules.
    2.  Check for unpaid schedules.
    3.  Set `canRedeem = (unpaidSchedules.length === 0)`.
    4.  Return `rewardPoints` and `canRedeem`.

### `POST /api/rewards/redeem` (New)
*   **Logic:**
    1.  Verify `canRedeem` is true.
    2.  Check if user has enough `rewardPoints`.
    3.  Deduct points and issue reward.

## Security & Reliability
*   **Atomic Updates:** Use Firestore transactions or `FieldValue.increment` to prevent race conditions during point awarding.
*   **Idempotency:** Ensure that points are only awarded once per pickup (e.g. check if `pointsEarned` already exists).
*   **Payment Webhook Safety:** The Stripe webhook already updates `paymentStatus`. Point redemption logic relies on this field, making it inherently linked to the payment flow.

## Testing Strategy
1.  **Unit Tests:** Verify the point calculation formula with various waste types and probabilities.
2.  **Integration Tests:**
    *   Mock a collector completing a task and verify the user's `rewardPoints` increment.
    *   Verify that a user with an 'Unpaid' schedule receives `canRedeem: false`.
3.  **UI Verification:** Ensure the "Redeem" button is appropriately disabled and the warning message is shown.
