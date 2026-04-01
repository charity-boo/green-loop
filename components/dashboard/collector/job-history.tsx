'use client';

import { motion } from 'framer-motion';
import { CollectorTask } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight, History, CheckCircle2 } from 'lucide-react';
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <History className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No collections yet</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
                    Your completed collection tasks will appear here. Start your first job to see your history!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900">
                        Recent Collections
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                        {completedTasks.length} total
                    </span>
                </div>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest">
                    View Archive
                </button>
            </div>

            <div className="grid gap-3">
                {completedTasks.slice(0, 10).map((task, index) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="border-none shadow-sm bg-white hover:bg-slate-50 transition-colors cursor-pointer group rounded-2xl overflow-hidden">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-white transition-colors">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                                                    {task.aiCategory || task.type || 'General Collection'}
                                                </h4>
                                                <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded bg-emerald-50 text-emerald-700 border-emerald-100">
                                                    +{Math.floor((task.weight || 0) * 2 + 50)} pts
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                <Clock className="w-3 h-3" />
                                                {task.updatedAt ? format(new Date(task.updatedAt), 'MMM d, h:mm a') : 'Recently'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-lg font-black text-slate-900 tabular-nums leading-none mb-1">
                                                {task.weight?.toFixed(1) || 0}<span className="text-xs ml-0.5 text-slate-400 font-bold uppercase">kg</span>
                                            </p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">Weight</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
