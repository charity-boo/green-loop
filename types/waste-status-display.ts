import { WasteStatus } from "./waste-status";

/**
 * Centralized mapping from backend WasteStatus enums to user-friendly titles.
 */
export const WasteStatusDisplay: Record<WasteStatus, string> = {
    [WasteStatus.Pending]: "Pending",
    [WasteStatus.Active]: "Active",
    [WasteStatus.Completed]: "Completed",
    [WasteStatus.Skipped]: "Skipped",
    [WasteStatus.Cancelled]: "Cancelled",
    [WasteStatus.Missed]: "Missed",
};

/**
 * Maps WasteStatus to Tailwind CSS classes for consistent color coding.
 */
export const WasteStatusColor: Record<WasteStatus, string> = {
    [WasteStatus.Pending]: "bg-yellow-100 text-yellow-800",
    [WasteStatus.Active]: "bg-blue-100 text-blue-800",
    [WasteStatus.Completed]: "bg-blue-100 text-blue-800",
    [WasteStatus.Skipped]: "bg-red-100 text-red-800",
    [WasteStatus.Cancelled]: "bg-red-100 text-red-800",
    [WasteStatus.Missed]: "bg-slate-100 text-slate-700",
};
