import Link from "next/link"; // <-- IMPORT ADDED

export default function CommunityPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-4 sm:p-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">
        🌎 Join the Movement
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl text-center mb-8">
        Get involved in our sustainability initiatives, educational programs, and local clean-up drives. Every action helps protect our planet.
      </p>
      <Link 
        href="/auth/register"
        className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300 shadow-lg"
      >
        Sign Up to Volunteer
      </Link>
    </div>
  );
}