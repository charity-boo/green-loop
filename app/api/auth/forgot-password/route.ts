import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { sendEmail } from '@/lib/email';
import { generatePasswordResetEmail } from '@/lib/email-templates';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';
const RESET_TOKEN_EXPIRY = '1h'; // 1 hour
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if user exists in Firebase Auth
    let userExists = false;
    try {
      await adminAuth.getUserByEmail(email);
      userExists = true;
    } catch (_error: unknown) {
      // User not found - but we don't want to reveal this to prevent email enumeration
      console.log('User not found:', email);
    }

    // Always send success response to prevent email enumeration
    // But only send email if user exists
    if (userExists) {
      // Generate reset token
      const resetToken = jwt.sign(
        { email, purpose: 'password-reset' },
        JWT_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRY }
      );

      // Store token in Firestore with expiry
      await adminDb.collection('passwordResetTokens').doc(email).set({
        token: resetToken,
        email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        used: false,
      });

      // Generate reset link
      const resetLink = `${APP_URL}/auth/reset-password?token=${resetToken}`;

      // Generate email content
      const emailContent = generatePasswordResetEmail({
        email,
        resetLink,
        expiresIn: '1 hour',
      });

      // Send email
      await sendEmail({
        to: email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });

      console.log('Password reset email sent to:', email);
    }

    // Always return success to prevent email enumeration
    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive password reset instructions.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot-password API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again later.' },
      { status: 500 }
    );
  }
}
