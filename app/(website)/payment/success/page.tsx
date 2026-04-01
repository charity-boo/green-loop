"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const wasteIdFromUrl = searchParams.get("waste_id");
  const [status, setStatus] = useState<"loading" | "success" | "processing" | "error">("loading");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    async function verifyPayment() {
      try {
        const maxAttempts = 20;
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          const response = await fetch(`/api/payment/verify?session_id=${sessionId}`, {
            cache: "no-store",
          });
          if (response.status === 404) {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            continue;
          }
          if (!response.ok) {
            throw new Error("Unable to verify payment");
          }

          const result = await response.json();
          if (result?.synced) {
            setStatus("success");
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        setStatus("processing");
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    }

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 font-outfit">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-none overflow-hidden rounded-[2rem]">
          <div className="h-3 bg-emerald-500 w-full" />
          <CardHeader className="text-center pt-10">
            <div className="flex justify-center mb-6">
              {status === "loading" ? (
                <div className="p-4 bg-emerald-50 rounded-full">
                  <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                </div>
              ) : status === "success" ? (
                <div className="p-4 bg-emerald-100 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600" />
                </div>
              ) : status === "processing" ? (
                <div className="p-4 bg-amber-50 rounded-full">
                  <Loader2 className="w-16 h-16 text-amber-600 animate-spin" />
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-full text-red-600 font-bold text-4xl">
                  !
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              {status === "loading" ? "Confirming..." : status === "success" ? "Payment Success!" : status === "processing" ? "Payment Processing" : "Invalid Session"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-2">
              {status === "loading" 
                ? "We're verifying your transaction with Stripe." 
                : status === "success"
                ? "Your waste pickup has been successfully paid and scheduled."
                : status === "processing"
                ? "Your Stripe payment was received. We're still syncing it. You can go to your dashboard and refresh shortly."
                : "We couldn't validate this payment session. Please try again from your pickup history."}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10 space-y-6">
            {status === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                  <p className="text-emerald-800 text-sm font-bold uppercase tracking-widest mb-1">Status Update</p>
                  <p className="text-emerald-600 text-xs font-medium">
                    Your payment is fully synced. A collector is now being assigned to your request.
                  </p>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl py-7 text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
                disabled={status === "loading"}
              >
                <Link href={wasteIdFromUrl ? `/dashboard?waste_id=${encodeURIComponent(wasteIdFromUrl)}` : "/dashboard"}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Go to Dashboard
                </Link>
              </Button>
              <Button 
                variant="ghost"
                onClick={() => router.push("/schedule-pickup")}
                className="w-full text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-transparent hover:text-emerald-600"
              >
                Schedule Another Pickup
              </Button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest pt-4 border-t border-slate-100">
              Transaction ID: <span className="text-slate-600">{sessionId?.slice(0, 20)}...</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 font-outfit">
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
