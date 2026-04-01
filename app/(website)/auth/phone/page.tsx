"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/features/auth/sms/phone-input";
import { OTPInput } from "@/components/features/auth/sms/otp-input";

export default function PhoneAuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOTP = async (phone: string) => {
    setLoading(true);
    setError(null);
    setPhoneNumber(phone);

    try {
      const response = await fetch('/api/auth/sms/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/sms/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber, 
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      // Sign in with custom token
      await signInWithCustomToken(auth, data.customToken);

      // Redirect based on user role via location for cookie propagation
      if (data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await handleSendOTP(phoneNumber);
  };

  const handleBack = () => {
    setStep('phone');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-800">
            {step === 'phone' ? 'Sign In with Phone' : 'Verify Your Number'}
          </CardTitle>
          <CardDescription>
            {step === 'phone' 
              ? 'Enter your phone number to receive a verification code' 
              : 'Enter the 6-digit code we sent you'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'phone' ? (
            <PhoneInput
              onSubmit={handleSendOTP}
              loading={loading}
              error={error}
            />
          ) : (
            <>
              <button
                onClick={handleBack}
                className="text-sm text-green-600 hover:text-green-700 mb-4 flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Change phone number
              </button>
              <OTPInput
                onComplete={handleVerifyOTP}
                onResend={handleResend}
                loading={loading}
                error={error}
                phoneNumber={phoneNumber}
              />
            </>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          {/* Alternative sign-in options */}
          <div className="text-center space-y-3">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-green-600 hover:text-green-500 block"
            >
              Sign in with email instead
            </Link>
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
                Register now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
