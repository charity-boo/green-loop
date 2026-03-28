import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import CollectorDashboard from "../collector-dashboard-client";

export default async function CollectorDashboardPage() {
    const session = await getSession();

    // Ensure user is authenticated
    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard/collector");
    }

    // Only collectors and admins can access this page
    if (session.user.role !== "COLLECTOR" && session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return <CollectorDashboard />;
}
