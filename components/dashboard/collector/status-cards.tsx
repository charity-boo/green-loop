"use client";

import { motion } from "framer-motion";
import { 
    Activity, 
    Box, 
    Scale, 
    TrendingUp,
    Trophy,
    CheckCircle2,
    Calendar,
    AlertCircle,
    MapPin,
    Zap,
    Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { CollectorTask } from "@/types";

interface StatusCardsProps {
    type: 'available' | 'history' | 'earnings' | 'issues' | 'default';
    data: {
        totalWeight?: number;
        completionRate?: number;
        activeTasks?: number;
        availableJobsCount?: number;
        completedTasksCount?: number;
        totalPoints?: number;
        jobs?: CollectorTask[];
    };
}

export function StatusCards({
    type,
    data
}: StatusCardsProps) {
    const {
        totalWeight = 0,
        completionRate = 0,
        activeTasks = 0,
        availableJobsCount = 0,
        completedTasksCount = 0,
        totalPoints = 0,
        jobs = []
    } = data;

    const getStats = () => {
        switch (type) {
            case 'available':
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                const urgentCount = jobs.filter(job => new Date(job.createdAt) < oneDayAgo).length;

                return [
                    { label: 'Jobs Open', value: availableJobsCount.toString(), icon: Box, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Urgent', value: urgentCount.toString(), icon: Zap, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Region', value: 'Ndagani', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Network', value: 'Stable', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                ];
            case 'history':
                return [
                    { label: 'Total Tasks', value: (completedTasksCount + activeTasks).toString(), icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Weight', value: `${totalWeight.toFixed(1)}kg`, icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Completed', value: completedTasksCount.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Efficiency', value: `${completionRate}%`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ];
            case 'earnings':
                return [
                    { label: 'Total Points', value: totalPoints.toString(), icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Weight Sum', value: `${totalWeight.toFixed(1)}kg`, icon: Scale, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Success', value: `${completionRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Status', value: 'Verified', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ];
            case 'issues':
                return [
                    { label: 'Open Issues', value: '0', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Resolved', value: '12', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Response', value: '< 2h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Rating', value: '4.9', icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
                ];
            default:
                return [
                    { label: 'Weight', value: `${totalWeight.toFixed(1)}kg`, icon: Scale, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Jobs', value: availableJobsCount.toString(), icon: Box, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Active', value: activeTasks.toString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Efficiency', value: `${completionRate}%`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ];
        }
    };

    const stats = getStats();

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 transition-all duration-300 rounded-2xl overflow-hidden">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={cn("p-2 rounded-xl shrink-0", stat.bg, stat.color)}>
                                <stat.icon size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-lg font-black text-foreground tracking-tight leading-none">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
