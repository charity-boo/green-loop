import Link from 'next/link';
import { AuthCTA } from '@/components/features/auth/auth-cta';

export default function WarehousesWastePage() {
  const currentPath = '/waste/industrial/warehouses';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        📦 Industrial Parks & Warehouses Waste Management
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        Optimized logistics for handling large volumes of packaging, plastic wrap, and pallet recycling across logistics and warehousing complexes.
      </p>
      
      {/* INTEGRATED AUTH CTA */}
      <AuthCTA redirectPath={currentPath} />

      <p className="mt-8 text-sm text-gray-500">
        <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
      </p>
    </div>
  );
}