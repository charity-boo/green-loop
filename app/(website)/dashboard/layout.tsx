import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import { TopNav } from "@/components/dashboard/top-nav";
import AuthStatusWrapper from "@/components/layout/auth-status-wrapper";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect("/auth/login?callbackUrl=/dashboard");
    }

    if (session.user.role === "ADMIN") {
        redirect("/admin/dashboard");
    }

    // USER and COLLECTOR get the sidebar layout
    if (session.user.role === "USER" || session.user.role === "COLLECTOR") {
        return (
            <AuthStatusWrapper>
                <div className="flex min-h-screen bg-background text-foreground transition-colors font-outfit">
                    <SidebarNav />
                    <div className="flex-1 pl-64 min-w-0 flex flex-col">
                        <TopNav />
                        <main className="flex-1">
                            {children}
                        </main>
                    </div>
                </div>
            </AuthStatusWrapper>
        );
    }
}
