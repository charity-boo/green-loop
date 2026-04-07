"use client";

import React from 'react';
import Link from "next/link";
import { 
    BrainCircuit, 
    Zap, 
    Target,
    Scan,
    ArrowUpRight,
    History,
    CheckCircle2,
    Sparkles,
    Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserDashboardData } from '@/types';

interface AIClassificationClientProps {
    data: UserDashboardData;
}

export default function AIClassificationClient({ data }: AIClassificationClientProps) {
    const { totalClassified, totalAiPoints } = data.metrics.aiStats || { totalClassified: 0, totalAiPoints: 0 };
    const history = data.pickupHistory.filter(item => item.classificationStatus === 'classified');

    return (
        <div className="px-6 py-8 max-w-[1400px] mx-auto space-y-12">
            
            {/* --- AI Intelligence Summary --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-950 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-emerald-900/20">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <BrainCircuit className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">AI Intelligence Stats</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tight mb-2">{totalClassified.toLocaleString()} <span className="text-2xl text-emerald-500 uppercase tracking-widest ml-2">Items</span></h1>
                        <p className="text-emerald-100/70 font-medium mb-8">Successfully identified by our neural network.</p>
                    </div>
                    <div className="pt-8 border-t border-emerald-900/50">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white leading-none mb-1">94.8% Average Accuracy</p>
                                <p className="text-xs text-emerald-400/60 font-medium">Across all Ndagani collection zones</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">AI Bonus Points</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                            {totalAiPoints.toLocaleString()}
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                            Green Points earned specifically for using our smart classification tool.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                +50 Points per item <br />
                                <span className="text-xs text-slate-400 font-medium tracking-normal text-emerald-600">AI Adoption Bonus active</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Classification Features --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: Scan, title: "Real-time Detection", desc: "Powered by Transformers.js for instant results." },
                    { icon: Cpu, title: "Edge Processing", desc: "Optimized for low-bandwidth Ndagani use." },
                    { icon: History, title: "Continuous Learning", desc: "Models updated weekly with community data." }
                ].map((feature, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1">{feature.title}</h3>
                            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- AI Classification History --- */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-950 flex items-center justify-center text-white shadow-lg">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Classification History</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items analyzed by our AI</p>
                        </div>
                    </div>
                    <Link href="/waste" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                        Scan New Item <Scan className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-2">Scan Date</th>
                                <th className="px-6 py-2">Detected Item</th>
                                <th className="px-6 py-2">Category</th>
                                <th className="px-6 py-2 text-right">Points Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="px-6 py-5 bg-slate-50 rounded-l-2xl group-hover:bg-emerald-50/50 transition-colors">
                                        <span className="text-sm font-bold text-slate-600">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900 capitalize">{item.aiWasteType || 'Detected Item'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            {item.wasteType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 rounded-r-2xl text-right group-hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                                            <span className="text-lg font-black tracking-tight">+{item.points}</span>
                                            <Zap className="w-4 h-4 fill-current" />
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No AI classification history available yet. Try our smart scanner to earn extra points!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
