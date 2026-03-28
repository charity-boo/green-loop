/**
 * Centralized mapping for Firebase backend statuses to user-friendly labels.
 * Used for displaying AI classification statuses and other Firebase-driven states.
 */
export const FirebaseStatusDisplay: Record<string, string> = {
    CLASSIFIED: "Classified",
    AI_REVIEW: "AI Review",
};

export type FirebaseStatusDisplayType = typeof FirebaseStatusDisplay;

/**
 * Maps Firebase status strings to Tailwind CSS classes for consistent color coding.
 */
export const FirebaseStatusColor: Record<string, string> = {
    CLASSIFIED: "bg-orange-100 text-orange-800",
    AI_REVIEW: "bg-purple-100 text-purple-800",
};

export const DefaultStatusColor = "bg-gray-100 text-gray-800";

