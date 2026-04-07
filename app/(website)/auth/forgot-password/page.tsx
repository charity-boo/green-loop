"use client";

import { useState } from "react";
import Link from "next/link";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess("If an account exists with this email, you will receive password reset instructions.");
            setEmail("");
        } catch (err: unknown) {
            console.error('Password reset error:', err);
            const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again later.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold text-gray-900">Reset Password</CardTitle>
                    <CardDescription className="text-gray-500">
                        Enter your email address and we&apos;ll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 py-6"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Instructions...
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>

                            {/* Back to Login */}
                            <div className="text-center mt-6">
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-green-600 hover:text-green-500 transition-colors"
                                >
                                    &larr; Back to Sign In
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">Check your email</h3>
                                    <p className="text-gray-500 max-w-sm">
                                        {success}
                                    </p>
                                </div>
                            </div>
                            
                            <Button
                                asChild
                                variant="outline"
                                className="w-full border-green-600 text-green-600 hover:bg-green-50 py-6"
                            >
                                <Link href="/auth/login">Return to Login</Link>
                            </Button>
                            
                            <p className="text-center text-sm text-gray-500">
                                Didn&apos;t receive the email?{" "}
                                <button
                                    onClick={() => setSuccess(null)}
                                    className="font-medium text-green-600 hover:text-green-500"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
