'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BarChart3,
    LogOut,
    ShieldCheck,
    ShieldAlert,
    CalendarPlus,
    Loader2,
    Leaf,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Building2,
    Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
    { icon: Bell, label: 'Notifications', href: '/admin/dashboard/notifications' },
    { icon: CalendarPlus, label: 'Pickups', href: '/admin/dashboard/schedules' },
    { icon: ShieldAlert, label: 'Collectors', href: '/admin/dashboard/collectors' },
    { icon: Users, label: 'Users', href: '/admin/dashboard/users' },
    { icon: ShieldCheck, label: 'Moderation', href: '/admin/dashboard/moderation' },
    { icon: BarChart3, label: 'Analytics', href: '/admin/dashboard/analytics' },
];

const contentMenuItems = [
    { label: 'Green Tips', href: '/admin/dashboard/content/green-tips' },
    { label: 'Events & Drives', href: '/admin/dashboard/content/events' },
    { label: 'Community Stories', href: '/admin/dashboard/content/stories' },
    { label: 'Challenges', href: '/admin/dashboard/content/challenges' },
];

const propertyMenuItems = [
    { label: 'Hostels', href: '/admin/dashboard/properties/hostels' },
    { label: 'Apartments', href: '/admin/dashboard/properties/apartments' },
    { label: 'Inquiries', href: '/admin/dashboard/inquiries' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout: signOut } = useAuth();
    const router = useRouter();
    const [signingOut, setSigningOut] = useState(false);
    const [contentExpanded, setContentExpanded] = useState(
        pathname.startsWith('/admin/dashboard/content')
    );
    const [propertiesExpanded, setPropertiesExpanded] = useState(
        pathname.startsWith('/admin/dashboard/properties')
    );

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        router.push('/auth/login');
    };

    const isContentActive = contentMenuItems.some(item => pathname === item.href);
    const isPropertiesActive = propertyMenuItems.some(item => pathname === item.href);

    return (
        <div className="flex flex-col h-full w-64 bg-emerald-700 text-emerald-50 border-r border-emerald-800 transition-colors">
            {/* Logo Section */}
            <div className="flex items-center h-20 px-6 gap-3 border-b border-emerald-600/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-inner">
                    <Leaf className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-white tracking-tight text-lg">
                    Green Loop
                </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-4 mb-2">Core Controls</p>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center h-11 px-4 gap-3 rounded-lg transition-all font-medium text-sm",
                                isActive
                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20"
                                    : "text-emerald-100 hover:bg-emerald-600/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "w-4 h-4 transition-colors",
                                isActive ? "text-white" : "text-emerald-300"
                            )} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}

                <div className="pt-4">
                    <p className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-4 mb-2">Community Content</p>
                    <button
                        onClick={() => setContentExpanded(!contentExpanded)}
                        className={cn(
                            "flex items-center h-11 px-4 gap-3 rounded-lg transition-all font-medium text-sm w-full group",
                            isContentActive 
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                                : "text-emerald-100 hover:bg-emerald-600/50 hover:text-white"
                        )}
                    >
                        <BookOpen className={cn(
                            "w-4 h-4 transition-colors",
                            isContentActive ? "text-white" : "text-emerald-300"
                        )} />
                        <span className="flex-1 text-left">Library</span>
                        {contentExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        )}
                    </button>

                    <AnimatePresence>
                        {contentExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="ml-6 mt-1 border-l border-emerald-600/50 pl-4 space-y-1 overflow-hidden"
                            >
                                {contentMenuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center h-9 px-3 rounded-lg transition-colors text-xs font-medium",
                                                isActive 
                                                    ? "text-white bg-emerald-600/80" 
                                                    : "text-emerald-200 hover:text-white hover:bg-emerald-600/40"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-4">
                    <p className="text-[10px] font-bold text-emerald-200/50 uppercase tracking-widest px-4 mb-2">Operations</p>
                    <button
                        onClick={() => setPropertiesExpanded(!propertiesExpanded)}
                        className={cn(
                            "flex items-center h-11 px-4 gap-3 rounded-lg transition-all font-medium text-sm w-full group",
                            isPropertiesActive 
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" 
                                : "text-emerald-100 hover:bg-emerald-600/50 hover:text-white"
                        )}
                    >
                        <Building2 className={cn(
                            "w-4 h-4 transition-colors",
                            isPropertiesActive ? "text-white" : "text-emerald-300"
                        )} />
                        <span className="flex-1 text-left">Properties</span>
                        {propertiesExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        ) : (
                            <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        )}
                    </button>

                    <AnimatePresence>
                        {propertiesExpanded && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="ml-6 mt-1 border-l border-emerald-600/50 pl-4 space-y-1 overflow-hidden"
                            >
                                {propertyMenuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center h-9 px-3 rounded-lg transition-colors text-xs font-medium",
                                                isActive 
                                                    ? "text-white bg-emerald-600/80" 
                                                    : "text-emerald-200 hover:text-white hover:bg-emerald-600/40"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-emerald-600/50">
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-emerald-200 hover:text-white hover:bg-rose-500/20 rounded-lg transition-all text-sm font-medium group"
                >
                    {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
                    <span>{signingOut ? 'Signing Out...' : 'Sign Out'}</span>
                </button>
            </div>
        </div>
    );
}
