"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInFirebase, signInWithGoogle, getFirebaseIdToken } from "@/lib/firebase/auth-integration";
import { useAuth } from "@/context/auth-provider";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { role, status } = useAuth();
    console.log('LoginForm mounted. Current status:', status, 'role:', role);

    const redirectPath = searchParams.get('redirect') || searchParams.get('callbackUrl');
    const registered = searchParams.get('registered');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleRoleRedirect = useCallback((userRole: string, customPath?: string) => {
        console.log('handleRoleRedirect called. userRole:', userRole, 'customPath:', customPath);
        if (customPath && customPath !== '/dashboard') {
            console.log('Redirecting to custom path:', customPath);
            router.push(customPath);
            return;
        }

        if (userRole === "ADMIN") {
            console.log('Redirecting ADMIN to /admin');
            router.push("/admin");
        } else if (userRole === "COLLECTOR") {
            console.log('Redirecting COLLECTOR to /dashboard/collector');
            router.push("/dashboard/collector");
        } else {
            console.log('Redirecting USER (or default) to /dashboard/user');
            router.push("/dashboard/user");
        }
    }, [router]);

    useEffect(() => {
        if (registered) {
            setSuccess("Registration successful! Please sign in.");
            console.log('Registration successful message set.');
        }
    }, [registered]);

    useEffect(() => {
        console.log('LoginForm useEffect for status/role change. Current status:', status, 'role:', role);
        if (status === 'authenticated' && role) {
            console.log('User is authenticated and role is available. Initiating role-based redirection.');
            handleRoleRedirect(role, redirectPath || undefined);
        }
    }, [status, role, handleRoleRedirect, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleSubmit called for email/password login.');
        setLoading(true);
        setError(null);

        try {
            await signInFirebase(email, password);
            console.log('signInFirebase successful.');
            const idToken = await getFirebaseIdToken();
            if (idToken) {
                console.log('Firebase ID token obtained. Setting cookie.');
                const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour from now
                const isSecure = window.location.protocol === 'https:';
                document.cookie = `firebase-token=${idToken}; path=/; expires=${expires}; ${isSecure ? 'secure;' : ''} samesite=Lax`;
            } else {
                console.log('No Firebase ID token obtained after signInFirebase.');
            }
            setLoading(false);
            console.log('setLoading(false) after handleSubmit success.');
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
        console.log('handleGoogleSignIn called.');
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
            console.log('signInWithGoogle successful.');
            const idToken = await getFirebaseIdToken();
            if (idToken) {
                console.log('Firebase ID token obtained (Google). Setting cookie.');
                const expires = new Date(Date.now() + 60 * 60 * 1000).toUTCString(); // 1 hour from now
                const isSecure = window.location.protocol === 'https:';
                document.cookie = `firebase-token=${idToken}; path=/; expires=${expires}; ${isSecure ? 'secure;' : ''} samesite=Lax`;
            } else {
                console.log('No Firebase ID token obtained after signInWithGoogle.');
            }
            setLoading(false);
            console.log('setLoading(false) after handleGoogleSignIn success.');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Google sign-in failed.");
            setLoading(false);
            console.error('handleGoogleSignIn error:', err);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-800">Sign In to Green Loop</CardTitle>
                <CardDescription>
                    Access your Smart Waste Pickup schedule.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
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
                        className="w-full bg-green-600 hover:bg-green-700"
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
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50"
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

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="font-medium text-green-600 hover:text-green-500">
                                Register now
                            </Link>
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
