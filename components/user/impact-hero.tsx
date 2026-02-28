"use client";

import { motion } from "framer-motion";
import { Leaf, Globe, TrendingUp } from "lucide-react";

interface ImpactHeroProps {
    totalWeight: number;
    recyclingRate: number;
}

export default function ImpactHero({ totalWeight, recyclingRate }: ImpactHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600/90 to-blue-700/90 p-8 text-white shadow-2xl shadow-emerald-900/20"
        >
            {/* Background Decorative Elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                        <Leaf className="h-3.5 w-3.5 fill-current" />
                        Personal Impact
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight">
                        Total Waste <br />
                        <span className="text-emerald-300">Diverted</span>
                    </h1>
                </div>

                <div className="flex items-end gap-4">
                    <div className="text-right">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50"
                        >
                            {totalWeight.toFixed(1)}
                        </motion.div>
                        <div className="flex items-center justify-end gap-2 text-xl font-bold text-emerald-200">
                            Kilograms (KG)
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xl border border-white/5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-100/60 uppercase tracking-wider">Recycling Rate</p>
                        <p className="text-2xl font-black">{recyclingRate}%</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-xl border border-white/5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-400/20 text-blue-300">
                        <Globe className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-emerald-100/60 uppercase tracking-wider">Globe Health Score</p>
                        <p className="text-2xl font-black">Stable</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
