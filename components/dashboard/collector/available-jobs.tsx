"use client";

import React, { useState } from 'react';
import { CollectorTask } from '@/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Leaf, Recycle, Box, MapPin, CheckCircle2,
    Image as ImageIcon, User, PlusCircle, Loader2, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface AvailableJobsProps {
    jobs: CollectorTask[];
    onAccept?: (jobId: string) => Promise<void>;
}

const typeConfig: Record<string, { bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }> = {
    Organic: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', icon: Leaf, label: 'Organic' },
    Plastic: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: Box, label: 'Plastic' },
    Recyclable: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', icon: Recycle, label: 'Recyclable' },
    Bulky: { bg: 'bg-slate-100 dark:bg-slate-800/30', text: 'text-slate-600 dark:text-slate-400', icon: Box, label: 'Bulky' },
};

export function AvailableJobs({ jobs, onAccept }: AvailableJobsProps) {
    const [acceptingId, setAcceptingId] = useState<string | null>(null);

    const handleAccept = async (jobId: string) => {
        if (!onAccept) return;
        setAcceptingId(jobId);
        try {
            await onAccept(jobId);
            toast.success("Job accepted successfully!");
        } catch (error) {
            console.error("Failed to accept job:", error);
            toast.error("Failed to accept job. It might have been taken.");
        } finally {
            setAcceptingId(null);
        }
    };

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-emerald-800/20 bg-muted/30">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle2 className="text-[#10b981]" size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Pool is Clear!</h3>
                <p className="text-sm text-slate-500 dark:text-emerald-100/40 mt-2 font-medium max-w-[280px]">
                    All requests in your region are currently assigned. Stay on duty and we&apos;ll notify you as soon as new jobs arrive.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="hidden lg:grid grid-cols-[64px_1fr_180px_140px] gap-6 px-4 pb-2 border-b border-slate-100 dark:border-emerald-800/10">
                {['Preview', 'Details', 'Category', 'Action'].map(col => (
                    <p key={col} className="text-[10px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-widest">{col}</p>
                ))}
            </div>

            <div className="space-y-3">
                {jobs.map((job, i) => {
                    const typeKey = (job.type || 'Recyclable') as keyof typeof typeConfig;
                    const config = typeConfig[typeKey] ?? typeConfig.Recyclable;
                    const Icon = config.icon;
                    const isAccepting = acceptingId === job.id;

                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-card hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 border border-border hover:border-emerald-200 dark:hover:border-emerald-700/30 rounded-3xl p-4 transition-all duration-300"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-[64px_1fr_180px_140px] gap-4 lg:gap-6 items-center">
                                {/* Preview */}
                                <div className="relative w-16 h-16 lg:w-16 lg:h-16 rounded-2xl overflow-hidden bg-muted group-hover:ring-4 ring-emerald-500/10 transition-all flex-shrink-0 mx-auto lg:mx-0">
                                    {job.imageUrl ? (
                                        <Image src={job.imageUrl} alt="Waste" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon size={20} className="text-muted-foreground/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="min-w-0 text-center lg:text-left">
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                        <User size={14} className="text-emerald-600/60" />
                                        <p className="font-bold text-sm text-foreground truncate">
                                            {job.userName || 'Resident'} • <span className="text-emerald-600">{job.region || 'Local'}</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center lg:justify-start gap-1 text-xs text-muted-foreground">
                                        <MapPin size={12} className="text-muted-foreground/60" />
                                        <span className="truncate">{job.address || 'Ndagani Area'}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/60 mt-2 font-medium uppercase tracking-wider">
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="flex flex-col items-center lg:items-start gap-2">
                                    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider', config.bg, config.text)}>
                                        <Icon size={12} />
                                        {config.label}
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest px-2">
                                        {job.weight ? `${job.weight}kg` : 'Weight Pending'}
                                    </span>
                                </div>

                                {/* Action */}
                                <div className="flex justify-center lg:justify-end">
                                    {onAccept ? (
                                        <button
                                            disabled={isAccepting}
                                            onClick={() => handleAccept(job.id)}
                                            className={cn(
                                                "w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg",
                                                isAccepting
                                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                            )}
                                        >
                                            {isAccepting ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                <PlusCircle size={14} />
                                            )}
                                            {isAccepting ? "Claiming..." : "Accept Job"}
                                        </button>
                                    ) : (
                                        <div className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            Managed by System
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
