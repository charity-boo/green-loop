"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  phoneNumber: string;
}

export function OTPInput({ 
  length = 6, 
  onComplete, 
  onResend,
  loading = false, 
  error,
  phoneNumber 
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (value && index === length - 1 && newOtp.every(digit => digit !== '')) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Only process if it's all digits and matches the expected length
    if (/^\d+$/.test(pastedData) && pastedData.length === length) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs.current[length - 1]?.focus();
      
      // Auto-submit
      onComplete(pastedData);
    }
  };

  const handleResend = async () => {
    setOtp(Array(length).fill(''));
    setCanResend(false);
    setResendCooldown(60);
    inputRefs.current[0]?.focus();
    await onResend();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const maskedPhone = phoneNumber.replace(/(\+\d{1,3})\d+(\d{3})/, '$1******$2');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-center block">
          Enter the verification code sent to {maskedPhone}
        </Label>
        
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-14 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              disabled={loading}
            />
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center">
          Code expires in 5 minutes
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || otp.some(digit => !digit)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </div>
        ) : (
          "Verify Code"
        )}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={!canResend || loading}
          className="text-sm text-muted-foreground hover:text-green-600"
        >
          {canResend ? (
            "Resend Code"
          ) : (
            `Resend code in ${resendCooldown}s`
          )}
        </Button>
      </div>
    </form>
  );
}
