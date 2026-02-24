import { createErrorResponse } from './api-response';

/**
 * A centralized error handler for API routes.
 * Takes an error and returns a standardized NextResponse.
 * 
 * It handles:
 * - Specific authorization errors ("Unauthorized", "Forbidden")
 * - Generic errors (500)
 */
export function handleApiError(error: unknown, context: string) {
    console.error(`${context} error:`, error);

    const message = error instanceof Error ? error.message : 'An unknown error occurred';

    if (message === 'Unauthorized') {
        return createErrorResponse('You must be logged in to access this resource', undefined, 401);
    }

    if (message === 'Forbidden') {
        return createErrorResponse('You do not have permission to access this resource', undefined, 403);
    }

    // Default to 500 for everything else
    return createErrorResponse('Internal server error', undefined, 500);
}
