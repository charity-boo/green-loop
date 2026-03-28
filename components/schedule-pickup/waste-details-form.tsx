"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import AIClassificationModal from "./ai-classification-modal"; // Import the new AI modal

interface WasteDetailsFormProps {
  initialWasteDetails: {
    type: string;
    aiSuggestedType?: string;
    aiConfidence?: number;
    classificationSource?: "manual" | "ai-assisted";
    aiPhotoUsed?: boolean;
    disposalTips?: string;
  };
  onSubmit: (details: {
    type: string;
    aiSuggestedType?: string;
    aiConfidence?: number;
    classificationSource: "manual" | "ai-assisted";
    aiPhotoUsed?: boolean;
    disposalTips?: string;
  }) => void;
  onCancel: () => void;
}

const wasteOptions = [
  { value: "organic", label: "Organic", icon: "🍏", description: "Food scraps, yard waste" },
  { value: "plastic", label: "Plastic", icon: "🥤", description: "Bottles, containers" },
  { value: "metal", label: "Metal", icon: "🥫", description: "Cans, foil, scrap" },
  { value: "general", label: "General", icon: "🗑️", description: "Non-recyclable items" },
  { value: "mixed", label: "Mixed", icon: "♻️", description: "Unsorted recyclables" },
];

export default function WasteDetailsForm({ initialWasteDetails, onSubmit, onCancel }: WasteDetailsFormProps) {
  const [selectedWasteType, setSelectedWasteType] = useState(initialWasteDetails.type);
  const [error, setError] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // State for AI classification results
  const [aiSuggestedType, setAiSuggestedType] = useState(initialWasteDetails.aiSuggestedType);
  const [aiConfidence, setAiConfidence] = useState(initialWasteDetails.aiConfidence);
  const [classificationSource, setClassificationSource] = useState<"manual" | "ai-assisted">(
    initialWasteDetails.classificationSource || "manual"
  );
  const [aiPhotoUsed, setAiPhotoUsed] = useState(initialWasteDetails.aiPhotoUsed);
  const [disposalTips, setDisposalTips] = useState(initialWasteDetails.disposalTips);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWasteType) {
      setError("Please select a waste type.");
      return;
    }
    setError(null);
    onSubmit({
      type: selectedWasteType,
      aiSuggestedType,
      aiConfidence,
      classificationSource,
      aiPhotoUsed,
      disposalTips,
    });
  };

  const handleAiAccept = (confirmedType: string, aiType: string, confidence: number, photoUsed: boolean, tips: string) => {
    setSelectedWasteType(confirmedType);
    setAiSuggestedType(aiType);
    setAiConfidence(confidence);
    setClassificationSource("ai-assisted");
    setAiPhotoUsed(photoUsed);
    setDisposalTips(tips);
    setIsAiModalOpen(false);
  };

  const handleAiOverride = () => {
    setAiSuggestedType(undefined);
    setAiConfidence(undefined);
    setClassificationSource("manual");
    setDisposalTips(undefined);
    setIsAiModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Select Waste Type</h3>
            <p className="text-sm text-gray-500">What kind of waste are we picking up today?</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAiModalOpen(true)}
            className="group flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 rounded-full px-4 h-9 text-xs font-semibold"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-green-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <InfoCircledIcon className="relative h-4 w-4" />
            </div>
            Not sure? Use AI to classify
          </Button>
        </div>

        {aiSuggestedType && (
          <div className="bg-green-50/80 backdrop-blur-sm border border-green-100 rounded-2xl p-4 flex items-start gap-3 animate-in zoom-in-95 duration-300">
            <div className="bg-green-500 rounded-full p-1 mt-0.5">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">AI Suggestion Accepted!</p>
              <p className="text-xs text-green-700">
                Classified as <span className="capitalize font-bold">{aiSuggestedType}</span> ({Math.round(aiConfidence! * 100)}% confidence).
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "group relative flex flex-col items-start p-5 border-2 rounded-2xl transition-all duration-300 text-left overflow-hidden",
                selectedWasteType === option.value
                  ? "border-green-500 bg-green-50/50 shadow-lg shadow-green-100 ring-4 ring-green-500/10"
                  : "border-gray-100 bg-white hover:border-green-200 hover:shadow-md"
              )}
              onClick={() => {
                setSelectedWasteType(option.value);
                setClassificationSource("manual");
              }}
            >
              <div className={cn(
                "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full transition-transform duration-500",
                selectedWasteType === option.value ? "bg-green-100/50 scale-110" : "bg-gray-50 group-hover:bg-green-50 group-hover:scale-105"
              )}></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{option.icon}</span>
                  <span className={cn(
                    "font-bold text-lg transition-colors",
                    selectedWasteType === option.value ? "text-green-900" : "text-gray-900 group-hover:text-green-800"
                  )}>{option.label}</span>
                </div>
                <p className="text-sm text-gray-600 leading-snug">
                  {option.description}
                </p>
              </div>

              {selectedWasteType === option.value && (
                <div className="absolute top-4 right-4 bg-green-500 rounded-full p-1 shadow-sm">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm font-medium mt-2 animate-bounce">{error}</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="w-full sm:w-auto text-gray-400 hover:text-gray-600 font-semibold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-600/20 px-10 py-6 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95"
        >
          Next: Pickup Details
        </Button>
      </div>

      <AIClassificationModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAccept={handleAiAccept}
        onOverride={handleAiOverride}
      />
    </form>
  );
}
