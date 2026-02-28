'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Truck,
    BarChart3,
    LogOut,
    Leaf,
    Calendar,
    Activity,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
    { icon: Truck, label: 'Pickups', href: '/admin/dashboard/pickups' },
    { icon: Users, label: 'Users', href: '/admin/dashboard/users' },
    { icon: ShieldCheck, label: 'Moderation', href: '/admin/dashboard/moderation' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/dashboard/analytics' },
    { icon: Calendar, label: 'Schedules', href: '/admin/dashboard/schedules' },
    { icon: Activity, label: 'Audit Logs', href: '/admin/dashboard/audit' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout: signOut } = useAuth();
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        router.push('/auth/login');
    };

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-white border-r border-slate-800">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-lg">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">GreenLoop</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:text-white hover:bg-slate-800/50",
                                isActive && "bg-emerald-600/10 text-emerald-400 border border-emerald-600/20"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-colors",
                                isActive ? "text-emerald-400" : "group-hover:text-emerald-400"
                            )} />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>

            {/* Logging out overlay */}
            {signingOut && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-xl">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-white font-medium text-lg">Signing out…</p>
                        <p className="text-slate-400 text-sm">Please wait a moment</p>
                    </div>
                </div>
            )}
        </div>
    );
}
