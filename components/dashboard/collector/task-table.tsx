"use client";

import Image from 'next/image';
import React from 'react';
import { CollectorTask } from '@/types';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Leaf, Recycle, Box, MapPin, Play, CheckCircle2,
    Image as ImageIcon, User, SkipForward
} from 'lucide-react';
import { WasteStatus } from '@/lib/types/waste-status';

interface TaskTableProps {
    tasks: CollectorTask[];
}

const typeConfig: Record<string, { bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }> = {
    Organic: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: Leaf, label: 'Organic' },
    Plastic: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: Box, label: 'Plastic' },
    Recyclable: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: Recycle, label: 'Recyclable' },
    Bulky: { bg: 'bg-slate-100 dark:bg-slate-800/30', text: 'text-slate-600 dark:text-slate-400', icon: Box, label: 'Bulky' },
};

function StatusButton({ task }: { task: CollectorTask }) {
    const router = useRouter();

    if (task.status === WasteStatus.Completed) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                <CheckCircle2 size={12} />
                Done
            </span>
        );
    }

    if (task.status === WasteStatus.Skipped) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/30 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                <SkipForward size={12} />
                Skipped
            </span>
        );
    }

    if (task.status === WasteStatus.Active || task.status === WasteStatus.Collected) {
        return (
            <button
                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/active/${task.id}/verify`); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-blue-500/20"
            >
                 <CheckCircle2 size={12} />
                Verify
            </button>
        );
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/active/${task.id}`); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-amber-500/20"
        >
            <Play size={12} />
            Start
        </button>
    );
}

export function TaskTable({ tasks }: TaskTableProps) {
    const router = useRouter();

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-emerald-800/20">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-[#10b981]" size={28} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">All Clear</h3>
                <p className="text-sm text-slate-400 dark:text-emerald-100/40 mt-1 font-medium max-w-[200px]">
                    No active tasks. New requests appear here instantly.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Desktop table header */}
            <div className="hidden lg:grid grid-cols-[56px_1fr_150px_130px] gap-4 px-3 pb-2 border-b border-slate-100 dark:border-emerald-800/10 mb-2">
                {['AI Preview', 'Resident / Location', 'Waste Category', 'Action'].map(col => (
                    <p key={col} className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.2em]">{col}</p>
                ))}
            </div>

            <div className="space-y-2">
                {tasks.map((task, i) => {
                    const typeKey = (task.type || 'Recyclable') as keyof typeof typeConfig;
                    const config = typeConfig[typeKey] ?? typeConfig.Recyclable;
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => router.push(`/dashboard/active/${task.id}`)}
                            className="group cursor-pointer bg-slate-50/80 dark:bg-emerald-950/10 hover:bg-white dark:hover:bg-[#064e3b]/30 border border-slate-100 dark:border-emerald-800/10 rounded-2xl p-3 transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-700/20"
                        >
                            {/* ── Mobile layout ── */}
                            <div className="flex items-center gap-3 lg:hidden">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-emerald-900/30 flex-shrink-0">
                                    {task.imageUrl ? (
                                        <Image src={task.imageUrl} alt="Waste preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={16} className="text-slate-400 dark:text-emerald-700" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                        {task.user?.name || 'Unknown Resident'}
                                    </p>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-emerald-100/40 mt-0.5">
                                        <MapPin size={10} />
                                        <span className="truncate">{task.location || 'Ndagani Area'}</span>
                                    </div>
                                    <div className={cn('inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold', config.bg, config.text)}>
                                        <Icon size={10} />
                                        {config.label}
                                    </div>
                                </div>
                                <div onClick={e => e.stopPropagation()}>
                                    <StatusButton task={task} />
                                </div>
                            </div>

                            {/* ── Desktop table row ── */}
                            <div className="hidden lg:grid grid-cols-[56px_1fr_150px_130px] gap-4 items-center">
                                {/* AI Preview */}
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-emerald-900/30 flex-shrink-0 group-hover:ring-2 ring-[#10b981]/20 transition-all">
                                    {task.imageUrl ? (
                                        <Image src={task.imageUrl} alt="Waste preview" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={16} className="text-slate-400 dark:text-emerald-700" />
                                        </div>
                                    )}
                                </div>

                                {/* Resident / Location */}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                                            <User size={11} className="text-slate-400 dark:text-emerald-400/60" />
                                        </div>
                                        <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                            {task.user?.name || 'Unknown Resident'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 dark:text-emerald-100/40 pl-7">
                                        <MapPin size={10} />
                                        <span className="truncate">{task.location || 'Near Chuka University'}</span>
                                    </div>
                                </div>

                                {/* Waste Category */}
                                <div>
                                    <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider', config.bg, config.text)}>
                                        <Icon size={11} />
                                        {config.label}
                                    </div>
                                    {task.confidence && (
                                        <p className="text-[10px] text-slate-400 dark:text-emerald-100/30 mt-1 font-bold pl-1">
                                            {Math.round(task.confidence * 100)}% AI match
                                        </p>
                                    )}
                                </div>

                                {/* Status Action */}
                                <div onClick={e => e.stopPropagation()}>
                                    <StatusButton task={task} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
