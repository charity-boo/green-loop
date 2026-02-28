/**
 * Governance constants for system anomaly detection and policy enforcement.
 * Policy must not be embedded in UI logic; it belongs in a dedicated policy layer.
 */
export const GOVERNANCE_LIMITS = {
    /** Maximum allowed schedule status overrides in a 7-day window before triggering a warning */
    overrides7d: 10,
    /** Maximum number of active collectors with poor performance before triggering a system warning */
    underReviewCount: 3,

    /** Criteria for a collector to be considered "Under Review" */
    underReviewCriteria: {
        minAssigned: 5,
        maxCompletionRate: 70,
    },

    /** Minimum length for mandatory reason logging */
    minReasonLength: 10,
};
