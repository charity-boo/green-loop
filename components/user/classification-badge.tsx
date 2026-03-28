"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { ClassificationStatus } from "@/types";

interface ClassificationBadgeProps {
  scheduleId: string;
  aiWasteType?: string | null;
  disposalTips?: string | null;
  classificationStatus?: ClassificationStatus;
  /** If true, show Re-classify button when status is failed/none */
  canReclassify?: boolean;
  onReclassify?: (scheduleId: string) => void;
  reclassifying?: boolean;
}

const typeColorMap: Record<string, string> = {
  organic: "bg-lime-50 text-lime-700 border-lime-200",
  food: "bg-lime-50 text-lime-700 border-lime-200",
  plastic: "bg-blue-50 text-blue-700 border-blue-200",
  recyclable: "bg-blue-50 text-blue-700 border-blue-200",
  hazardous: "bg-red-50 text-red-700 border-red-200",
  chemical: "bg-red-50 text-red-700 border-red-200",
  electronic: "bg-purple-50 text-purple-700 border-purple-200",
  metal: "bg-slate-50 text-slate-700 border-slate-200",
  glass: "bg-cyan-50 text-cyan-700 border-cyan-200",
  paper: "bg-sky-50 text-sky-700 border-sky-200",
};

function getBadgeColor(wasteType: string): string {
  const lower = wasteType.toLowerCase();
  for (const [keyword, className] of Object.entries(typeColorMap)) {
    if (lower.includes(keyword)) return className;
  }
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

export default function ClassificationBadge({
  scheduleId,
  aiWasteType,
  disposalTips,
  classificationStatus,
  canReclassify = false,
  onReclassify,
  reclassifying = false,
}: ClassificationBadgeProps) {
  const [tipsOpen, setTipsOpen] = useState(false);

  if (reclassifying || classificationStatus === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 animate-pulse">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Classifying…
      </span>
    );
  }

  if (aiWasteType && classificationStatus === "classified") {
    return (
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => disposalTips && setTipsOpen((v) => !v)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(aiWasteType)} ${disposalTips ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
        >
          <Sparkles className="h-3 w-3" />
          {aiWasteType}
          {disposalTips && (tipsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
        </button>
        {tipsOpen && disposalTips && (
          <p className="text-xs text-slate-500 leading-relaxed mt-1 pl-1 max-w-xs">{disposalTips}</p>
        )}
      </div>
    );
  }

  if (canReclassify && classificationStatus === "failed") {
    return (
      <button
        type="button"
        onClick={() => onReclassify?.(scheduleId)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-colors"
      >
        <RefreshCw className="h-3 w-3" />
        Retry classification
      </button>
    );
  }

  if (canReclassify && (!classificationStatus || classificationStatus === "none")) {
    return (
      <button
        type="button"
        onClick={() => onReclassify?.(scheduleId)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
      >
        <Sparkles className="h-3 w-3" />
        Classify with AI
      </button>
    );
  }

  return null;
}
