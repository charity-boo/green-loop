# Profile Settings and Password Change Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a secure, tabbed `/profile` settings page allowing users to update their name, profile photo, and change their password.

**Architecture:** A new protected route `/profile` using a tabbed interface (Account and Security). Updates will synchronize between Firebase Auth and the Firestore `users` collection.

**Tech Stack:** Next.js (App Router), Firebase Auth & Storage, Firestore, Lucide React (icons), Shadcn UI (Tabs, Card, Input, Button, Label, Avatar).

---

### Task 1: Create the Protected Profile Page Structure

**Files:**
- Create: `app/(website)/profile/page.tsx`

**Step 1: Write the implementation**
```tsx
"use client";

import { Suspense } from "react";
import { ProtectedRoute } from "@/components/features/auth/protected-route";
import { ProfileHub } from "@/components/features/profile/profile-hub";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div className="container max-w-4xl py-10">
                <Suspense fallback={<ProfileSkeleton />}>
                    <ProfileHub />
                </Suspense>
            </div>
        </ProtectedRoute>
    );
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
    );
}
```

**Step 2: Verify accessibility**
Navigate to `/profile` while logged out. 
Expected: Redirect to `/auth/login`.

---

### Task 2: Implement the Profile Hub with Tabs

**Files:**
- Create: `components/features/profile/profile-hub.tsx`

**Step 1: Write implementation**
```tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountForm } from "./account-form";
import { PasswordForm } from "./password-form";
import { User, Shield } from "lucide-react";

export function ProfileHub() {
    return (
        <div className="space-y-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and security.</p>
            </div>

            <Tabs defaultValue="account" className="w-full max-w-2xl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Account
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Security
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                    <AccountForm />
                </TabsContent>
                
                <TabsContent value="security">
                    <PasswordForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
```

---

### Task 3: Account Form & Profile Sync (Name and Photo)

**Files:**
- Create: `components/features/profile/account-form.tsx`

**Step 1: Write minimal implementation**
Include name editing and a read-only email field. Implement `updateProfile` and Firestore document update.

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

export function AccountForm() {
    const { user } = useAuth();
    const [name, setName] = useState(user?.displayName || "");
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Update Firebase Auth
            await updateProfile(user, { displayName: name });
            // 2. Update Firestore
            await updateDoc(doc(db, "users", user.uid), {
                name,
                updatedAt: new Date().toISOString()
            });
            alert("Profile updated!");
        } catch (e) {
            console.error(e);
            alert("Update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                   <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.photoURL || ""} />
                        <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700">
                            {user?.displayName?.charAt(0) || user?.email?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" /> Change Photo
                    </Button>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email || ""} disabled />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdate} disabled={loading} className="w-full md:w-auto">
                    {loading ? "Saving..." : "Save Changes"}
                </Button>
            </CardFooter>
        </Card>
    );
}
```

---

### Task 4: Security Form (Password Change)

**Files:**
- Create: `components/features/profile/password-form.tsx`

**Step 1: Write implementation**
Implement password change using `EmailAuthProvider.reauthenticateWithCredential` then `updatePassword`.

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-provider";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function PasswordForm() {
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!user || !user.email) return;
        if (newPassword !== confirmPassword) return alert("Passwords do not match");
        if (newPassword.length < 6) return alert("Password must be at least 6 characters");

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            alert("Password updated!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/wrong-password') {
                alert("Incorrect current password.");
            } else {
                alert("Failed to update password. " + e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Secure your account by choosing a strong password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleUpdatePassword} disabled={loading} className="w-full md:w-auto">
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </CardFooter>
        </Card>
    );
}
```

---

### Task 5: Final Polish (Navigation and Toasts)

**Files:**
- Modify: `components/layout/navbar.tsx` to include a link to Settings/Profile.

**Step 1: Add link to Navbar**
Add a "Profile Settings" link in the user menu.
