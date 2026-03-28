"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Battery, Box, Activity, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MissionControlHeaderProps {
    collectorName: string;
    collectorZone: string;
    totalWeight: number;
    completionRate: number;
    activeTasks: number;
    completedTasksCount: number;
}

export default function MissionControlHeader({
    collectorName,
    collectorZone,
    totalWeight,
    completionRate,
    activeTasks,
    completedTasksCount
}: MissionControlHeaderProps) {
    // Calculate simulated fuel/battery: 100% - 2% for each completed task
    const fuelLevel = Math.max(0, 100 - (completedTasksCount * 2));
    const payloadPercentage = Math.min(100, (totalWeight / 500) * 100);

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

                <div className="relative z-10 space-y-10">
                    {/* Top Row: Identity & Primary Status */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-[1.5rem] overflow-hidden border-2 border-emerald-500/30 bg-emerald-900/50 shrink-0 shadow-2xl flex items-center justify-center">
                                <Shield className="w-10 h-10 text-emerald-400" />
                                <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-950 animate-ping" />
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
                                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-1 uppercase italic leading-none">
                                    {collectorName.split(' ')[0]}<span className="text-emerald-500">.Ops</span>
                                </h1>
                                <p className="text-emerald-100/40 font-bold uppercase text-[9px] tracking-[0.3em]">
                                    Mission Control Interface v4.0.2
                                </p>
                            </div>
                        </div>

                        {/* Efficiency Gauge */}
                        <div className="flex items-center gap-6 bg-emerald-900/20 p-4 rounded-3xl border border-emerald-800/30">
                            <div className="relative h-16 w-16 flex items-center justify-center">
                                <svg className="h-full w-full rotate-[-90deg]">
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        className="stroke-emerald-900/50 fill-none"
                                        strokeWidth="6"
                                    />
                                    <circle
                                        cx="32"
                                        cy="32"
                                        r="28"
                                        className="stroke-emerald-400 fill-none"
                                        strokeWidth="6"
                                        strokeDasharray={175.9}
                                        strokeDashoffset={175.9 - (175.9 * completionRate) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-xs font-black italic">{completionRate}%</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">Ops Efficiency</p>
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xl font-black italic tracking-tight">{activeTasks} ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Resource Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Cargo Bay Capacity */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Box className="w-3.5 h-3.5" />
                                    <span>Cargo Bay</span>
                                </div>
                                <span className="text-blue-200/60">{totalWeight.toFixed(1)} / 500 KG</span>
                            </div>
                            <div className="relative h-3 w-full bg-emerald-900/50 rounded-full overflow-hidden border border-emerald-800/20">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${payloadPercentage}%` }}
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400"
                                />
                                {/* Progress ticks */}
                                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-px h-full bg-emerald-950/30" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fleet Status (Fuel/Battery) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Battery className="w-3.5 h-3.5" />
                                    <span>Fleet Status</span>
                                </div>
                                <span className={fuelLevel < 20 ? "text-red-400 animate-pulse" : "text-emerald-200/60"}>
                                    {fuelLevel}% ENERGY
                                </span>
                            </div>
                            <div className="relative h-3 w-full bg-emerald-900/50 rounded-full overflow-hidden border border-emerald-800/20">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${fuelLevel}%` }}
                                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                                        fuelLevel < 20 ? 'from-red-600 to-red-400' : 'from-emerald-600 to-emerald-400'
                                    }`}
                                />
                                {/* Progress ticks */}
                                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                                    {[...Array(10)].map((_, i) => (
                                        <div key={i} className="w-px h-full bg-emerald-950/30" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status Bar */}
                <div className="mt-12 pt-8 border-t border-emerald-800/30 flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            <p className="text-[9px] font-black text-emerald-100/30 uppercase tracking-[0.2em]">Telemetry: <span className="text-emerald-400">Stable</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                            <p className="text-[9px] font-black text-emerald-100/30 uppercase tracking-[0.2em]">Uplink: <span className="text-blue-400">Verified</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                            <p className="text-[9px] font-black text-emerald-100/30 uppercase tracking-[0.2em]">Core: <span className="text-amber-400">Optimal</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 bg-emerald-900/30 px-5 py-2.5 rounded-2xl border border-emerald-800/30">
                        <div className="text-right">
                            <p className="text-[8px] font-black text-emerald-500/40 uppercase tracking-[0.3em] leading-none mb-1.5">Encryption Key</p>
                            <p className="text-[10px] font-mono font-bold text-emerald-100/60 tracking-widest">0xCC-MISSION-SIG-V4</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
