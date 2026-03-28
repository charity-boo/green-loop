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
