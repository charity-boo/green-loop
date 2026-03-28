import React from 'react';
import { FirebaseStatusDisplay } from '@/types/firebase-status-display';

interface FirebaseStatusBadgeProps {
    status: string; // The backend status string (e.g., 'CLASSIFIED', 'AI_REVIEW')
    className?: string;
}

/**
 * A reusable badge component for displaying Firebase statuses with user-friendly labels.
 */
export const FirebaseStatusBadge: React.FC<FirebaseStatusBadgeProps> = ({ status, className }) => {
    const label = FirebaseStatusDisplay[status] || status; // Fallback to raw status if not found

    const getVariant = (status: string) => {
        switch (status) {
            case 'CLASSIFIED':
                return 'bg-blue-100 text-blue-800';
            case 'AI_REVIEW':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVariant(status)} ${className}`}>
            {label}
        </span>
    );
};
