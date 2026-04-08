'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CollectorTask } from '@/types';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell 
} from 'recharts';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';

interface PerformanceStatsProps {
    tasks: CollectorTask[];
}

export function PerformanceStats({ tasks }: PerformanceStatsProps) {
    const completedTasks = tasks.filter(t => t.status === 'completed');

    const totalWeight = completedTasks.reduce((acc, t) => acc + (t.weight || 0), 0);
    const totalPoints = completedTasks.length * 50 + Math.floor(totalWeight * 2);

    // Weekly Progress Chart Data
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(startOfCurrentWeek, i);
        const dayTasks = completedTasks.filter(t => {
            const taskDate = t.updatedAt ? parseISO(t.updatedAt) : (t.createdAt ? parseISO(t.createdAt) : new Date());
            return isSameDay(taskDate, day);
        });
        const weight = dayTasks.reduce((acc, t) => acc + (t.weight || 0), 0);
        return {
            day: format(day, 'EEE'),
            weight: weight,
            fullDate: format(day, 'MMM dd'),
        };
    });

    const thisWeekWeight = weeklyData.reduce((acc, d) => acc + d.weight, 0);

    const stats = [
        {
            label: 'Total Points',
            value: totalPoints.toLocaleString(),
        },
        {
            label: 'Weight',
            value: `${totalWeight.toFixed(1)}kg`,
        },
        {
            label: 'Completed',
            value: completedTasks.length.toString(),
        },
        {
            label: 'Efficiency',
            value: '94%',
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold text-slate-900">Weekly Performance</h4>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Daily weight collection for the current week</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Weekly Total</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-emerald-600 tabular-nums tracking-tight">{thisWeekWeight.toFixed(1)}</span>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const value = Number(payload[0]?.value ?? 0);
                                            return (
                                                <div className="bg-white p-3 shadow-xl border border-slate-100 rounded-2xl">
                                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-widest">
                                                        {payload[0].payload.fullDate}
                                                    </p>
                                                    <p className="text-lg font-black text-emerald-600">
                                                        {value.toFixed(1)} <span className="text-xs font-bold text-slate-300 ml-1">kg</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="weight" 
                                    fill="#10b981" 
                                    radius={[6, 6, 0, 0]} 
                                    barSize={32}
                                >
                                    {weeklyData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={isSameDay(addDays(startOfCurrentWeek, index), new Date()) ? '#059669' : '#10b981'}
                                            fillOpacity={entry.weight > 0 ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
