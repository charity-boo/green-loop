'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { ProfileDropdown } from './profile-dropdown';
import { cn } from '@/lib/utils';

interface TopNavProps {
    className?: string;
}

export function TopNav({ className }: TopNavProps) {
    return (
        <header className={cn(
            "h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 transition-colors",
            className
        )}>
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden p-2 hover:bg-accent rounded-lg">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="relative max-w-md w-full hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder="Search dashboard..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-muted-foreground/40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-accent rounded-full relative group transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-background"></span>
                </button>

                <div className="h-8 w-px bg-border mx-2"></div>

                <ProfileDropdown variant="user" showBackToHome={true} showDashboard={false} />
            </div>
        </header>
    );
}
