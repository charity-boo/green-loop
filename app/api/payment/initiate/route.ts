import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { z } from 'zod';

const initiatePaymentSchema = z.object({
  wasteId: z.string().min(1, 'Waste ID is required'),
});

type InitiatePaymentRequest = z.infer<typeof initiatePaymentSchema>;

/**
 * Generate Daraja access token
 */
async function getDarajaAccessToken(): Promise<string> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const darajaUrl = process.env.DARAJA_AUTH_URL || 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  if (!consumerKey || !consumerSecret) {
    throw new Error('Daraja credentials not configured');
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch(darajaUrl, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Daraja access token');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Initiate STK push via Daraja API
 */
async function initiateSTKPush(
  accessToken: string,
  phoneNumber: string,
  amount: number,
  paymentId: string
): Promise<{ checkoutRequestID: string; responseCode: string }> {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  const stkUrl = process.env.DARAJA_STK_URL || 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  if (!shortcode || !passkey || !callbackUrl) {
    throw new Error('M-Pesa configuration incomplete');
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: paymentId,
    TransactionDesc: 'Waste payment',
  };

  const response = await fetch(stkUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to initiate STK push');
  }

  const data = await response.json();

  if (data.ResponseCode !== '0') {
    throw new Error(`STK push failed: ${data.ResponseDescription}`);
  }

  return {
    checkoutRequestID: data.CheckoutRequestID,
    responseCode: data.ResponseCode,
  };
}

export async function POST(req: Request) {
  try {
    // Authentication check
    const session = await getSession();
    if (!session) {
      return createErrorResponse('Unauthorized: No active session', undefined, 401);
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body = await req.json();
    const validation = initiatePaymentSchema.safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { wasteId } = validation.data as InitiatePaymentRequest;

    // Fetch user with phone number
    const userDoc = await adminDb.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return createErrorResponse('User not found', undefined, 400);
    }

    const userData = userDoc.data();

    if (!userData) {
      return createErrorResponse('User data is empty', undefined, 400);
    }

    if (!userData.phone) {
      return createErrorResponse(
        'User phone number not configured. Please update your profile.',
        undefined,
        400
      );
    }

    // Fetch waste record with price
    const wasteDoc = await adminDb.collection('waste').doc(wasteId).get();

    if (!wasteDoc.exists) {
      return createErrorResponse('Waste record not found', undefined, 404);
    }

    const wasteData = wasteDoc.data();

    if (!wasteData) {
      return createErrorResponse('Waste record data is empty', undefined, 404);
    }

    // Verify ownership
    if (wasteData.userId !== userId) {
      return createErrorResponse('Unauthorized: Waste does not belong to user', undefined, 403);
    }

    // Validate price
    const price = wasteData.price || 0;
    if (price <= 0) {
      return createErrorResponse('Invalid waste price', undefined, 400);
    }

    // Create payment record with PENDING status
    const paymentRef = await adminDb.collection('payments').add({
      userId,
      wasteId,
      amount: price,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const paymentId = paymentRef.id;

    // Get Daraja access token
    const accessToken = await getDarajaAccessToken();

    // Initiate STK push
    const stkResponse = await initiateSTKPush(accessToken, userData.phone, price, paymentId);

    // Update payment with transaction ID
    await adminDb.collection('payments').doc(paymentId).update({
      transactionId: stkResponse.checkoutRequestID,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'STK push initiated successfully',
        paymentId: paymentId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payment initiation error:', error instanceof Error ? error.message : String(error));

    if (error instanceof SyntaxError) {
      return createErrorResponse('Invalid JSON in request body', undefined, 400);
    }

    return createErrorResponse(
      'Failed to initiate payment. Please try again.',
      undefined,
      500
    );
  }
}

// Reject non-POST methods
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
