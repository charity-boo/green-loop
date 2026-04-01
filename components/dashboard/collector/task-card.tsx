"use client";

import React from 'react';
import { CollectorTask } from '@/types';
import {
    Leaf,
    Recycle,
    Box,
    MapPin,
    ChevronRight,
    RefreshCw,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCardProps {
    task: CollectorTask & { hasPendingWrites?: boolean };
}

const typeConfig = {
    Organic: {
        color: 'bg-amber-50 text-amber-600 border-amber-100',
        icon: Leaf,
        label: 'Organic'
    },
    Recyclable: {
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        icon: Recycle,
        label: 'Recyclable'
    },
    Bulky: {
        color: 'bg-slate-50 text-slate-600 border-slate-100',
        icon: Box,
        label: 'Bulky'
    },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const router = useRouter();
    const typeKey = (task.type || 'Recyclable') as keyof typeof typeConfig;
    const config = typeConfig[typeKey] || typeConfig.Recyclable;
    const Icon = config.icon;
    const hasPendingWrites = task.hasPendingWrites;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            onClick={() => router.push(`/dashboard/active/${task.id}`)}
            className={cn(
                "group relative overflow-hidden p-5 rounded-3xl mb-4 transition-all duration-300 cursor-pointer",
                "bg-white border border-slate-100 shadow-sm",
                "hover:shadow-md hover:border-emerald-200"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                    config.color
                )}>
                    <Icon size={12} />
                    {config.label}
                </div>

                {hasPendingWrites ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black animate-pulse">
                        <RefreshCw size={10} className="animate-spin" />
                        SYNCING
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <Clock size={10} />
                        Just now
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400">R</span>
                        </div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            {task.user?.name || task.userName || "Unknown Resident"}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                        {task.description || "Unclassified Collection"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                        <MapPin size={12} className="text-slate-400" />
                        <span className="truncate">{task.location || "Ndagani Sector"}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Confidence</span>
                            <span className="text-sm font-black text-emerald-600">
                                {task.confidence ? `${Math.round(task.confidence * 100)}%` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase text-slate-400 font-bold tracking-widest">Est. Weight</span>
                            <span className="text-sm font-black text-slate-700">
                                {task.price > 0 ? `${task.price}kg` : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
