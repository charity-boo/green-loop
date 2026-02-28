import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

/**
 * User Dashboard Page (Server Component)
 * Path: /dashboard/user
 */
export default async function UserDashboardPage() {
    const session = await getSession();

    // Secondary server-side guard (Middleware usually handles this)
    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard/user");
    }

    if (session.user.role !== "USER") {
        // If they are admin or collector, they are in the wrong place
        redirect("/");
    }

    // Fetch user dashboard data
    const dashboardData = await getUserDashboardData(session.user.id);

    return (
        <div className="min-h-screen">
            <DashboardClient
                data={dashboardData}
                userName={session.user.name || ""}
            />
        </div>
    );
}
