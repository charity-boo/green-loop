"use client";

import { motion } from "framer-motion";
import { Zap, Scale, Trophy } from "lucide-react";

interface StatCardsProps {
    points: number;
    totalWeight: number;
    rank: number;
    totalNeighbors: number;
    tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

const tierColors: Record<string, string> = {
    Bronze: "text-orange-500 bg-orange-50 border-orange-200",
    Silver: "text-slate-500 bg-slate-50 border-slate-200",
    Gold: "text-amber-500 bg-amber-50 border-amber-200",
    Platinum: "text-indigo-500 bg-indigo-50 border-indigo-200",
};

const cards = [
    {
        key: "points",
        label: "Green Points",
        icon: Zap,
        iconBg: "bg-emerald-100 text-emerald-600",
    },
    {
        key: "weight",
        label: "Waste Sorted",
        icon: Scale,
        iconBg: "bg-blue-100 text-blue-600",
    },
    {
        key: "rank",
        label: "Impact Rank",
        icon: Trophy,
        iconBg: "bg-amber-100 text-amber-600",
    },
];

export default function StatCards({ points, totalWeight, rank, totalNeighbors, tier }: StatCardsProps) {
    const values = {
        points: { main: points.toLocaleString(), sub: "total points earned" },
        weight: { main: `${totalWeight.toFixed(1)} kg`, sub: "successfully sorted" },
        rank: { main: `#${rank}`, sub: `of ${totalNeighbors} neighbours` },
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cards.map(({ key, label, icon: Icon, iconBg }, i) => (
                <motion.div
                    key={key}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 shadow-sm px-6 py-5"
                >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">
                            {values[key as keyof typeof values].main}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-400">{values[key as keyof typeof values].sub}</p>
                            {key === "rank" && (
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${tierColors[tier]}`}>
                                    {tier}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
