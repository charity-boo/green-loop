import Link from 'next/link';
// Assuming you have Shadcn Button component available, if not, use a simple button/div
// import { Button } from "@/components/ui/button";

// Reusable Call-to-Action Component
export const AuthCTA = ({ redirectPath }: { redirectPath: string }) => {
  return (
    <div className="mt-12 p-6 bg-green-100 border border-green-300 rounded-xl shadow-lg w-full max-w-lg mx-auto text-center">
      <h3 className="text-xl font-bold text-green-800 mb-3">
        Ready to Implement Smart Waste Management?
      </h3>
      <p className="text-gray-700 mb-4">
        Login to schedule a consultation or register your institution now.
      </p>
      
      <div className="flex justify-center gap-4">
        {/* Link to Login */}
        <Link 
          href={`/auth/login?redirect=${redirectPath}`}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          Login
        </Link>
        
        {/* Link to Register */}
        <Link 
          href={`/auth/register?redirect=${redirectPath}`}
          className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200 shadow-md"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

// Main Page Component
export default function HospitalsWastePage() {
  const currentPath = '/waste/commercial/hospitals'; // Define the current page path

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-4">
          🏥 Specialized Waste Management for Hospitals & Clinics
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Compliance and safety are our highest priorities. Green Loop provides specialized, regulated services for clinical and general waste streams.
        </p>

        {/* --- Key Features --- */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 text-left border-t-4 border-red-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Clinical Waste Solution
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
            <li>
              **Biohazard & Sharps Disposal:** Guaranteed compliance with all national and local health regulations.
            </li>
            <li>
              **Scheduled Collections:** Flexible, discreet, and reliable pickup times to minimize disruption to patient care.
            </li>
            <li>
              **Regulatory Documentation:** Automated reporting and manifest tracking for audit trails and complete peace of mind.
            </li>
            <li>
              **Staff Training:** We offer on-site training to hospital staff on proper segregation and containment.
            </li>
          </ul>
        </div>

        {/* INTEGRATE THE NEW CTA HERE */}
        <AuthCTA redirectPath={currentPath} />
        
        <p className="mt-4 text-sm">
          <Link href="/waste-management" className="text-blue-500 hover:underline">← Back to Waste Management Categories</Link>
        </p>
      </div>
    </div>
  );
}