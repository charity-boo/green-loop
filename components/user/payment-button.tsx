"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentButtonProps {
  wasteId: string;
  amount: number;
}

export default function PaymentButton({ wasteId, amount }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wasteId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Payment failed. Try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        size="sm"
        onClick={handlePay}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-200 rounded-xl gap-1.5 px-3"
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CreditCard className="h-3.5 w-3.5" />
        )}
        {loading ? "Processing…" : `Pay $${amount.toFixed(2)}`}
      </Button>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
