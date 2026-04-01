import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import { assignScheduleAutomatically } from '@/lib/admin/assignment';
import { writeWorkflowLog } from '@/lib/workflow-log';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Stripe webhook signature verification failed:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};
      const { paymentId, wasteId } = metadata;
      console.log(`[StripeWebhook] Session completed. Payment ID: ${paymentId}, Waste ID: ${wasteId}`);

      if (!paymentId) {
        console.error('Missing paymentId in Stripe session metadata');
        return NextResponse.json({ error: 'Missing paymentId metadata' }, { status: 400 });
      }

      const paymentDoc = await adminDb.collection('payments').doc(paymentId).get();
      if (!paymentDoc.exists) {
        console.error(`Payment ${paymentId} not found`);
        return NextResponse.json({ error: 'Payment not found' }, { status: 400 });
      }

      const payment = paymentDoc.data();

      const paymentAlreadySuccessful = payment?.status === 'SUCCESS';
      if (!paymentAlreadySuccessful) {
        await adminDb.collection('payments').doc(paymentId).update({
          status: 'SUCCESS',
          stripeSessionId: session.id,
          transactionId: session.payment_intent ?? null,
          updatedAt: new Date().toISOString(),
        });
      }

      // Sync paymentStatus back to the schedule document for dashboard display
      if (wasteId) {
        await writeWorkflowLog({
          event: 'payment_succeeded',
          scheduleId: wasteId,
          wasteId,
          paymentId,
          paymentIntentId: session.payment_intent?.toString() ?? null,
          stripeSessionId: session.id,
          actorType: 'stripe',
          after: { paymentStatus: 'Paid' },
          metadata: paymentAlreadySuccessful ? { idempotent: true } : undefined,
        });

        console.log(`[StripeWebhook] Updating schedule and waste ${wasteId} to Paid`);
        const scheduleRef = adminDb.collection('schedules').doc(wasteId);
        const wasteRef = adminDb.collection('waste').doc(wasteId);
        
        const now = new Date().toISOString();
        const updateData = {
          paymentStatus: 'Paid',
          stripeSessionId: session.id,
          updatedAt: now,
        };

        // Update the schedule
        await scheduleRef.update(updateData);

        // Update the waste task if it already exists
        const wasteDoc = await wasteRef.get();
        if (wasteDoc.exists) {
          await wasteRef.update({
            paymentStatus: 'Paid',
            updatedAt: now,
          });
        }

        // Fetch fresh data to check region
        const scheduleDoc = await scheduleRef.get();
        const scheduleData = scheduleDoc.data();

        if (scheduleData?.region) {
          console.log(`[StripeWebhook] Triggering auto-assignment for wasteId: ${wasteId}`);
          const result = await assignScheduleAutomatically(wasteId);
          if (result.assignedCollectorId) {
            console.log(`[StripeWebhook] Successfully auto-assigned collector ${result.assignedCollectorId} to schedule ${wasteId}`);
          } else {
            console.warn(`[StripeWebhook] Auto-assignment failed for schedule ${wasteId}: ${result.reason}`);
          }
        } else {
          console.warn(`[StripeWebhook] Schedule ${wasteId} has no region, skipping auto-assignment`);
          await writeWorkflowLog({
            event: 'assignment_failed',
            scheduleId: wasteId,
            wasteId,
            actorType: 'system',
            metadata: { reason: 'missing_region' },
          });
        }
      }

      console.info(`Payment ${paymentId} marked SUCCESS`);
    } else if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
      const obj = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;
      const metadata = 'metadata' in obj ? obj.metadata : {};
      const paymentId = metadata?.paymentId;

      if (paymentId) {
        await adminDb.collection('payments').doc(paymentId).update({
          status: 'FAILED',
          updatedAt: new Date().toISOString(),
        });
        console.info(`Payment ${paymentId} marked FAILED`);
        const wasteId = metadata?.wasteId;
        if (wasteId) {
          await writeWorkflowLog({
            event: 'payment_failed',
            scheduleId: wasteId,
            wasteId,
            paymentId,
            actorType: 'stripe',
            metadata: { stripeEventType: event.type },
          });
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
