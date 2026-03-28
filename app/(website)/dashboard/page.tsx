import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";
import { adminDb } from "@/lib/firebase/admin";
import UserDashboardClient from "./user-dashboard-client";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getSession();

    // Layout already handles no-session and ADMIN redirects,
    // but guard here as a safety net for direct page access.
    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard");
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin/dashboard");
    }

    if (session.user.role === "COLLECTOR") {
        redirect("/dashboard/collector");
    }

    // USER
    const isFirebaseAvailable = typeof adminDb.collection === 'function';

    const [dashboardData, userDoc] = await Promise.all([
        getUserDashboardData(session.user.id),
        isFirebaseAvailable
            ? adminDb.collection("users").doc(session.user.id).get()
            : Promise.resolve(null),
    ]);

    const userData = userDoc?.data?.();
    const userName = userData?.name || userData?.displayName || session.user.name || "";

    return (
        <div className="min-h-screen">
            <UserDashboardClient
                data={dashboardData}
                userName={userName}
            />
        </div>
    );
}
