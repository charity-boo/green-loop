import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";
import UserDashboardClient from "./user-dashboard-client";
import CollectorDashboard from "./collector-dashboard-client";

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
        return <CollectorDashboard />;
    }

    // USER
    const dashboardData = await getUserDashboardData(session.user.id);

    return (
        <div className="min-h-screen">
            <UserDashboardClient
                data={dashboardData}
                userName={session.user.name || ""}
            />
        </div>
    );
}
