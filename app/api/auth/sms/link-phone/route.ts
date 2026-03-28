import { NextRequest, NextResponse } from 'next/server';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';

interface OTPData {
  code: string;
  phoneNumber: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
}

const MAX_VERIFICATION_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { phoneNumber, code } = body;

    // Validate input
    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and code are required' },
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

    // Retrieve OTP data from Firestore
    const otpRef = adminDb.collection('otpCodes').doc(formattedNumber);
    const otpDoc = await otpRef.get();

    if (!otpDoc.exists) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    const otpData = otpDoc.data() as OTPData;

    // Check if OTP has expired
    if (new Date(otpData.expiresAt) < new Date()) {
      await otpRef.delete();
      return NextResponse.json(
        { error: 'Verification code has expired' },
        { status: 400 }
      );
    }

    // Check verification attempts
    if (otpData.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await otpRef.delete();
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Verify OTP code
    if (otpData.code !== code) {
      // Increment attempts
      await otpRef.update({
        attempts: otpData.attempts + 1,
      });

      const remainingAttempts = MAX_VERIFICATION_ATTEMPTS - otpData.attempts - 1;
      return NextResponse.json(
        { 
          error: 'Invalid verification code',
          remainingAttempts,
        },
        { status: 400 }
      );
    }

    // OTP is valid - Check if phone number is already linked to another account
    const existingUserSnapshot = await adminDb.collection('users')
      .where('phoneNumber', '==', formattedNumber)
      .limit(1)
      .get();

    if (!existingUserSnapshot.empty) {
      const existingUser = existingUserSnapshot.docs[0];
      if (existingUser.id !== session.user.id) {
        return NextResponse.json(
          { error: 'This phone number is already linked to another account' },
          { status: 400 }
        );
      }
    }

    // Link phone number to user's Firebase Auth account
    try {
      await adminAuth.updateUser(session.user.id, {
        phoneNumber: formattedNumber,
      });

      // Update user document in Firestore
      await adminDb.collection('users').doc(session.user.id).update({
        phoneNumber: formattedNumber,
        updatedAt: new Date().toISOString(),
      });

      // Clean up OTP
      await otpRef.delete();

      return NextResponse.json({
        success: true,
        message: 'Phone number linked successfully',
        phoneNumber: formattedNumber,
      });
    } catch (authError) {
      console.error('Firebase Auth error:', authError);
      return NextResponse.json(
        { error: 'Failed to link phone number. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in link-phone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
