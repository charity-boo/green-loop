"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCollectorTasks } from "@/hooks/use-collector-tasks";
import { motion } from "framer-motion";
import { 
    ClipboardList, 
    Loader2, 
    Search,
    Filter,
    MapPin
} from "lucide-react";
import { useMemo, useState } from "react";
import ActiveTaskTable from "@/components/dashboard/collector/active-task-table";
import Link from "next/link";
import { WasteStatus } from "@/types/waste-status";

export default function ActiveTasksPage() {
    const { user } = useAuth();
    const { tasks, loading } = useCollectorTasks(user?.uid || '');
    const [searchQuery, setSearchQuery] = useState("");

    const activeTasks = useMemo(() => 
        tasks.filter(t => t.status !== WasteStatus.Completed && t.status !== WasteStatus.Skipped)
        .filter(t => 
            (t.description?.toLowerCase().includes(searchQuery.toLowerCase()) || 
             t.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             t.userName?.toLowerCase().includes(searchQuery.toLowerCase()))
        ), 
    [tasks, searchQuery]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-xs font-black text-foreground uppercase tracking-[0.3em]">Loading Tasks</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Retrieving your active assignments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg text-emerald-600">
                            <ClipboardList className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600">Task Management</span>
                    </div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight italic">
                        Active<span className="text-emerald-600">.Tasks</span>
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Currently assigned collection requests in your region.
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-emerald-200 transition-all">
                        <Filter className="w-4 h-4 text-slate-500" />
                    </button>
                </div>
            </motion.div>

            {/* Task Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500 p-6 rounded-[2rem] text-white shadow-xl shadow-emerald-500/20 flex flex-col justify-between aspect-[2/1] md:aspect-auto">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest opacity-80 mb-1">Total Active</h3>
                        <p className="text-4xl font-black italic">{activeTasks.length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            In Queue
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col justify-between aspect-[2/1] md:aspect-auto">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Ready for Pickups</h3>
                        <p className="text-4xl font-black italic text-foreground">
                            {activeTasks.filter(t => t.status === WasteStatus.Pending).length}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Action</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col justify-between aspect-[2/1] md:aspect-auto">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">In Transit</h3>
                        <p className="text-4xl font-black italic text-foreground">
                            {activeTasks.filter(t => t.status === WasteStatus.Active).length}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Currently Handling</span>
                    </div>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm transition-all hover:border-emerald-200">
                <ActiveTaskTable tasks={activeTasks} />
            </div>

            {/* Support Notice */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                        <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black uppercase tracking-tight italic">Regional Assignment Engine</h3>
                        <p className="text-slate-400 text-xs font-medium max-w-md">
                            Tasks are automatically assigned based on your service region and current workload. To change your service area, visit your settings.
                        </p>
                    </div>
                </div>
                <Link 
                    href="/profile?tab=account"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    Update My Region
                </Link>
            </div>
        </div>
    );
}
