'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CollectorTask } from '@/types';
import { Scale, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';

interface PerformanceStatsProps {
    tasks: CollectorTask[];
}

export function PerformanceStats({ tasks }: PerformanceStatsProps) {
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const totalWeight = completedTasks.reduce((acc, t) => acc + (t.weight || 0), 0);
    const totalPoints = completedTasks.length * 50 + Math.floor(totalWeight * 2);

    // Weekly goal: 50kg
    const weeklyGoal = 50;
    const progress = Math.min((totalWeight / weeklyGoal) * 100, 100);

    const stats = [
        {
            label: 'Job Points',
            value: totalPoints.toLocaleString(),
            icon: Trophy,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
        },
        {
            label: 'Total Weight',
            value: `${totalWeight.toFixed(1)}kg`,
            icon: Scale,
            color: 'text-[#10b981]',
            bg: 'bg-emerald-400/10',
        },
        {
            label: 'Completed',
            value: completedTasks.length.toString(),
            icon: CheckCircle2,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            label: 'Efficiency',
            value: '94%',
            icon: TrendingUp,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
        }
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 bg-white dark:bg-[#064e3b]/20 border-none shadow-xl flex flex-col items-center text-center rounded-[2rem] group hover:scale-[1.05] transition-transform">
                            <div className={`p-4 rounded-2xl ${stat.bg} mb-4 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-[10px] uppercase font-black text-slate-400 dark:text-emerald-100/40 mb-1 tracking-[0.2em]">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="p-8 bg-white dark:bg-[#064e3b]/20 border-none shadow-xl rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-end mb-6 relative z-10">
                    <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 uppercase italic tracking-tighter">Weekly Target</h4>
                        <p className="text-xs text-slate-400 dark:text-emerald-100/40 font-bold">Field-Goal Efficiency: {progress.toFixed(0)}%</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-[#10b981] tabular-nums tracking-tighter">{totalWeight.toFixed(1)}</span>
                        <span className="text-sm font-black text-slate-300 dark:text-emerald-900/50 ml-2 uppercase tracking-tighter">/ 50kg</span>
                    </div>
                </div>
                <div className="relative h-3 w-full bg-slate-100 dark:bg-emerald-950/50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-[#10b981] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                    />
                </div>
            </Card>
        </div>
    );
}
