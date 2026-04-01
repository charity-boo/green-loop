'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CollectorTask } from '@/types';
import { Scale, Trophy, CheckCircle2, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
            label: 'Total Points',
            value: totalPoints.toLocaleString(),
            icon: Trophy,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            borderColor: 'border-amber-100',
        },
        {
            label: 'Weight',
            value: `${totalWeight.toFixed(1)}kg`,
            icon: Scale,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
        },
        {
            label: 'Completed',
            value: completedTasks.length.toString(),
            icon: CheckCircle2,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            borderColor: 'border-blue-100',
        },
        {
            label: 'Efficiency',
            value: '94%',
            icon: TrendingUp,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`border-none shadow-sm bg-white hover:shadow-md transition-all rounded-2xl overflow-hidden`}>
                            <CardContent className="p-5 flex flex-col items-center text-center">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} mb-3 border ${stat.borderColor}`}>
                                    <stat.icon size={20} />
                                </div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden relative group">
                <CardContent className="p-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp size={16} className="text-emerald-600" />
                                <h4 className="text-lg font-bold text-slate-900">Weekly Progress</h4>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">You are on track to reach your weekly goal.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-emerald-600 tabular-nums tracking-tight">{totalWeight.toFixed(1)}</span>
                            <span className="text-sm font-bold text-slate-300 ml-2 uppercase tracking-widest">/ 50kg</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>{progress.toFixed(0)}% Completed</span>
                            <span>Target: 50kg</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-slate-100" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
