import { WasteStatus } from "./waste-status";

/**
 * Centralized mapping from backend WasteStatus enums to user-friendly titles.
 */
export const WasteStatusDisplay: Record<WasteStatus, string> = {
    [WasteStatus.Pending]: "Pending",
    [WasteStatus.Active]: "Active",
    [WasteStatus.Collected]: "Collected",
    [WasteStatus.Completed]: "Completed",
    [WasteStatus.Skipped]: "Skipped",
};

/**
 * Maps WasteStatus to Tailwind CSS classes for consistent color coding.
 */
export const WasteStatusColor: Record<WasteStatus, string> = {
    [WasteStatus.Pending]: "bg-yellow-100 text-yellow-800",
    [WasteStatus.Active]: "bg-blue-100 text-blue-800",
    [WasteStatus.Collected]: "bg-green-100 text-green-800",
    [WasteStatus.Completed]: "bg-blue-100 text-blue-800",
    [WasteStatus.Skipped]: "bg-red-100 text-red-800",
};

