'use client';

import { motion } from 'framer-motion';
import { CollectorTask } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Scale, ArrowRight, History } from 'lucide-react';
import { format } from 'date-fns';

interface JobHistoryProps {
    tasks: CollectorTask[];
}

export function JobHistory({ tasks }: JobHistoryProps) {
    const completedTasks = tasks
        .filter(t => t.status === 'completed')
        .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

    if (completedTasks.length === 0) {
        return (
            <Card className="p-16 bg-white dark:bg-[#064e3b]/10 border-2 border-dashed border-slate-200 dark:border-emerald-900/40 rounded-[2.5rem] text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <History className="w-8 h-8 text-slate-300 dark:text-emerald-900" />
                </div>
                <p className="text-slate-400 dark:text-emerald-100/30 font-bold uppercase tracking-widest text-[10px]">No historical data found</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                    Operation Log
                    <span className="text-[10px] bg-[#10b981] text-white px-3 py-1 rounded-full not-italic font-black tracking-[0.1em]">
                        {completedTasks.length}
                    </span>
                </h3>
                <button className="text-[10px] font-black text-[#10b981] uppercase tracking-widest border-b-2 border-transparent hover:border-[#10b981] transition-all pb-1">Archive</button>
            </div>

            <div className="space-y-3">
                {completedTasks.slice(0, 10).map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="p-5 bg-white dark:bg-[#064e3b]/20 border-none shadow-lg dark:shadow-none hover:bg-emerald-50 dark:hover:bg-[#064e3b]/40 rounded-3xl transition-all group group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/20 group-hover:scale-110 transition-transform">
                                        <Scale className="w-6 h-6 text-[#10b981]" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-black text-base text-slate-900 dark:text-white tracking-tight italic">
                                                {task.aiCategory || 'General Collection'}
                                            </h4>
                                            <Badge variant="success" className="text-[8px] font-black px-2 py-0.5 rounded-full border-none shadow-sm">
                                                +{Math.floor((task.weight || 0) * 2 + 50)} PTS
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-emerald-100/30 mt-1 uppercase tracking-tighter">
                                            <Clock className="w-3.5 h-3.5" />
                                            {task.updatedAt ? format(new Date(task.updatedAt), 'MMM d • h:mm a') : 'Recently'}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-5">
                                    <div>
                                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{task.weight?.toFixed(1) || 0}kg</p>
                                        <p className="text-[8px] text-slate-400 dark:text-emerald-900 font-black uppercase tracking-widest">Payload</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-200 dark:text-emerald-900 group-hover:text-[#10b981] group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
