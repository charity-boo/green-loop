"use client";

import { motion } from "framer-motion";
import { 
    Activity, 
    Scale, 
    TrendingUp,
    Trophy,
    CheckCircle2,
    Calendar,
    AlertCircle,
    MapPin,
    Zap,
    Clock,
    Truck,
    ShieldCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardsProps {
    type: 'active' | 'history' | 'earnings' | 'issues' | 'default';
    data: {
        totalWeight?: number;
        completionRate?: number;
        activeTasks?: number;
        completedTasksCount?: number;
        totalPoints?: number;
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
        completedTasksCount = 0,
        totalPoints = 0
    } = data;

    const getStats = () => {
        const createStat = (label: string, value: string, icon?: any, color?: string, bg?: string) => ({
            label, value, icon, color, bg
        });

        switch (type) {
            case 'active':
                return [
                    createStat('Active Tasks', activeTasks.toString(), Truck, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Region', 'Ndagani', MapPin, 'text-blue-600', 'bg-blue-50'),
                    createStat('Efficiency', `${completionRate}%`, TrendingUp, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Status', 'On Duty', Zap, 'text-amber-600', 'bg-amber-50'),
                ];
            case 'history':
                return [
                    createStat('Total Tasks', (completedTasksCount + activeTasks).toString(), Calendar, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Weight', `${totalWeight.toFixed(1)}kg`, Scale, 'text-blue-600', 'bg-blue-50'),
                    createStat('Completed', completedTasksCount.toString(), CheckCircle2, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Efficiency', `${completionRate}%`, TrendingUp, 'text-indigo-600', 'bg-indigo-50'),
                ];
            case 'earnings':
                return [
                    createStat('Total Points', totalPoints.toString()),
                ];
            case 'issues':
                return [
                    createStat('Open Issues', '0', AlertCircle, 'text-red-600', 'bg-red-50'),
                    createStat('Resolved', '12', CheckCircle2, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Response', '< 2h', Clock, 'text-blue-600', 'bg-blue-50'),
                    createStat('Rating', '4.9', Trophy, 'text-amber-600', 'bg-amber-50'),
                ];
            default:
                return [
                    createStat('Weight', `${totalWeight.toFixed(1)}kg`, Scale, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Active', activeTasks.toString(), Activity, 'text-blue-600', 'bg-blue-50'),
                    createStat('Completed', completedTasksCount.toString(), CheckCircle2, 'text-emerald-600', 'bg-emerald-50'),
                    createStat('Efficiency', `${completionRate}%`, TrendingUp, 'text-indigo-600', 'bg-indigo-50'),
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
                            {stat.icon && (
                                <div className={cn("p-2 rounded-xl shrink-0", stat.bg, stat.color)}>
                                    <stat.icon size={18} />
                                </div>
                            )}
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
