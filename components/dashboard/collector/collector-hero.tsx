"use client";

import { motion } from "framer-motion";
import { Package, Shield, Zap, TrendingUp, MapPin } from "lucide-react";

interface CollectorHeroProps {
    collectorName: string;
    collectorZone: string;
    totalWeight: number;
    completionRate: number;
    activeTasks: number;
}

export default function CollectorHero({ 
    collectorName, 
    collectorZone, 
    totalWeight, 
    completionRate, 
    activeTasks 
}: CollectorHeroProps) {
    return (
        <div className="relative mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 p-8 md:p-12 text-white shadow-2xl shadow-emerald-900/40 border border-emerald-800/30"
            >
                {/* Animated Background Pulse */}
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" />
                <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px]" />
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    {/* Identity & Status */}
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-[2rem] overflow-hidden border-4 border-emerald-500/20 bg-emerald-900/50 shrink-0 shadow-2xl flex items-center justify-center">
                            <Shield className="w-12 h-12 text-emerald-400" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-950 animate-ping" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                                    Field Agent Active
                                </span>
                                <div className="h-1 w-1 rounded-full bg-emerald-500/40" />
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3" />
                                    {collectorZone} Sector
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase italic">
                                {collectorName.split(' ')[0]}<span className="text-emerald-500">.Ops</span>
                            </h1>
                            <p className="text-emerald-100/40 font-bold max-w-xs leading-relaxed uppercase text-[10px] tracking-widest">
                                Mission-Critical Waste Retrieval & Verification System
                            </p>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6 lg:border-l lg:border-emerald-800/30 lg:pl-12">
                        <CollectorMetric 
                            icon={Package} 
                            value={totalWeight.toFixed(1)} 
                            unit="kg" 
                            label="Total Yield" 
                            color="text-emerald-400"
                        />
                        <CollectorMetric 
                            icon={TrendingUp} 
                            value={`${completionRate}%`} 
                            unit="rate" 
                            label="Efficiency" 
                            color="text-blue-400"
                        />
                        <div className="hidden sm:block">
                            <CollectorMetric 
                                icon={Zap} 
                                value={activeTasks.toString()} 
                                unit="jobs" 
                                label="Queue Status" 
                                color="text-amber-400"
                            />
                        </div>
                    </div>
                </div>

                {/* System Status Bar */}
                <div className="mt-12 pt-8 border-t border-emerald-800/30 flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">GPS: <span className="text-emerald-400">Locked</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em]">Sync: <span className="text-blue-400">Live</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-emerald-900/30 px-4 py-2 rounded-xl border border-emerald-800/30">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest leading-none mb-1">Session Data</p>
                            <p className="text-[10px] font-black text-emerald-100 tracking-widest">VERIFIED_SECURE_V4</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function CollectorMetric({ icon: Icon, value, unit, label, color }: any) {
    return (
        <div className="space-y-1">
            <div className={`flex items-center gap-2 ${color}`}>
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums italic">{value}</span>
                <span className="text-[10px] font-black text-emerald-500/40 uppercase italic">{unit}</span>
            </div>
        </div>
    );
}
