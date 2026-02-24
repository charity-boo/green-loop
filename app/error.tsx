'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Application Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle size={32} />
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="mb-8 max-w-md text-gray-600">
                Our system encountered an unexpected error. We&apos;ve been notified and are looking into it.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                    onClick={() => reset()}
                    className="bg-green-600 hover:bg-green-700"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try again
                </Button>
                <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                >
                    Return Home
                </Button>
            </div>

            <div className="mt-12 text-xs text-gray-400">
                Error Digest: {error.digest || 'no-digest'}
            </div>
        </div>
    );
}
