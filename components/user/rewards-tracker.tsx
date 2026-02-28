"use client";

import { motion } from "framer-motion";
import { Zap, Award, Star, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RewardsTrackerProps {
    points: number;
    nextMilestone: number;
    progress: number;
    tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

const tierConfig = {
    Bronze: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    Silver: { color: "text-slate-300", bg: "bg-slate-500/10", border: "border-slate-500/20" },
    Gold: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    Platinum: { color: "text-indigo-300", bg: "bg-indigo-500/10", border: "border-indigo-500/20" }
};

export default function RewardsTracker({ points, nextMilestone, progress, tier }: RewardsTrackerProps) {
    const config = tierConfig[tier];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col h-full rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
        >
            <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${config.bg} ${config.border} border ${config.color} text-xs font-black uppercase tracking-widest`}>
                        <Award className="w-3.5 h-3.5" />
                        {tier} Tier
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Zap className="w-4 h-4 fill-current" />
                        Live Points
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-slate-500 font-medium mb-1 uppercase tracking-tight text-xs">Total Balance</p>
                    <h3 className="text-5xl font-black text-slate-900 leading-none">{points.toLocaleString()}</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-slate-400">Next Milestone: {nextMilestone.toLocaleString()}</span>
                        <span className="text-sm font-black text-emerald-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-lg shadow-emerald-500/20"
                        />
                    </div>
                </div>
            </div>

            <button className="w-full py-6 px-8 bg-slate-900 text-white font-bold flex items-center justify-between group hover:bg-slate-800 transition-colors">
                <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span>Redeem Vouchers</span>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
}
