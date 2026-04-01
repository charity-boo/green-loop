# Stripe Local Setup & Testing Guide

This guide explains how to set up and test the Stripe payment flow locally in the Green Loop project.

## 1. Environment Variables
Ensure your `.env.local` contains the following Stripe keys. You can get these from your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) in Test Mode.

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (Get this from Stripe CLI, see below)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Using the Stripe CLI (Recommended)
The Stripe CLI allows you to receive webhooks on your local machine.

1.  **Install Stripe CLI:** [Follow the official installation guide](https://docs.stripe.com/stripe-cli).
2.  **Login:** `stripe login`
3.  **Listen for Webhooks:**
    ```bash
    stripe listen --forward-to localhost:3000/api/payment/webhook
    ```
4.  **Update Secret:** Copy the `whsec_...` secret from the terminal output and paste it as `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

## 3. Local Testing Workflow

### A. Manual Test (End-to-End)
1.  Start the project: `pnpm dev`
2.  Log in as a Resident.
3.  Go to **Schedule Pickup** and complete the form.
4.  Click **Pay Now**. You will be redirected to the Stripe Checkout page.
5.  Use a [test card](https://docs.stripe.com/testing) (e.g., `4242 4242 4242 4242`).
6.  After payment, you'll be redirected to `/payment/success`.
7.  Check your Dashboard to see the schedule marked as **Paid**.
8.  The system will automatically assign a collector in your region.

### B. Automated Logic Test
If you want to verify the backend logic (Payment -> Schedule Update -> Auto-Assignment) without going through the Stripe UI:

```bash
# 1. Start Firebase Emulators
pnpm dev

# 2. Run the integrated test script (in a new terminal)
pnpm test:payment
```

### C. Simulate Webhook for Existing Schedule
If you have a pending schedule and want to trigger the payment success flow:

```bash
npx tsx scripts/simulate-payment.ts <YOUR_SCHEDULE_ID>
```

## 4. Key Files
- `app/api/payment/initiate/route.ts`: Creates Stripe Checkout sessions.
- `app/api/payment/webhook/route.ts`: Processes Stripe webhooks.
- `lib/admin/assignment.ts`: Handles regional auto-assignment after payment.
- `app/(website)/payment/success/page.tsx`: The post-payment confirmation page.
