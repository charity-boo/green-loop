"use client";

import { Trophy, Flame, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SocialMiniBoardProps {
    rank: number;
    totalNeighbors: number;
    percentile: number;
    streak: number;
}

export default function SocialMiniBoard({ rank, totalNeighbors, percentile, streak }: SocialMiniBoardProps) {
    return (
        <Card className="rounded-[2.5rem] border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900">Community Standing</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <Trophy className="h-6 w-6" />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local Rank</p>
                            <p className="text-lg font-black text-slate-900">#{rank} <span className="text-xs font-bold text-slate-400">of {totalNeighbors}</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                            <TrendingUp className="h-4 w-4" />
                            Top {100 - percentile}%
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-1">
                            <Flame className="h-4 w-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
                        </div>
                        <p className="text-2xl font-black text-orange-700">{streak} Days</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <Trophy className="h-4 w-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                        </div>
                        <p className="text-2xl font-black text-blue-700">Elite</p>
                    </div>
                </div>

                <button className="w-full py-4 text-center text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                    View Full Leaderboard
                </button>
            </div>
        </Card>
    );
}
