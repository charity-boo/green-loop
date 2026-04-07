"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import WasteDetailsForm from "@/components/schedule-pickup/waste-details-form";
import PickupDetailsForm from "@/components/schedule-pickup/pickup-details-form";
import ConfirmationStep from "@/components/schedule-pickup/confirmation-step";
import Link from "next/link";
import { Loader2, CreditCard, CalendarClock, ArrowRight } from "lucide-react";

type WasteDetails = {
  type: string;
  aiSuggestedType?: string;
  aiConfidence?: number;
  classificationSource: "manual" | "ai-assisted";
  aiPhotoUsed?: boolean;
  disposalTips?: string;
  imageUrl?: string;
};

type PickupDetails = {
  address: string;
  region: string;
  county?: string;
  placeId?: string | null;
  locationSource?: 'manual' | 'gps' | 'google_autocomplete';
  date: Date | undefined;
  timeSlot: string;
  instructions: string;
  latitude?: number;
  longitude?: number;
};

interface SchedulePickupFormProps {
  userName: string;
  hasActivePickup?: boolean;
}

export default function SchedulePickupForm({ userName: _userName, hasActivePickup }: SchedulePickupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wasteDetails, setWasteDetails] = useState<WasteDetails>({ type: "", classificationSource: "manual", aiPhotoUsed: false });
  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({
    address: "",
    region: "",
    county: undefined,
    placeId: null,
    locationSource: 'manual',
    date: undefined,
    timeSlot: "",
    instructions: "",
    latitude: undefined,
    longitude: undefined
  });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pickupId, setPickupId] = useState<string | null>(null);

  const totalSteps = 3;
  const progressValue = (currentStep / totalSteps) * 100;

  if (hasActivePickup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-green-50 p-4">
        <Card className="w-full max-w-lg shadow-2xl border-t-4 border-t-green-600">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CalendarClock className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Pickup Already Scheduled</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              You already have an active pickup in progress. To keep our service efficient, we only allow one active pickup at a time per user.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 items-start">
              <div className="bg-amber-100 p-1.5 rounded-full mt-0.5">
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </div>
              <p className="text-sm text-amber-800">
                You can schedule a new pickup once your current one is completed, cancelled, or skipped.
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/dashboard"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl py-4 text-center shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
              >
                View Current Pickup in Dashboard
              </Link>
              <Link 
                href="/dashboard/active"
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl py-4 text-center border transition-all"
              >
                Track Active Pickup
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => prev - 1);
  };

  const handleWasteDetailsSubmit = (details: WasteDetails) => {
    setWasteDetails(details);
    handleNext();
  };

  const handlePickupDetailsSubmit = (details: PickupDetails) => {
    setPickupDetails(details);
    handleNext();
  };

  const handleConfirmPickup = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/schedule-pickup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wasteType: wasteDetails.type,
          aiSuggestedType: wasteDetails.aiSuggestedType ?? null,
          aiConfidence: wasteDetails.aiConfidence ?? null,
          classificationSource: wasteDetails.classificationSource,
          aiPhotoUsed: wasteDetails.aiPhotoUsed ?? false,
          aiWasteType: wasteDetails.aiSuggestedType ?? null,
          disposalTips: wasteDetails.disposalTips ?? null,
          imageUrl: wasteDetails.imageUrl ?? null,
          classificationStatus: wasteDetails.aiSuggestedType ? 'classified' : 'none',
          address: pickupDetails.address,
          region: pickupDetails.region,
          county: pickupDetails.county ?? null,
          placeId: pickupDetails.placeId ?? null,
          locationSource: pickupDetails.locationSource ?? 'manual',
          pickupDate: pickupDetails.date?.toISOString() ?? null,
          timeSlot: pickupDetails.timeSlot,
          instructions: pickupDetails.instructions,
          latitude: pickupDetails.latitude ?? null,
          longitude: pickupDetails.longitude ?? null,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || err.message || 'Failed to schedule pickup');
      }

      const { id } = await response.json();
      setPickupId(id);

      // Automatically initiate payment redirect
      try {
        setIsRedirecting(true);
        const payResponse = await fetch('/api/payment/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wasteId: id }),
        });

        if (payResponse.ok) {
          const payData = await payResponse.json();
          if (payData.url) {
            window.location.href = payData.url;
            return; // Exit here as we are redirecting
          }
        }
      } catch (payError) {
        console.error("Failed to initiate payment automatically:", payError);
      } finally {
        setIsRedirecting(false);
      }

      setIsSuccessModalOpen(true);

      setWasteDetails({ type: "", classificationSource: "manual", aiPhotoUsed: false, disposalTips: undefined, imageUrl: undefined });
      setPickupDetails({
        address: "",
        region: "",
        county: undefined,
        placeId: null,
        locationSource: 'manual',
        date: undefined,
        timeSlot: "",
        instructions: "",
      });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to schedule pickup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInitiatePayment = async () => {
    if (!pickupId) return;

    try {
      setIsRedirecting(true);
      const payResponse = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wasteId: pickupId }),
      });

      if (payResponse.ok) {
        const payData = await payResponse.json();
        if (payData.url) {
          window.location.href = payData.url;
          return;
        }
      }
      throw new Error("Failed to get payment URL");
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setErrorMessage("Could not initiate payment. Please try from your dashboard.");
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-3xl font-bold text-green-800">Schedule Waste Pickup</CardTitle>
            <div className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-100 px-3 py-1 rounded-full">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <CardDescription className="text-gray-600">
            Join thousands of others making the planet greener, one pickup at a time! 🌍
          </CardDescription>

          <div className="mt-8 relative">
            <Progress value={progressValue} className="w-full h-1.5 bg-gray-100" />
            <div className="absolute -top-3 w-full flex justify-between px-0">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                    currentStep >= step
                      ? "bg-green-600 border-green-600 text-white shadow-md"
                      : "bg-white border-gray-200 text-gray-400"
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[10px] items-center font-bold uppercase tracking-widest text-gray-500 mt-6 px-1">
            <span className={cn(currentStep >= 1 ? "text-green-700" : "")}>Waste Type</span>
            <span className={cn(currentStep >= 2 ? "text-green-700" : "")}>Pickup Info</span>
            <span className={cn(currentStep >= 3 ? "text-green-700" : "")}>Review</span>
          </div>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {currentStep === 1 && (
            <WasteDetailsForm
              initialWasteDetails={wasteDetails}
              onSubmit={handleWasteDetailsSubmit}
              onCancel={() => { /* navigate away if needed */ }}
            />
          )}
          {currentStep === 2 && (
            <PickupDetailsForm
              initialPickupDetails={pickupDetails}
              onSubmit={handlePickupDetailsSubmit}
              onPrev={handlePrev}
            />
          )}
          {currentStep === 3 && (
            <ConfirmationStep
              wasteDetails={wasteDetails}
              pickupDetails={pickupDetails}
              onConfirm={handleConfirmPickup}
              onPrev={handlePrev}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-green-600">Pickup Scheduled Successfully!</DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground">
                <p>Your waste pickup has been successfully scheduled.</p>
                {pickupId && (
                  <p className="mt-2 text-gray-600">
                    Your pickup ID is: <span className="font-semibold text-gray-900">{pickupId}</span>
                  </p>
                )}
                <p className="mt-2">Thank you for contributing to a greener planet!</p>
                <div className="mt-4 text-center text-sm text-gray-500 font-medium">
                  You&apos;re helping reduce landfill waste.
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={handleInitiatePayment} 
              disabled={isRedirecting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl py-6 text-lg shadow-lg shadow-green-200"
            >
              {isRedirecting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-5 w-5" />
              )}
              {isRedirecting ? "Redirecting to Stripe..." : "Pay Now ($5.00)"}
            </Button>
            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-2 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition text-center"
              >
                Go to Dashboard
              </Link>
              <Button 
                variant="ghost"
                onClick={() => setIsSuccessModalOpen(false)} 
                className="flex-1 text-gray-400 font-bold rounded-xl px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
