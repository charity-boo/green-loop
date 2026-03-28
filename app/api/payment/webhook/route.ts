import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';

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
      const { paymentId } = session.metadata ?? {};

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

      // Idempotency: skip if already SUCCESS
      if (payment?.status === 'SUCCESS') {
        return NextResponse.json({ received: true }, { status: 200 });
      }

      await adminDb.collection('payments').doc(paymentId).update({
        status: 'SUCCESS',
        stripeSessionId: session.id,
        transactionId: session.payment_intent ?? null,
        updatedAt: new Date().toISOString(),
      });

      // Sync paymentStatus back to the schedule document for dashboard display
      const { wasteId } = session.metadata ?? {};
      if (wasteId) {
        await adminDb.collection('schedules').doc(wasteId).update({
          paymentStatus: 'Paid',
          stripeSessionId: session.id,
          updatedAt: new Date().toISOString(),
        });
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
