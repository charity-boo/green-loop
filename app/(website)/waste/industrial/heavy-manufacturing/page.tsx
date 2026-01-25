import Link from 'next/link';
import { AuthCTA } from '@/components/AuthCTA';

export default function HeavyManufacturingWastePage() {
  const currentPath = '/waste/industrial/heavy-manufacturing'; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        ⚙️ Heavy Manufacturing Waste Solutions
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        Managing complex, high-volume waste streams including scrap, hazardous materials, and industrial byproducts with full regulatory compliance.
      </p>
      
      {/* INTEGRATED AUTH CTA */}
      <AuthCTA redirectPath={currentPath} />
      
      <p className="mt-8 text-sm text-gray-500">
        <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
      </p>
    </div>
  );
}