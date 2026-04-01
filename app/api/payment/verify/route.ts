import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase/admin';
import { assignScheduleAutomatically } from '@/lib/admin/assignment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function reconcilePaymentSync(sessionId: string, paymentId: string, wasteId?: string) {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  const isStripePaid = checkoutSession.payment_status === 'paid' || checkoutSession.status === 'complete';

  if (!isStripePaid) {
    return false;
  }

  const now = new Date().toISOString();

  await adminDb.collection('payments').doc(paymentId).update({
    status: 'SUCCESS',
    stripeSessionId: sessionId,
    transactionId: checkoutSession.payment_intent ?? null,
    updatedAt: now,
  });

  if (!wasteId) {
    return true;
  }

  const scheduleRef = adminDb.collection('schedules').doc(wasteId);
  const wasteRef = adminDb.collection('waste').doc(wasteId);

  const scheduleDoc = await scheduleRef.get();
  if (!scheduleDoc.exists) {
    return true;
  }

  const scheduleData = scheduleDoc.data();
  if (scheduleData?.paymentStatus !== 'Paid') {
    await scheduleRef.update({
      paymentStatus: 'Paid',
      stripeSessionId: sessionId,
      updatedAt: now,
    });
  }

  const wasteDoc = await wasteRef.get();
  if (wasteDoc.exists) {
    await wasteRef.update({
      paymentStatus: 'Paid',
      updatedAt: now,
    });
  }

  const freshScheduleDoc = await scheduleRef.get();
  const freshScheduleData = freshScheduleDoc.data();
  if (wasteId && freshScheduleData?.region && !freshScheduleData.collectorId) {
    await assignScheduleAutomatically(wasteId);
  }

  return true;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Query the payments collection for the document with this stripeSessionId
    const snapshot = await adminDb
      .collection('payments')
      .where('stripeSessionId', '==', sessionId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const paymentDoc = snapshot.docs[0];
    const paymentData = paymentDoc.data();
    const wasteId = paymentData.scheduleId as string | undefined;

    let schedulePaymentStatus: string | null = null;
    if (wasteId) {
      const scheduleDoc = await adminDb.collection('schedules').doc(wasteId).get();
      if (scheduleDoc.exists) {
        const scheduleData = scheduleDoc.data();
        schedulePaymentStatus = (scheduleData?.paymentStatus as string | undefined) ?? null;
      }
    }

    const isSynced = paymentData.status === 'SUCCESS' && schedulePaymentStatus === 'Paid';
    let reconciled = false;
    if (!isSynced) {
      reconciled = await reconcilePaymentSync(sessionId, paymentDoc.id, wasteId);
      if (reconciled && wasteId) {
        const updatedScheduleDoc = await adminDb.collection('schedules').doc(wasteId).get();
        if (updatedScheduleDoc.exists) {
          const updatedScheduleData = updatedScheduleDoc.data();
          schedulePaymentStatus = (updatedScheduleData?.paymentStatus as string | undefined) ?? null;
        }
      }
    }

    return NextResponse.json({
      paymentId: paymentDoc.id,
      wasteId,
      paymentStatus: reconciled ? 'SUCCESS' : paymentData.status,
      schedulePaymentStatus,
      synced: (reconciled || paymentData.status === 'SUCCESS') && schedulePaymentStatus === 'Paid',
      reconciled,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
