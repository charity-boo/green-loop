import Link from 'next/link';
import { AuthCTA } from '@/components/features/auth/auth-cta';

export default function HostelsWastePage() {
  const currentPath = '/waste/residential/hostels';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">
          🎓 Waste Management for Hostels & Student Housing
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Dedicated, frequent pickup schedules tailored to high-density student living areas, ensuring campus cleanliness and resident satisfaction.
        </p>
        
        {/* Key Features */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left border-t-4 border-indigo-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Service Highlights
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>**Weekly or Bi-weekly Pickups:** High-frequency service to manage large communal volumes.</li>
            <li>**Recycling Bins Provided:** Color-coded bins for easy student segregation of waste.</li>
            <li>**Educational Signage:** Clear posters and guidance on proper recycling for residents.</li>
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