import { NextRequest, NextResponse } from 'next/server';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { Role } from '@/types/firestore';

const MAX_VERIFICATION_ATTEMPTS = 5;

interface OTPData {
  code: string;
  phoneNumber: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, code, name, role = 'USER' } = body;

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

    // OTP is valid - Check if user exists
    let userRecord;
    try {
      // Try to find user by phone number
      const usersSnapshot = await adminDb.collection('users')
        .where('phoneNumber', '==', formattedNumber)
        .limit(1)
        .get();

      if (!usersSnapshot.empty) {
        // User exists - sign them in
        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();
        
        // Get Firebase Auth user
        userRecord = await adminAuth.getUser(userDoc.id);
        
        // Generate custom token for sign-in
        const customToken = await adminAuth.createCustomToken(userRecord.uid, {
          role: userData.role,
        });

        // Clean up OTP
        await otpRef.delete();

        return NextResponse.json({
          success: true,
          customToken,
          user: {
            id: userRecord.uid,
            email: userRecord.email,
            phoneNumber: userRecord.phoneNumber,
            name: userRecord.displayName || userData.name,
            role: userData.role,
          },
        });
      } else {
        // User doesn't exist - create new user
        if (!name) {
          return NextResponse.json(
            { error: 'Name is required for new users' },
            { status: 400 }
          );
        }

        // Create Firebase Auth user with phone number
        userRecord = await adminAuth.createUser({
          phoneNumber: formattedNumber,
          displayName: name,
        });

        // Set custom claims
        await adminAuth.setCustomUserClaims(userRecord.uid, { 
          role: role.toUpperCase() as Role 
        });

        // Create user document in Firestore
        const userDoc = {
          id: userRecord.uid,
          name,
          email: '',
          phoneNumber: formattedNumber,
          role: role.toUpperCase() as Role,
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await adminDb.collection('users').doc(userRecord.uid).set(userDoc);

        // Generate custom token for sign-in
        const customToken = await adminAuth.createCustomToken(userRecord.uid, {
          role: role.toUpperCase(),
        });

        // Clean up OTP
        await otpRef.delete();

        return NextResponse.json({
          success: true,
          customToken,
          user: {
            id: userRecord.uid,
            phoneNumber: formattedNumber,
            name,
            role: role.toUpperCase(),
          },
          isNewUser: true,
        });
      }
    } catch (authError) {
      console.error('Firebase Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
