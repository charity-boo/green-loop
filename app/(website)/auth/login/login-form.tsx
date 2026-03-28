"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInFirebase, signInWithGoogle } from "@/lib/firebase/auth-integration";
import { useAuth } from "@/context/auth-provider";
import { Eye, EyeOff } from "lucide-react";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { role, status } = useAuth();

    const redirectPath = searchParams.get('redirect') || searchParams.get('callbackUrl');
    const registered = searchParams.get('registered');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRoleRedirect = useCallback((userRole: string, customPath?: string) => {
        console.log('[LoginForm] Redirecting based on role:', userRole, 'with customPath:', customPath);
        
        // Ensure cookies are synced before redirect
        router.refresh();

        if (customPath && customPath !== '/dashboard' && customPath !== '/auth/login') {
            console.log('[LoginForm] Redirecting to custom path via location:', customPath);
            window.location.href = customPath;
            return;
        }

        if (userRole === "ADMIN") {
            console.log('[LoginForm] Redirecting to /admin via location');
            window.location.href = "/admin";
        } else if (userRole === "COLLECTOR") {
            console.log('[LoginForm] Redirecting to /dashboard/collector via location');
            window.location.href = "/dashboard/collector";
        } else {
            console.log('[LoginForm] Redirecting to /dashboard via location');
            window.location.href = "/dashboard";
        }
    }, []);

    useEffect(() => {
        if (registered) {
            setSuccess("Registration successful! Please sign in.");
        }
    }, [registered]);

    useEffect(() => {
        if (status === 'authenticated' && role) {
            console.log('[LoginForm] Auth detected. Status:', status, 'Role:', role);
            handleRoleRedirect(role, redirectPath || undefined);
        }
    }, [status, role, handleRoleRedirect, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInFirebase(email, password);
            setLoading(false);
        } catch (err: unknown) {
            let errorMessage = "Invalid credentials. Please try again.";
            let isExpectedAuthError = false;

            if (typeof err === 'object' && err !== null && 'code' in err) {
                const code = (err as { code: string }).code;
                isExpectedAuthError = code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential';
                if (isExpectedAuthError) {
                    errorMessage = "Invalid email or password.";
                }
            }

            if (!isExpectedAuthError && err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setLoading(false);

            if (!isExpectedAuthError) {
                console.error('handleSubmit error:', err);
            }
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Google sign-in failed.");
            setLoading(false);
            console.error('handleGoogleSignIn error:', err);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-black/40 lg:bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 lg:p-12 animate-in zoom-in-95 duration-700">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Sign In</h2>
                <p className="text-sm text-gray-300">
                    Access your Smart Waste Pickup schedule.
                </p>
            </div>
            
            <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" colonial-className="text-sm font-medium text-gray-200">Password</Label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md text-center animate-in fade-in slide-in-from-top-1">
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-transparent px-2 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 border-white/10 bg-white/5 text-white hover:bg-white/10"
                        onClick={handleGoogleSignIn}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Sign in with Google
                    </Button>

                    {/* Alternative sign-in */}
                    <div className="mt-4 text-center">
                        <Link 
                            href="/auth/phone" 
                            className="text-sm font-medium text-green-400 hover:text-green-300 underline-offset-4 hover:underline"
                        >
                            Sign in with phone number instead
                        </Link>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-green-400 hover:text-green-300 underline-offset-4 hover:underline">
                                Register now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
