import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OverviewClient from "./overview-client";

export default async function CollectorDashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard/collector");
    }

    if (session.user.role !== "COLLECTOR" && session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return <OverviewClient />;
}
