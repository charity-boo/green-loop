import Link from 'next/link';
import { AuthCTA } from '@/components/AuthCTA';

export default function ApartmentsWastePage() {
  const currentPath = '/waste/residential/apartments';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-teal-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">
          🏢 Waste Management for Apartments & Staff Housing
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Centralized collection solutions designed for multi-unit dwellings. We work with property managers to ensure seamless service for all residents.
        </p>
        
        {/* Key Features */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left border-t-4 border-teal-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Solutions for Property Managers
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>**Bulk Waste Removal:** Coordinated service for large items and move-out days.</li>
            <li>**Shared Dumpster Optimization:** Right-sized containers and smart monitoring to prevent overflow.</li>
            <li>**Resident Compliance Tools:** Digital guides and notices to help residents manage their individual waste.</li>
          </ul>
        </div>

        {/* INTEGRATED AUTH CTA */}
        <AuthCTA redirectPath={currentPath} />

        <p className="mt-4 text-sm">
          <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
        </p>
      </div>
    </div>
  );
}