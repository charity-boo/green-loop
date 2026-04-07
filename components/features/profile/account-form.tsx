"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-provider";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { UserDoc } from "@/types/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfilePhotoSection } from "./profile-photo-section";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import LocationSection from "@/components/user/location-section";

export function AccountForm() {
    const { user, role } = useAuth();
    const router = useRouter();
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [loading, setLoading] = useState(false);
    const [fullUserData, setFullUserData] = useState<Partial<UserDoc> | null>(null);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.uid) return;
            try {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFullUserData(docSnap.data() as UserDoc);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        fetchUserData();
    }, [user?.uid]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Update Auth Profile
            await updateProfile(user, { displayName });

            // Update Firestore Profile
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { 
                displayName,
                name: displayName // Keep 'name' in sync with 'displayName' for consistency
            });

            // Force token refresh to update server-side session
            await user.getIdToken(true);

            // Wait a brief moment for the cookie to be set by onIdTokenChanged
            await new Promise(resolve => setTimeout(resolve, 500));

            setSuccess(true);
            
            // Refresh the page to get updated server-side session data
            router.refresh();
            
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Update error:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-card">
            <CardHeader className="bg-muted/50/50 border-b border-border p-8">
                <CardTitle className="text-2xl font-black text-foreground uppercase tracking-tight">Account Information</CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                    Update your personal details and how you appear on Green Loop.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                {/* Photo Section */}
                <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-emerald-50/30 border border-emerald-100/50">
                    <ProfilePhotoSection />
                </div>

                <div className="grid gap-6">
                    <div className="space-y-3">
                        <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                        <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your Full Name"
                            className="h-12 rounded-2xl border-border focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Account Role</Label>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border">
                            <span className="text-sm font-bold text-slate-600">Current Role</span>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 font-black uppercase tracking-tighter px-3 py-1">
                                {role || "USER"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3 opacity-60">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address (Managed by Auth)</Label>
                        <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="h-12 rounded-2xl bg-slate-100 border-border font-medium cursor-not-allowed"
                        />
                    </div>
                </div>

                {role === "COLLECTOR" && fullUserData && (
                    <LocationSection 
                        key={fullUserData.updatedAt || 'initial'}
                        initialAddress={fullUserData.address}
                        initialCounty={fullUserData.county}
                        initialRegion={fullUserData.region}
                        initialPlaceId={fullUserData.placeId}
                        initialLocationSource={fullUserData.locationSource}
                    />
                )}

                {error && (
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-3">
                        <AlertCircle className="h-5 w-5" /> {error}
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-8 pt-0 bg-background">
                <Button 
                    onClick={handleSave} 
                    disabled={loading || displayName === user?.displayName}
                    className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : success ? (
                        <Check className="h-5 w-5" />
                    ) : (
                        "Save Profile Changes"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
