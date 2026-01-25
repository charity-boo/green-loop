import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">
        ⚙️ Access All Services
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-8">
        Your digital hub for scheduling pickups, tracking rewards, and viewing service analytics.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link 
          href="/schedule-pickup"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg text-center hover:bg-green-700 transition"
        >
          Schedule a Pickup
        </Link>
        <Link 
          href="/rewards-program"
          className="px-6 py-3 border border-green-600 text-green-700 font-semibold rounded-lg text-center hover:bg-green-100 transition"
        >
          View Rewards Program
        </Link>
      </div>
    </div>
  );
}