import Link from 'next/link';
import { AuthCTA } from '@/components/features/auth/auth-cta';

export default function PrivateHomesWastePage() {
  const currentPath = '/waste/residential/private-homes';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-lime-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-lime-700 mb-4">
          🏡 Standard Waste Pickup for Private Homes
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Simple, reliable, scheduled, and on-demand waste collection for single-family residences. Making recycling easy for your household.
        </p>

        {/* Key Features */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left border-t-4 border-lime-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What&apos;s Included?
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>**Flexible Scheduling:** Choose weekly, bi-weekly, or on-demand pickups via the app.</li>
            <li>**Smart Bin Monitoring:** Optional sensor integration to ensure pickup only when the bin is full.</li>
            <li>**Rewards Integration:** Automatically earn Green Points for every correct recycling action.</li>
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