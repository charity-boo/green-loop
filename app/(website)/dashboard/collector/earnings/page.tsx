"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCollectorTasks } from "@/hooks/use-collector-tasks";
import { PerformanceStats } from "@/components/dashboard/collector/performance-stats";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function EarningsPage() {
    const { user } = useAuth();
    const { tasks } = useCollectorTasks(user?.uid || '');

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden min-h-[600px] flex flex-col transition-all hover:border-emerald-200"
        >
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm border border-emerald-100/50 text-emerald-600">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">Earnings</h2>
                        <p className="text-xs text-muted-foreground font-medium">Performance rewards and metrics</p>
                    </div>
                </div>
            </div>
            <div className="p-8 flex-1">
                <PerformanceStats tasks={tasks} />
            </div>
        </motion.div>
    );
}
