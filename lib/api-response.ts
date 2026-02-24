import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ErrorResponse = {
    status: 'error';
    message: string;
    errors?: string[];
};

/**
 * Creates a standardized error response.
 * 
 * @param message - The main error message.
 * @param errors - An optional array of specific error details.
 * @param statusCode - The HTTP status code (default: 400).
 * @returns A NextResponse object with the standardized error format.
 */
export function createErrorResponse(
    message: string,
    errors?: string[],
    statusCode: number = 400
) {
    return NextResponse.json(
        {
            status: 'error',
            message: message,
            errors: errors,
        },
        { status: statusCode }
    );
}

/**
 * Creates a standardized error response from a ZodError.
 * 
 * @param error - The Zod validation error.
 * @param message - The main error message (default: "Invalid request").
 * @returns A NextResponse object with the standardized error format.
 */
export function createValidationErrorResponse(
    error: ZodError,
    message: string = 'Invalid request'
) {
    const issues = error.issues.map((issue) => issue.message);
    return createErrorResponse(message, issues, 400);
}
