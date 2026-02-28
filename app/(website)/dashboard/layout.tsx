import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard");
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin/dashboard");
    }

    // USER gets the sidebar layout; COLLECTOR manages its own internal layout
    if (session.user.role === "USER") {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <SidebarNav />
                <div className="flex-1 pl-60 min-w-0">
                    {children}
                </div>
            </div>
        );
    }

    // COLLECTOR
    return <>{children}</>;
}
