'use client';

import React, { useState } from 'react';
import {
    Search,
    Bell,
    User,
    ChevronDown,
    Menu,
    LogOut,
    Settings,
    Shield,
    Loader2
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

export function TopNav() {
    const { user, logout: signOut } = useAuth();
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

    return (
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
                    <Menu className="w-5 h-5 text-slate-600" />
                </button>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-100 rounded-full relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-2"></div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 p-1 pl-2 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200 focus:outline-none">
                            <div className="flex flex-col items-end hidden sm:flex">
                                <span className="text-sm font-semibold text-slate-900 leading-none truncate max-w-[120px]">
                                    {user?.displayName || 'Admin User'}
                                </span>
                                <span className="text-xs text-slate-500 truncate max-w-[150px]">
                                    {user?.email || 'System Administrator'}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                <User className="w-5 h-5" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-2">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Security</span>
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
            </div>

            {signingOut && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-xl">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-white font-medium text-lg">Signing out…</p>
                        <p className="text-slate-400 text-sm">Please wait a moment</p>
                    </div>
                </div>
            )}
        </header>
    );
}