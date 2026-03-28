"use client";

import { Leaf, Activity } from "lucide-react";

export default function AdminHero() {
    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 transition-colors">
                            <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                            Admin Dashboard
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight transition-colors">
                        System Overview
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 max-w-md transition-colors">
                        Monitor waste collection efficiency, active smart bins, and eco-point distribution across the network.
                    </p>
                </div>

                <div className="flex items-center gap-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100/50 dark:border-emerald-500/20 transition-colors">
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">System Health</span>
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400/80">All services operational</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
