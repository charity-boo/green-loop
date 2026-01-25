import Link from 'next/link';
import { AuthCTA } from '@/components/AuthCTA'; // Import the new component

export default function SchoolsWastePage() {
  const currentPath = '/waste/commercial/schools'; // The path to redirect to

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">
        📚 Waste Management for Schools & Universities
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center">
        Implementing educational recycling programs and reliable collection services to minimize waste across campus and classroom facilities.
      </p>
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">Key Focus Areas:</h2>
        <ul className="list-disc list-inside mt-2 text-gray-600">
          <li>Paper and Cardboard Recovery</li>
          <li>Cafeteria Composting Solutions</li>
          <li>Student-led Recycling Audits</li>
        </ul>
      </div>
      
      {/* INTEGRATED AUTH CTA */}
      <AuthCTA redirectPath={currentPath} />

      <p className="mt-8 text-sm text-gray-500">
        <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
      </p>
    </div>
  );
}