import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { Suspense } from "react";

// Loading Fallback for Suspense
function LoginFormFallback() {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-2xl animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
      <div className="space-y-4">
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-10 bg-gray-100 rounded" />
        <div className="h-12 bg-green-200 rounded" />
      </div>
    </div>
  );
}

export default async function LoginPage() {
  const session = await getSession();

  // STEP 1 & 2: Server-side redirect if session exists
  if (session) {
    const { role } = session.user;

    // STEP 3: Role-based routing
    if (role === 'ADMIN') {
      redirect("/admin");
    } else if (role === 'COLLECTOR') {
      redirect("/dashboard/collector");
    } else {
      redirect("/dashboard");
    }
  }

  // STEP 4: Render LoginForm inside Suspense to prevent prerendering errors
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
