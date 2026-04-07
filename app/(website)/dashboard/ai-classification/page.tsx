import { getSession } from "@/lib/auth";
import { getUserDashboardData } from "@/lib/dashboard-data";
import { redirect } from "next/navigation";
import AIClassificationClient from "./ai-classification-client";

export const metadata = {
  title: "AI Classification | Green Loop",
  description: "View your AI classification history and smart sorting impact.",
};

export default async function AIClassificationPage() {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard/ai-classification");
    }

    const dashboardData = await getUserDashboardData(session.user.id);

    return (
        <div className="min-h-screen">
            <AIClassificationClient
                data={dashboardData}
            />
        </div>
    );
}
