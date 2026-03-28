"use client";

import { CollectorTask } from "@/types";
import { TaskCard } from "./task-card";
import { ClipboardList, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

interface MissionQueueProps {
    tasks: CollectorTask[];
}

export default function MissionQueue({ tasks }: MissionQueueProps) {
    return (
        <div className="flex flex-col h-full bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
            {/* Queue Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-border">
                        <ClipboardList className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-foreground uppercase tracking-tight">Mission Queue</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                            {tasks.length} Active Sorties
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
                        <Search size={16} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {tasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-muted rounded-3xl flex items-center justify-center mb-4 opacity-50">
                            <ClipboardList size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Active Missions</h3>
                        <p className="text-xs text-slate-300 font-medium mt-2">All sectors clear. Awaiting new retrieval requests.</p>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TaskCard task={task} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Queue Footer */}
            <div className="p-6 bg-slate-900 text-white rounded-t-[2rem]">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Queue Priority</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Proximity_Sorted</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${(tasks.length / 10) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
