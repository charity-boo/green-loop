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

type WasteDetails = {
  type: string;
  aiSuggestedType?: string;
  aiConfidence?: number;
  classificationSource: "manual" | "ai-assisted";
  aiPhotoUsed?: boolean;
};

type PickupDetails = {
  address: string;
  date: Date | undefined;
  timeSlot: string;
  instructions: string;
};

interface SchedulePickupFormProps {
  userName: string;
}

export default function SchedulePickupForm({ userName }: SchedulePickupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wasteDetails, setWasteDetails] = useState<WasteDetails>({ type: "", classificationSource: "manual", aiPhotoUsed: false });
  const [pickupDetails, setPickupDetails] = useState<PickupDetails>({ address: "", date: undefined, timeSlot: "", instructions: "" });
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pickupId, setPickupId] = useState<string | null>(null);

  const totalSteps = 3;
  const progressValue = (currentStep / totalSteps) * 100;

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
          address: pickupDetails.address,
          pickupDate: pickupDetails.date?.toISOString() ?? null,
          timeSlot: pickupDetails.timeSlot,
          instructions: pickupDetails.instructions,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to schedule pickup');
      }

      const { id } = await response.json();
      setPickupId(id);
      setIsSuccessModalOpen(true);

      setWasteDetails({ type: "", classificationSource: "manual", aiPhotoUsed: false });
      setPickupDetails({ address: "", date: undefined, timeSlot: "", instructions: "" });
      setCurrentStep(1);
    } catch (error) {
      console.error("Error scheduling pickup:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to schedule pickup. Please try again.");
    } finally {
      setLoading(false);
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
          <div className="flex justify-end gap-4 mt-6">
            <Link
              href="/dashboard/user"
              className="px-6 py-2 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Go to Dashboard
            </Link>
            <Button onClick={() => setIsSuccessModalOpen(false)} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl px-6">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
