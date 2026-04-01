import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";
import GreenPointsClient from "./green-points-client";

export const dynamic = 'force-dynamic';

export default async function GreenPointsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard/green-points");
    }

    if (session.user.role !== "USER") {
        redirect("/dashboard");
    }

    const dashboardData = await getUserDashboardData(session.user.id);

    return (
        <div className="min-h-screen">
            <GreenPointsClient
                data={dashboardData}
            />
        </div>
    );
}
