import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { adminDb } from '@/lib/firebase/admin';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

// OTP configuration
const OTP_EXPIRY_MINUTES = 5;

interface RateLimitData {
  attempts: number;
  firstAttempt: number;
}

/**
 * Generate a 6-digit OTP code
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check rate limiting for phone number
 */
async function checkRateLimit(phoneNumber: string): Promise<{ allowed: boolean; remainingAttempts: number }> {
  const rateLimitRef = adminDb.collection('otpRateLimits').doc(phoneNumber);
  const doc = await rateLimitRef.get();
  
  const now = Date.now();
  
  if (!doc.exists) {
    // First attempt
    await rateLimitRef.set({
      attempts: 1,
      firstAttempt: now,
    });
    return { allowed: true, remainingAttempts: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  const data = doc.data() as RateLimitData;
  const windowExpired = now - data.firstAttempt > RATE_LIMIT_WINDOW;
  
  if (windowExpired) {
    // Reset the window
    await rateLimitRef.set({
      attempts: 1,
      firstAttempt: now,
    });
    return { allowed: true, remainingAttempts: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (data.attempts >= MAX_REQUESTS_PER_WINDOW) {
    return { 
      allowed: false, 
      remainingAttempts: 0,
    };
  }
  
  // Increment attempts
  await rateLimitRef.update({
    attempts: data.attempts + 1,
  });
  
  return { 
    allowed: true, 
    remainingAttempts: MAX_REQUESTS_PER_WINDOW - data.attempts - 1 
  };
}

/**
 * Store OTP in Firestore
 */
async function storeOTP(phoneNumber: string, otp: string): Promise<void> {
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  
  await adminDb.collection('otpCodes').doc(phoneNumber).set({
    code: otp,
    phoneNumber,
    expiresAt: expiresAt.toISOString(),
    attempts: 0,
    createdAt: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Validate phone number
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Parse and format phone number
    const parsedNumber = parsePhoneNumber(phoneNumber);
    const formattedNumber = parsedNumber.format('E.164');

    // Check rate limiting
    const rateLimit = await checkRateLimit(formattedNumber);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in Firestore
    await storeOTP(formattedNumber, otp);

    // Send SMS via Twilio
    try {
      await twilioClient.messages.create({
        body: `Your Green Loop verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: formattedNumber,
      });

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        remainingAttempts: rateLimit.remainingAttempts,
        expiresIn: OTP_EXPIRY_MINUTES * 60, // in seconds
      });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      // Clean up stored OTP if SMS fails
      await adminDb.collection('otpCodes').doc(formattedNumber).delete();
      
      return NextResponse.json(
        { error: 'Failed to send SMS. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
