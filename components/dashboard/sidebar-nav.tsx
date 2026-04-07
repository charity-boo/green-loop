"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import { useUserData } from "@/hooks/use-user-data";
import {
    LayoutDashboard,
    CalendarPlus,
    Scan,
    MapPin,
    Settings,
    LogOut,
    Activity,
    Leaf,
    Coins,
    ChevronRight,
    Clock,
    TrendingUp,
    AlertTriangle,
    History,
    ClipboardList,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const USER_NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Schedule Pickup", icon: CalendarPlus, href: "/schedule-pickup" },
    { label: "Green Points", icon: Coins, href: "/dashboard/green-points" },
    { label: "AI Sorting", icon: Scan, href: "/dashboard/ai-classification" },
    { label: "Settings/Support", icon: Settings, href: "/report" },
];

const COLLECTOR_NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard/collector" },
    { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    { label: "Active Tasks", icon: ClipboardList, href: "/dashboard/collector/active" },
    { label: "Earnings", icon: TrendingUp, href: "/dashboard/collector/earnings" },
    { label: "Report Issue", icon: AlertTriangle, href: "/dashboard/collector/issues" },
    { label: "Job History", icon: History, href: "/dashboard/collector/history" },
    { label: "Settings", icon: Settings, href: "/profile?tab=settings" },
];

export default function SidebarNav() {
    const pathname = usePathname();
    const { signOut, role } = useAuth();
    const { nextPickup, loading, points, aiStats } = useUserData();

    const isCollector = role === 'COLLECTOR';
    const navItems = isCollector ? COLLECTOR_NAV_ITEMS : USER_NAV_ITEMS.map(item => {
        if (item.label === "AI Sorting") {
            return {
                ...item,
                label: `AI Sorting (${aiStats?.totalClassified || 0})`,
                subLabel: `+${aiStats?.totalAiPoints || 0} pts`
            };
        }
        return item;
    });

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen w-64 z-40 flex flex-col shadow-2xl transition-colors duration-300",
            isCollector 
                ? "bg-emerald-700 text-emerald-50 border-r border-emerald-600/50" 
                : "bg-slate-800 text-green-50 border-r border-green-900/20"
        )}>
            {/* Logo Section */}
            <div className={cn(
                "flex items-center h-24 px-8 border-b shrink-0 gap-4",
                isCollector ? "border-emerald-600/50" : "border-green-900/20"
            )}>
                <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg",
                    isCollector 
                        ? "bg-emerald-600 shadow-emerald-900/20" 
                        : "bg-green-600 shadow-green-900/20"
                )}>
                    {isCollector ? <Leaf className="text-white w-6 h-6" /> : <Activity className="text-white w-6 h-6" />}
                </div>
                <div>
                    <span className="font-black text-lg tracking-tighter uppercase italic leading-none block text-white">
                        Green<span className={isCollector ? "text-emerald-300" : "text-green-400"}>.Loop</span>
                    </span>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-[0.3em] mt-1 block",
                        isCollector ? "text-emerald-200/50" : "text-green-400/50"
                    )}>
                        {isCollector ? "COLLECTOR_OS" : "USER_OS"}
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-8 px-4 overflow-y-auto space-y-1 no-scrollbar">
                <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.25em] px-4 mb-4",
                    isCollector ? "text-emerald-200/50" : "text-green-400/50"
                )}>Operations</p>
                {navItems.map(({ label, icon: Icon, href, subLabel }: any) => {
                    const isActive = pathname === href || (href !== '/dashboard' && href !== '/dashboard/collector' && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center h-11 px-4 gap-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? isCollector 
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                                        : "bg-green-600 text-white shadow-lg shadow-green-900/20"
                                    : isCollector
                                        ? "text-emerald-100 hover:bg-emerald-600/50 hover:text-white"
                                        : "text-slate-400 hover:bg-green-500/10 hover:text-green-400"
                            )}
                        >
                            <Icon className={cn(
                                "h-4.5 w-4.5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                isActive 
                                    ? "text-white" 
                                    : isCollector 
                                        ? "text-emerald-300 group-hover:text-white"
                                        : "text-slate-500 group-hover:text-green-400"
                            )} />
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold uppercase tracking-widest leading-tight">{label}</span>
                                {subLabel && (
                                    <span className="text-[8px] font-black text-green-400/80 uppercase tracking-widest leading-none">
                                        {subLabel}
                                    </span>
                                )}
                            </div>
                        </Link>
                    );
                })}

                {/* Role Specific Section Removed as per request */}
            </nav>

            {/* Bottom: User & Sign Out */}
            <div className={cn(
                "border-t p-6 mt-auto",
                isCollector ? "border-emerald-600/50 bg-emerald-800/20" : "border-green-900/20 bg-slate-900/50"
            )}>
                <button
                    onClick={() => signOut()}
                    className={cn(
                        "flex items-center gap-4 px-4 py-4 w-full rounded-[1.5rem] transition-all duration-300 group",
                        isCollector 
                            ? "text-emerald-100 hover:text-white hover:bg-emerald-600/50"
                            : "text-slate-400 hover:text-green-400 hover:bg-green-400/10"
                    )}
                >
                    <div className={cn(
                        "p-2 rounded-xl transition-colors",
                        isCollector 
                            ? "bg-emerald-600/50 group-hover:bg-emerald-500"
                            : "bg-green-900/20 group-hover:bg-green-400/20"
                    )}>
                        <LogOut className="h-5 w-5 shrink-0" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">
                        {isCollector ? "Terminate Ops" : "Terminate Session"}
                    </span>
                </button>
            </div>
        </aside>
    );
}
