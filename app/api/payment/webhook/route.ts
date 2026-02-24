import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { Payment } from '@/types';

// Daraja callback payload schema
const darajaCallbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(
            z.object({
              Name: z.string(),
              Value: z.union([z.string(), z.number()]),
            })
          ),
        })
        .optional(),
    }),
  }),
});

type DarajaCallback = z.infer<typeof darajaCallbackSchema>;

/**
 * Validate Daraja signature (if provided in headers)
 * This is a placeholder for actual signature validation logic
 */
function validateDarajaSignature(
  payload: string,
  signature: string | null
): boolean {
  // If no signature in env, skip validation
  const signingKey = process.env.DARAJA_SIGNING_KEY;
  if (!signingKey || !signature) {
    // In production, you should validate the signature
    // For now, we'll accept requests, but log that validation was skipped
    return true;
  }

  // Implement actual HMAC validation if signing key is provided
  // This is a placeholder implementation
  return true;
}

/**
 * Extract callback metadata from Daraja response
 */
function extractCallbackMetadata(
  callbackMetadata: DarajaCallback['Body']['stkCallback']['CallbackMetadata']
): {
  amount: number;
  phoneNumber: string;
  mpesaReceiptNumber: string;
  transactionDate: string;
} {
  const metadata = {
    amount: 0,
    phoneNumber: '',
    mpesaReceiptNumber: '',
    transactionDate: '',
  };

  if (!callbackMetadata?.Item) {
    return metadata;
  }

  callbackMetadata.Item.forEach((item) => {
    switch (item.Name) {
      case 'Amount':
        metadata.amount = Number(item.Value);
        break;
      case 'PhoneNumber':
        metadata.phoneNumber = String(item.Value);
        break;
      case 'MpesaReceiptNumber':
        metadata.mpesaReceiptNumber = String(item.Value);
        break;
      case 'TransactionDate':
        metadata.transactionDate = String(item.Value);
        break;
    }
  });

  return metadata;
}

/**
 * Verify callback amount and phone against DB record
 */
async function verifyPaymentDetails(
  paymentId: string,
  callbackAmount: number,
  callbackPhone: string
): Promise<{
  valid: boolean;
  payment?: Payment;
  error?: string;
}> {
  const paymentDoc = await adminDb.collection('payments').doc(paymentId).get();

  if (!paymentDoc.exists) {
    return { valid: false, error: 'Payment record not found' };
  }

  const paymentData = paymentDoc.data();
  const payment: Payment = { id: paymentId, ...paymentData } as Payment;
  const userDoc = await adminDb.collection('users').doc(payment?.userId).get();
  const userData = userDoc.data();

  if (!paymentData) {
    return { valid: false, error: 'Payment data is empty' };
  }

  // Verify amount matches
  if (Math.abs(payment.amount - callbackAmount) > 0.01) {
    return {
      valid: false,
      error: `Amount mismatch: expected ${payment.amount}, got ${callbackAmount}`,
      payment,
    };
  }

  // Verify phone number matches
  const normalizedCallbackPhone = String(callbackPhone).replace(/\D/g, '').slice(-9);
  const normalizedDbPhone = String(userData?.phone || '').replace(/\D/g, '').slice(-9);

  if (normalizedCallbackPhone !== normalizedDbPhone) {
    return {
      valid: false,
      error: `Phone mismatch: expected ${userData?.phone}, got ${callbackPhone}`,
      payment,
    };
  }

  return { valid: true, payment };
}

/**
 * Daraja STK push callback webhook
 */
export async function POST(req: Request) {
  try {
    // Validate Daraja signature (if provided)
    const signature = req.headers.get('X-Daraja-Signature');
    const rawBody = await req.text();

    if (!validateDarajaSignature(rawBody, signature)) {
      console.warn('Daraja signature validation failed');
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: 'Invalid signature',
        },
        { status: 400 }
      );
    }

    // Parse JSON body
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch (_error) {
      console.error('Failed to parse JSON payload');
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: 'Invalid JSON payload',
        },
        { status: 400 }
      );
    }

    // Validate against schema
    const validation = darajaCallbackSchema.safeParse(body);
    if (!validation.success) {
      console.error('Callback schema validation failed', validation.error.errors);
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: 'Invalid callback structure',
        },
        { status: 400 }
      );
    }

    const callback = validation.data.Body.stkCallback;
    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
    } = callback;

    // Extract metadata
    const metadata = extractCallbackMetadata(callback.CallbackMetadata);

    // Use CheckoutRequestID or AccountReference as payment ID
    // Daraja sends CheckoutRequestID, which we stored as transactionId
    const paymentsSnapshot = await adminDb.collection('payments')
      .where('transactionId', '==', CheckoutRequestID)
      .limit(1)
      .get();

    if (paymentsSnapshot.empty) {
      console.warn(`Payment not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json(
        {
          ResultCode: 1,
          ResultDesc: 'Payment record not found',
        },
        { status: 400 }
      );
    }

    const paymentDoc = paymentsSnapshot.docs[0];
    const payment = { id: paymentDoc.id, ...paymentDoc.data() } as Payment;

    // Check idempotency: don't overwrite if already SUCCESS
    if (payment.status === 'SUCCESS' && ResultCode === 0) {
      console.info(`Idempotent callback for payment ${payment.id}, already SUCCESS`);
      return NextResponse.json(
        {
          ResultCode: 0,
          ResultDesc: 'Accepted',
        },
        { status: 200 }
      );
    }

    // Process successful transaction (ResultCode === 0)
    if (ResultCode === 0) {
      // Verify amount and phone match DB record
      const verification = await verifyPaymentDetails(
        payment.id,
        metadata.amount,
        metadata.phoneNumber
      );

      if (!verification.valid) {
        console.error(`Payment verification failed: ${verification.error}`);
        // Update to FAILED due to mismatch
        await adminDb.collection('payments').doc(payment.id).update({
          status: 'FAILED',
          updatedAt: new Date().toISOString()
        });

        return NextResponse.json(
          {
            ResultCode: 1,
            ResultDesc: 'Payment verification failed',
          },
          { status: 400 }
        );
      }

      // Update Payment to SUCCESS with metadata
      await adminDb.collection('payments').doc(payment.id).update({
        status: 'SUCCESS',
        transactionId: metadata.mpesaReceiptNumber || CheckoutRequestID,
        updatedAt: new Date().toISOString()
      });

      console.info(`Payment ${payment.id} marked SUCCESS`);

      return NextResponse.json(
        {
          ResultCode: 0,
          ResultDesc: 'Accepted',
        },
        { status: 200 }
      );
    }

    // Process failed transaction (ResultCode !== 0)
    await adminDb.collection('payments').doc(payment.id).update({
      status: 'FAILED',
      updatedAt: new Date().toISOString()
    });

    console.info(`Payment ${payment.id} marked FAILED: ${ResultDesc}`);

    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: 'Accepted',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      'Webhook processing error:',
      error instanceof Error ? error.message : String(error)
    );

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Reject non-POST methods
export async function GET() {
  return NextResponse.json(
    {
      ResultCode: 1,
      ResultDesc: 'Method not allowed',
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      ResultCode: 1,
      ResultDesc: 'Method not allowed',
    },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    {
      ResultCode: 1,
      ResultDesc: 'Method not allowed',
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      ResultCode: 1,
      ResultDesc: 'Method not allowed',
    },
    { status: 405 }
  );
}
