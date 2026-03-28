import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';

interface ResetTokenPayload {
  email: string;
  purpose: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Reset token is required' },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Verify JWT token
    let decoded: ResetTokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
    } catch (error) {
      console.error('Invalid or expired token:', error);
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token has correct purpose
    if (decoded.purpose !== 'password-reset') {
      return NextResponse.json(
        { error: 'Invalid token purpose' },
        { status: 400 }
      );
    }

    const { email } = decoded;

    // Check if token exists in Firestore and is not used
    const tokenDoc = await adminDb.collection('passwordResetTokens').doc(email).get();
    
    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: 'Reset token not found or already used' },
        { status: 400 }
      );
    }

    const tokenData = tokenDoc.data();
    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid token data' },
        { status: 400 }
      );
    }

    if (tokenData.used) {
      return NextResponse.json(
        { error: 'This reset link has already been used' },
        { status: 400 }
      );
    }

    if (tokenData.token !== token) {
      return NextResponse.json(
        { error: 'Token mismatch' },
        { status: 400 }
      );
    }

    // Check if token is expired
    const expiresAt = tokenData.expiresAt.toDate();
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Get user from Firebase Auth
    const user = await adminAuth.getUserByEmail(email);

    // Update password in Firebase Auth
    await adminAuth.updateUser(user.uid, {
      password: newPassword,
    });

    // Mark token as used
    await adminDb.collection('passwordResetTokens').doc(email).update({
      used: true,
      usedAt: new Date(),
    });

    console.log('Password successfully reset for:', email);

    return NextResponse.json(
      { message: 'Password successfully reset. You can now login with your new password.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset-password API:', error);
    return NextResponse.json(
      { error: 'An error occurred while resetting your password. Please try again later.' },
      { status: 500 }
    );
  }
}
