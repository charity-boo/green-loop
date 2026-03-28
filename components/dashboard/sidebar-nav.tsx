"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-provider";
import {
    LayoutDashboard,
    CalendarPlus,
    Scan,
    Star,
    MapPin,
    Settings,
    LogOut,
    Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Schedule Pickup", icon: CalendarPlus, href: "/schedule-pickup" },
    { label: "AI Sorting", icon: Scan, href: "/learning-hub" },
    { label: "Green Points", icon: Star, href: "/rewards-program" },
    { label: "Maps & Sites", icon: MapPin, href: "/service-areas" },
    { label: "Settings/Support", icon: Settings, href: "/report" },
];

export default function SidebarNav() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 z-40 flex flex-col bg-slate-900 text-white shadow-2xl border-r border-white/5">
            {/* Logo Section */}
            <div className="flex items-center h-24 px-8 border-b border-white/5 shrink-0 gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                    <Activity className="text-white w-6 h-6" />
                </div>
                <div>
                    <span className="font-black text-lg tracking-tighter uppercase italic leading-none block">
                        Green<span className="text-emerald-500">.Loop</span>
                    </span>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1 block">OS_CORE_V2</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-8 px-4 overflow-y-auto space-y-2">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] px-4 mb-4">Operations</p>
                {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center h-12 px-4 gap-3 rounded-2xl transition-all duration-300",
                                isActive
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "text-slate-400 hover:bg-background/5 hover:text-white"
                            )}
                        >
                            <Icon className={cn(
                                "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-white" : "text-muted-foreground group-hover:text-emerald-400"
                            )} />
                            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: User & Sign Out */}
            <div className="border-t border-white/5 p-6 mt-auto bg-slate-950/50">
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-4 px-4 py-4 w-full text-muted-foreground hover:text-rose-400 hover:bg-rose-400/10 rounded-[1.5rem] transition-all duration-300 group"
                >
                    <div className="p-2 rounded-xl bg-card/5 group-hover:bg-rose-400/20 transition-colors">
                        <LogOut className="h-5 w-5 shrink-0" />
                    </div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em]">Terminate Session</span>
                </button>
            </div>
        </aside>
    );
}
