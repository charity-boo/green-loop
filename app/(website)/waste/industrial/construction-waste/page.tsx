import Link from 'next/link';
import { AuthCTA } from '@/components/AuthCTA';

export default function ConstructionWastePage() {
  const currentPath = '/waste/industrial/construction-waste';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-orange-700 mb-4">
        🚧 Construction & Demolition Waste Management
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        Efficient disposal and high-rate material recovery for concrete, timber, metals, and debris from C&D sites to minimize environmental impact.
      </p>
      
      {/* INTEGRATED AUTH CTA */}
      <AuthCTA redirectPath={currentPath} />

      <p className="mt-8 text-sm text-gray-500">
        <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
      </p>
    </div>
  );
}