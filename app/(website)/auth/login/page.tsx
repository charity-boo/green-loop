import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { Suspense } from "react";
export const dynamic = 'force-dynamic';

// Loading Fallback for Suspense
function LoginFormFallback() {
  return (
    <div className="w-full max-w-lg animate-pulse">
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const callbackUrl = (resolvedParams.callbackUrl as string) || (resolvedParams.redirect as string);
  
  const session = await getSession();
  console.log('[LoginPage] Server-side session check:', session
    ? { uid: session.user.id, email: session.user.email, role: session.user.role }
    : 'no session'
  );

  // STEP 1 & 2: Server-side redirect if session exists
  if (session) {
    const { role } = session.user;
    console.log('[LoginPage] Session found, redirecting. Role:', role, 'Target:', callbackUrl || 'default');

    // If we have a specific callback URL (and it's not just the dashboard), use it
    if (callbackUrl && callbackUrl !== '/dashboard') {
      redirect(callbackUrl);
    }

    // STEP 3: Role-based routing
    if (role === 'ADMIN') {
      console.log('[LoginPage] → redirecting to /admin');
      redirect("/admin");
    } else if (role === 'COLLECTOR') {
      console.log('[LoginPage] → redirecting to /dashboard/collector');
      redirect("/dashboard/collector");
    } else {
      console.log('[LoginPage] → redirecting to /dashboard (USER/default)');
      redirect("/dashboard");
    }
  }

  // STEP 4: Render LoginForm inside Suspense to prevent prerendering errors
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end overflow-hidden bg-black">
      {/* Background Image (Full-screen) */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg-glass.png')" }}
      />
      
      {/* Overlay Gradients for Depth & Legibility */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
      
      {/* Left-side Branding (Desktop) */}
      <div className="hidden lg:flex absolute left-24 bottom-24 flex-col text-white max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-tight">Welcome Back to the Loop</h1>
        <p className="text-2xl text-gray-200">
          Track your impact, manage your waste, and continue your journey toward a greener planet.
        </p>
      </div>

      {/* Right Side (Form Container) - Floating on Desktop, Centered on Mobile */}
      <div className="relative z-10 w-full max-w-xl px-6 lg:px-12 h-screen flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden mb-8 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome Back</h1>
          <p className="text-gray-200 text-sm">Continue your journey with Green Loop</p>
        </div>

        <div className="w-full">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
