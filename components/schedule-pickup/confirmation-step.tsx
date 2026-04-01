"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, MapPinIcon, ClockIcon, InfoIcon, CheckCircle2 } from "lucide-react";
import { getSubRegionLabel, getCountyForRegion } from "@/lib/constants/regions";

interface ConfirmationStepProps {
  wasteDetails: {
    type: string;
    aiSuggestedType?: string;
    aiConfidence?: number;
    classificationSource?: "manual" | "ai-assisted";
    aiPhotoUsed?: boolean;
  };
  pickupDetails: {
    address: string;
    region: string;
    date: Date | undefined;
    timeSlot: string;
    instructions: string;
  };
  onConfirm: () => void;
  onPrev: () => void;
  loading: boolean;
}

const formatWasteType = (type: string) => {
  switch (type) {
    case "organic": return { label: "Organic Waste", icon: "🍏", color: "text-green-600", bg: "bg-green-50" };
    case "plastic": return { label: "Plastic", icon: "🥤", color: "text-blue-600", bg: "bg-blue-50" };
    case "metal": return { label: "Metal", icon: "🥫", color: "text-gray-600", bg: "bg-gray-50" };
    case "general": return { label: "General Waste", icon: "🗑️", color: "text-orange-600", bg: "bg-orange-50" };
    case "mixed": return { label: "Mixed Recyclables", icon: "♻️", color: "text-teal-600", bg: "bg-teal-50" };
    default: return { label: type, icon: "📦", color: "text-green-600", bg: "bg-green-50" };
  }
};

const formatTimeSlot = (slot: string) => {
  switch (slot) {
    case "morning": return "Morning (9 AM - 12 PM)";
    case "afternoon": return "Afternoon (1 PM - 4 PM)";
    case "evening": return "Evening (5 PM - 8 PM)";
    default: return slot;
  }
};

export default function ConfirmationStep({ wasteDetails, pickupDetails, onConfirm, onPrev, loading }: ConfirmationStepProps) {
  const wasteInfo = formatWasteType(wasteDetails.type);
  const regionLabel = getSubRegionLabel(pickupDetails.region);
  const countyLabel = getCountyForRegion(pickupDetails.region)?.label ?? "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black text-gray-900">Review Your Pickup</h3>
        <p className="text-gray-500">Double check everything is correct before confirming.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Summary Card */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner", wasteInfo.bg)}>
              {wasteInfo.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Waste Type</p>
              <h4 className={cn("text-xl font-black", wasteInfo.color)}>{wasteInfo.label}</h4>
            </div>
          </div>

          {wasteDetails.classificationSource === "ai-assisted" && (
            <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-green-700 uppercase tracking-tighter">AI Verified</p>
              </div>
              <p className="text-xs text-green-800 leading-relaxed">
                Confirmed with <span className="font-bold">{Math.round(wasteDetails.aiConfidence! * 100)}% confidence</span> via {wasteDetails.aiPhotoUsed ? 'camera' : 'upload'}.
              </p>
            </div>
          )}
        </div>

        {/* Pickup Summary Card */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1.5 rounded-lg">
                <CalendarIcon className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled For</p>
                <p className="text-sm font-bold text-gray-900">{pickupDetails.date ? format(pickupDetails.date, "EEEE, MMMM do") : "Not selected"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1.5 rounded-lg">
                <ClockIcon className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time Window</p>
                <p className="text-sm font-bold text-gray-900">{formatTimeSlot(pickupDetails.timeSlot)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1.5 rounded-lg">
                <MapPinIcon className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Region</p>
                <p className="text-sm font-bold text-gray-900">{regionLabel ? `${countyLabel} — ${regionLabel}` : "Not selected"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-1.5 rounded-lg">
                <MapPinIcon className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{pickupDetails.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pickupDetails.instructions && (
        <div className="bg-amber-50/50 border-2 border-amber-100/50 rounded-2xl p-5 flex gap-3">
          <InfoIcon className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Note for Collector</p>
            <p className="text-sm text-amber-800 leading-relaxed font-medium italic">&quot;{pickupDetails.instructions}&quot;</p>
          </div>
        </div>
      )}

      <div className="bg-green-600 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 bg-black/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <p className="font-bold text-lg">Environmental Impact</p>
            </div>
            <p className="text-green-100 text-xs">This pickup will divert approximately 5kg of waste from landfills! 🌱</p>
          </div>
          <div className="text-right border-l border-white/20 pl-4">
            <p className="text-[10px] font-bold text-green-200 uppercase tracking-widest">Pickup Fee</p>
            <p className="text-2xl font-black">$5.00</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onPrev}
          className="w-full sm:w-auto text-gray-400 hover:text-gray-600 font-semibold"
          disabled={loading}
        >
          Edit Details
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 px-12 py-7 rounded-2xl font-black text-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            "Confirm & Pay $5.00"
          )}
        </Button>
      </div>
    </div>
  );
}
