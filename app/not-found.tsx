import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <FileQuestion size={32} />
            </div>

            <h1 className="mb-2 text-3xl font-bold text-gray-900">404 - Page Not Found</h1>
            <p className="mb-8 max-w-md text-gray-600">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/">
                    Back to Green Loop Home
                </Link>
            </Button>
        </div>
    );
}
