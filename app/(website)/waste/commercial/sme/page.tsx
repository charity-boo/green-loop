import Link from 'next/link';
import { AuthCTA } from '@/components/features/auth/auth-cta';


export default function SmeWastePage() {
  const currentPath = '/waste/commercial/sme'; // The path to redirect to

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        🏢 Waste Management for Small & Medium Enterprises
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        Flexible and affordable recycling and waste solutions tailored for small businesses, offices, and local shops.
      </p>
      
      {/* INTEGRATED AUTH CTA */}
      <AuthCTA redirectPath={currentPath} />

      <p className="mt-8 text-sm text-gray-500">
        <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
      </p>
    </div>
  );
}