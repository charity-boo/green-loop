"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/lib/firebase/config";
import { useAuth } from "@/context/auth-provider";
import AddressAutocomplete from "@/components/location/address-autocomplete";
import { validateCollectorLocationSelection } from "@/lib/location/collector-location-validation";
import { Eye, EyeOff } from "lucide-react";

// Import Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();
  const { role, status } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"USER" | "COLLECTOR">("USER");
  const [address, setAddress] = useState("");
  const [county, setCounty] = useState("");
  const [region, setRegion] = useState("");
  const [placeId, setPlaceId] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<"manual" | "gps" | "google_autocomplete">("manual");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    // Only redirect if not currently in the registration submission process
    if (status === 'authenticated' && role && !loading) {
      if (role === 'ADMIN') {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [status, role, loading, router]);

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

    if (selectedRole === 'COLLECTOR') {
      const validation = validateCollectorLocationSelection({
        address,
        county,
        region,
        placeId,
        locationSource,
      });
      if (!validation.isValid) {
        setError(validation.error ?? "Please provide a valid collector location.");
        setLoading(false);
        return;
      }
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
        role: 'USER', // Always start as USER for security
        requestedRole: selectedRole,
        status: selectedRole === 'COLLECTOR' ? 'PENDING_APPROVAL' : 'ACTIVE',
        ...(selectedRole === 'COLLECTOR'
          ? {
              address,
              region,
              county,
              placeId,
              locationSource,
            }
          : {}),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Firestore document creation is successful.
      // The useAuth hook will detect the auth state change and handle the redirection.
    } catch (err: unknown) {
      console.error("Registration Error:", err);
      
      if (err instanceof FirebaseError) {
        // Handle Firebase specific errors
        if (err.code === 'auth/email-already-in-use') {
          setError(
            <span>
              This email is already registered.{" "}
              <Link href="/auth/forgot-password" className="font-semibold underline">
                Forgot password?
              </Link>
            </span>
          );
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
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 leading-tight">Join the Green Revolution</h1>
        <p className="text-2xl text-gray-200">
          Manage your waste, earn rewards, and save the planet. Join Green Loop today.
        </p>
      </div>

      {/* Right Side (Form Container) - Floating on Desktop, Centered on Mobile */}
      <div className="relative z-10 w-full max-w-xl px-6 lg:px-12 h-screen flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden mb-12 text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-200">Start your journey with Green Loop</p>
        </div>

        <div className="w-full space-y-6 bg-black/40 lg:bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl p-8 lg:p-10 animate-in zoom-in-95 duration-700">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Join the Loop</h2>
            <p className="text-sm text-gray-300">
              Start managing your waste smarter.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-200">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>

            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>

            {/* Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Must be at least 8 characters"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-200">I am a...</Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => {
                  setSelectedRole(val as "USER" | "COLLECTOR");
                  setAddress("");
                  setCounty("");
                  setRegion("");
                  setPlaceId(null);
                  setLocationSource("manual");
                }}
              >
                <SelectTrigger id="role" className="h-12 bg-white/5 border-white/10 text-white ring-offset-background focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white border-white/10">
                  <SelectItem value="USER">Resident / Business (User)</SelectItem>
                  <SelectItem value="COLLECTOR">Waste Collector</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Selection - only for collectors */}
            {selectedRole === 'COLLECTOR' && (
              <div className="grid gap-2">
                <Label htmlFor="collector-address" className="text-sm font-medium text-gray-200">
                  Service Address
                </Label>
                <AddressAutocomplete
                  value={address}
                  onManualChange={(nextAddress) => {
                    setAddress(nextAddress);
                    setCounty("");
                    setRegion("");
                    setPlaceId(null);
                    setLocationSource("manual");
                  }}
                  onSelectAddress={(selection) => {
                    setAddress(selection.address);
                    setPlaceId(selection.placeId);
                    setLocationSource(selection.source);
                    setCounty(selection.county ?? "");
                    setRegion(selection.region ?? "");
                  }}
                  placeholder="Search your base/station address"
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500"
                />
                <p className="text-xs text-gray-400">Select from Google suggestions only.</p>
              </div>
            )}

            {selectedRole === 'COLLECTOR' && (
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-200">Service County</Label>
                <Input
                  value={county || "Set from Google selection"}
                  disabled
                  className="h-12 bg-white/5 border-white/10 text-white"
                />
              </div>
            )}

            {selectedRole === 'COLLECTOR' && (
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-200">Service Area</Label>
                <Input
                  value={region || "Set from Google selection"}
                  disabled
                  className="h-12 bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-gray-400">You will be assigned pickups in this area.</p>
              </div>
            )}

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
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-green-400 hover:text-green-300 underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
