"use client";

import { useAuth } from "@/hooks/use-auth";
import { useUserData } from "@/hooks/use-user-data";
import { useAvailableJobs } from "@/hooks/use-available-jobs";
import { AvailableJobs } from "@/components/dashboard/collector/available-jobs";
import { motion } from "framer-motion";
import { ClipboardList, Info, Loader2 } from "lucide-react";

export default function AvailablePage() {
    const { user } = useAuth();
    const { region, loading: userLoading } = useUserData();
    const { availableJobs, loading: jobsLoading } = useAvailableJobs(user?.uid || '', region || undefined);

    const loading = userLoading || jobsLoading;

    return (
        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden transition-all hover:border-emerald-200"
            >
                <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm border border-emerald-100/50 text-emerald-600">
                            <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Auto Assignment</h2>
                            <p className="text-xs text-muted-foreground font-medium">System-managed job allocation</p>
                        </div>
                    </div>
                </div>
                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading status...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 shrink-0">
                                    <Info className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground">Manual Claiming is Disabled</h3>
                                    <p className="text-muted-foreground text-sm">
                                        Green Loop now uses a <strong>Region-Based Auto Assignment</strong> system. 
                                        Jobs are automatically assigned to the active collector with the least workload in their matching region.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-muted/50 p-6 rounded-2xl border border-border w-full space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Region Status:</h4>
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold text-sm border border-emerald-200/50">
                                        {region || 'Region Not Set'}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        {availableJobs.length} unassigned jobs in your area.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {!loading && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Available Pool <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{availableJobs.length}</span>
                        </h3>
                    </div>
                    <AvailableJobs jobs={availableJobs} />
                </div>
            )}
        </div>
    );
}
