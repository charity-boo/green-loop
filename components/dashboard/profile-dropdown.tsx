'use client';

import React, { useState } from 'react';
import {
    User,
    ChevronDown,
    LogOut,
    Settings,
    Shield,
    Loader2,
    LayoutDashboard,
    Home
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProfileDropdownProps {
    className?: string;
    variant?: 'admin' | 'user' | 'collector';
    showBackToHome?: boolean;
    showDashboard?: boolean;
}

export function ProfileDropdown({ 
    className, 
    variant = 'user',
    showBackToHome = false,
    showDashboard = true
}: ProfileDropdownProps) {
    const { user, role, logout: signOut } = useAuth();
    const [signingOut, setSigningOut] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setSigningOut(true);
        try {
            await signOut();
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setSigningOut(false);
        }
    };

    const isCollector = variant === 'collector';
    const isAdmin = variant === 'admin';

    return (
        <div className={cn("flex items-center gap-4", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "flex items-center gap-3 p-1 pl-2 rounded-full transition-all border border-transparent focus:outline-none",
                        "hover:bg-accent hover:border-border/50 transition-colors"
                    )}>
                        <div className={cn(
                            "flex flex-col items-end hidden sm:flex",
                            "text-foreground"
                        )}>
                            <span className="text-sm font-semibold leading-none truncate max-w-[120px]">
                                {user?.displayName || (isCollector ? 'Field Collector' : isAdmin ? 'Admin User' : 'User')}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest leading-none",
                                    isCollector ? "text-emerald-500" : "text-emerald-600 dark:text-emerald-400"
                                )}>
                                    {role || (isCollector ? 'COLLECTOR' : isAdmin ? 'ADMIN' : 'USER')}
                                </span>
                                <span className={cn(
                                    "text-[10px] truncate max-w-[150px]",
                                    "text-muted-foreground"
                                )}>
                                    • {user?.email}
                                </span>
                            </div>
                        </div>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0 border transition-colors",
                            isCollector 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        )}>
                            {user?.photoURL ? (
                                <Image 
                                    src={user.photoURL} 
                                    alt={user.displayName || "Profile"} 
                                    width={32} 
                                    height={32} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {showBackToHome && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href="/" className="flex items-center">
                                <Home className="mr-2 h-4 w-4" />
                                <span>Back to Home</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {showDashboard && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link 
                                href={isAdmin ? "/admin/dashboard" : isCollector ? "/dashboard/collector" : "/dashboard"} 
                                className="flex items-center"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>{isAdmin ? "Admin Dashboard" : isCollector ? "Collector Dashboard" : "Dashboard"}</span>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile?tab=account" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile?tab=settings" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/profile?tab=security" className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Security</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{signingOut ? 'Signing out...' : 'Sign out'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {signingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
