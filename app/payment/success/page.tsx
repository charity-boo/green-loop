"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="text-muted-foreground max-w-md">
        Your payment has been processed successfully. Thank you for using Green Loop.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
