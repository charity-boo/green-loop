"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase/config";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Initial basic validation to match requirements
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Password must contain at least one letter and one number.");
      setLoading(false);
      return;
    }

    if (!auth || !db) {
      setError("Firebase is not properly initialized. Please check your configuration.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update profile with display name
      await updateProfile(user, {
        displayName: name
      });

      // 3. Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name,
        email,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Redirect to home page on success
      router.push("/");
    } catch (err: unknown) {
      console.error("Registration Error:", err);
      
      if (err instanceof FirebaseError) {
        // Handle Firebase specific errors
        if (err.code === 'auth/email-already-in-use') {
          setError("This email is already registered.");
        } else if (err.code === 'auth/invalid-email') {
          setError("Invalid email address.");
        } else if (err.code === 'auth/weak-password') {
          setError("The password is too weak.");
        } else {
          setError(err.message || "Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gray-800">Create an Account</CardTitle>
          <CardDescription>
            Join Green Loop today and start managing your waste smarter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Must be at least 6 characters"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md text-center">
                {error}
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
                  Registering...
                </div>
              ) : (
                "Register Account"
              )}
            </Button>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-green-600 hover:text-green-500 underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
