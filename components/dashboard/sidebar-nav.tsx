"use client";

import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";

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
    const { user, signOut } = useAuth();

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 z-40 flex flex-col bg-slate-900 text-white shadow-2xl">
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0 gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
                    <Image src="/images/logo.png" alt="Green Loop" width={28} height={28} className="rounded-lg" />
                </div>
                <span className="font-black text-sm tracking-tight whitespace-nowrap">Green Loop</span>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center h-11 px-4 gap-3 transition-colors ${
                                isActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <Icon className="h-5 w-5 shrink-0" />
                            <span className="text-sm font-semibold">{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: User + Sign Out */}
            <div className="border-t border-white/10 p-3 shrink-0 space-y-1">
                {user && (
                    <div className="flex items-center gap-3 px-1 py-2 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black uppercase">
                            {(user.displayName ?? user.email ?? "U").charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{user.displayName ?? "User"}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 w-full h-10 px-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-semibold">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
