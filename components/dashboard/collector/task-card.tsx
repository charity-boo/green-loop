"use client";

import React from 'react';
import { CollectorTask } from '@/types';
import {
    Leaf,
    Recycle,
    Box,
    MapPin,
    ChevronRight,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: CollectorTask & { hasPendingWrites?: boolean };
}

const priorityConfig = {
    Organic: {
        color: 'bg-[#D97706]', // Terra Cotta
        icon: Leaf,
        label: 'Organic',
        glow: 'shadow-[#D97706]/20'
    },
    Recyclable: {
        color: 'bg-[#059669]', // Ocean Green
        icon: Recycle,
        label: 'Recyclable',
        glow: 'shadow-[#059669]/20'
    },
    Bulky: {
        color: 'bg-[#4B5563]', // Slate Gray
        icon: Box,
        label: 'Bulky',
        glow: 'shadow-[#4B5563]/20'
    },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    // Map task type to priority config, default to Recyclable
    const typeKey = (task.type || 'Recyclable') as keyof typeof priorityConfig;
    const config = priorityConfig[typeKey] || priorityConfig.Recyclable;
    const Icon = config.icon;
    const hasPendingWrites = task.hasPendingWrites;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={cn(
                "relative overflow-hidden p-5 rounded-3xl mb-4 transition-all duration-300",
                "bg-white/80 dark:bg-[#022c22]/40 backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-xl",
                "hover:shadow-2xl hover:border-[#10b981]/30"
            )}
        >
            {/* Top Section: Badge & Sync Status */}
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white",
                    config.color,
                    config.glow,
                    "shadow-lg"
                )}>
                    <Icon size={14} />
                    {config.label}
                </div>

                {hasPendingWrites && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold animate-pulse">
                        <RefreshCw size={10} className="animate-spin" />
                        SYNCING
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {task.description || "Unclassified Collection"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                            <MapPin size={14} className="text-[#10b981]" />
                        </div>
                        <span className="truncate">Job ID: {task.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/5">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">AI Match</span>
                            <span className="text-base font-black text-[#10b981]">
                                {task.confidence ? `${Math.round(task.confidence * 100)}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Weight</span>
                            <span className="text-base font-black text-slate-700 dark:text-slate-200">
                                {task.price > 0 ? `${task.price}kg` : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <button className="group flex items-center justify-center w-12 h-12 rounded-2xl bg-[#10b981] text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-95">
                        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
