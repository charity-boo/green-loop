import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const initiatePaymentSchema = z.object({
  wasteId: z.string().min(1, 'Waste ID is required'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return createErrorResponse('Unauthorized: No active session', undefined, 401);
    }

    const userId = session.user.id;

    const body = await req.json();
    const validation = initiatePaymentSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { wasteId } = validation.data;

    // Fetch schedule record
    const scheduleDoc = await adminDb.collection('schedules').doc(wasteId).get();
    if (!scheduleDoc.exists) {
      return createErrorResponse('Schedule record not found', undefined, 404);
    }

    const wasteData = scheduleDoc.data();
    if (!wasteData) {
      return createErrorResponse('Schedule record data is empty', undefined, 404);
    }

    if (wasteData.paymentStatus === 'Paid') {
      return createErrorResponse('This schedule is already paid', undefined, 400);
    }

    if (wasteData.userId !== userId) {
      return createErrorResponse('Unauthorized: Schedule does not belong to user', undefined, 403);
    }

    const price = wasteData.price || 0;
    if (price <= 0) {
      return createErrorResponse('Invalid waste price', undefined, 400);
    }

    // Create a PENDING payment record
    const paymentRef = await adminDb.collection('payments').add({
      userId,
      scheduleId: wasteId,
      amount: price,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const paymentId = paymentRef.id;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Create Stripe Checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: 'Waste Collection Fee',
              description: `Schedule ID: ${wasteId}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&waste_id=${wasteId}`,
      cancel_url: `${appUrl}/dashboard`,
      metadata: {
        paymentId,
        userId,
        wasteId,
      },
    });

    // Store the Stripe session ID
    await adminDb.collection('payments').doc(paymentId).update({
      stripeSessionId: checkoutSession.id,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { status: 'success', url: checkoutSession.url, paymentId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment initiation error:', error instanceof Error ? error.message : String(error));

    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid JSON in request body', undefined, 400);
    }

    return createErrorResponse('Failed to initiate payment. Please try again.', undefined, 500);
  }
}

export async function GET() {
  return createErrorResponse('Method not allowed', undefined, 405);
}

export async function PUT() {
  return createErrorResponse('Method not allowed', undefined, 405);
}

export async function PATCH() {
  return createErrorResponse('Method not allowed', undefined, 405);
}

export async function DELETE() {
  return createErrorResponse('Method not allowed', undefined, 405);
}
