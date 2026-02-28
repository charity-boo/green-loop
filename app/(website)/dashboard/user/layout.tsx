import SidebarNav from "@/components/dashboard/sidebar-nav";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <SidebarNav />
            {/* Main content — offset by sidebar width (240px) */}
            <div className="flex-1 pl-60 min-w-0">
                {children}
            </div>
        </div>
    );
}
