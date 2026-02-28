"use client";

import { motion } from "framer-motion";
import { TreePine, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";

interface CarbonSavingsPulseProps {
    co2Saved: number;
    treesEquivalent: number;
}

export default function CarbonSavingsPulse({ co2Saved, treesEquivalent }: CarbonSavingsPulseProps) {
    return (
        <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl relative overflow-hidden h-full">
            {/* Background Animation */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-6">
                        <Wind className="h-3.5 w-3.5 text-emerald-400" />
                        Carbon Impact
                    </div>
                    
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.1em] mb-1">Total CO2 Diverted</h3>
                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                            {co2Saved.toFixed(1)}
                        </span>
                        <span className="text-xl font-bold text-slate-500">KG</span>
                    </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center gap-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400"
                    >
                        <TreePine className="h-8 w-8" />
                    </motion.div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Equivalent To</p>
                        <p className="text-2xl font-black text-white">
                            {treesEquivalent} <span className="text-sm font-bold text-emerald-400">Trees Planted</span>
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">Offsetting carbon for 1 full year</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
