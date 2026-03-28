'use client';

import React from 'react';
import {
    Search,
    Bell,
    Menu,
    Plus,
} from 'lucide-react';
import { ProfileDropdown } from '@/components/dashboard/profile-dropdown';
import { Button } from '@/components/ui/button';

export function TopNav() {
    return (
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50 transition-colors">
            <div className="flex items-center gap-6 flex-1">
                <button className="md:hidden p-2 hover:bg-accent rounded-lg">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="relative max-w-sm w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-1.5 bg-muted/50 border-none rounded-lg text-sm focus:ring-1 focus:ring-emerald-500 transition-all font-normal placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button 
                    className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg px-4 h-9 text-xs font-semibold transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add New Bin
                </Button>

                <button className="p-2 hover:bg-accent rounded-lg relative transition-colors text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-background"></span>
                </button>

                <div className="h-6 w-px bg-border"></div>

                <ProfileDropdown variant="admin" showBackToHome={true} showDashboard={false} />
            </div>
        </header>
    );
}
