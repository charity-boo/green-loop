"use client";

import { 
    Activity, 
    Box, 
    Fuel, 
    MapPin, 
    Scale, 
    TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DashboardStatsProps {
    collectorName: string;
    collectorZone: string;
    totalWeight: number;
    completionRate: number;
    activeTasks: number;
    completedTasksCount: number;
    availableJobsCount?: number;
}

export function DashboardStats({
    collectorName,
    collectorZone,
    totalWeight,
    completionRate,
    activeTasks,
    completedTasksCount,
    availableJobsCount = 0
}: DashboardStatsProps) {
    // Standardizing capacity to 500 KG as per original
    const payloadPercentage = Math.min(100, (totalWeight / 500) * 100);
    const fuelLevel = Math.max(0, 100 - (completedTasksCount * 2));

    return (
        <div className="space-y-6 mb-8">
            {/* Greeting & Quick Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                            {collectorZone} Sector • Active Now
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Hello, {collectorName.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        You&apos;ve completed {completedTasksCount} collections today. {availableJobsCount > 0 ? `There are ${availableJobsCount} jobs available in your area!` : 'Keep it up!'}
                    </p>
                </div>
                
                <div className="hidden lg:flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100/50 dark:border-emerald-500/20">
                        <MapPin size={12} className="text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400/80">Ndagani, Chuka</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Weight Collected */}
                <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 group transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Scale size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                                Weight
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground leading-none">
                                {totalWeight.toFixed(1)} <span className="text-sm text-muted-foreground font-medium">kg</span>
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Total Collected</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                <span>Capacity</span>
                                <span>{payloadPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress value={payloadPercentage} className="h-1 bg-emerald-50" />
                        </div>
                    </CardContent>
                </Card>

                {/* Available Jobs */}
                <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 group transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Box size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                                Job Board
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground leading-none">
                                {availableJobsCount} <span className="text-sm text-muted-foreground font-medium">Open</span>
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Available in Region</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                                availableJobsCount > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            )}>
                                {availableJobsCount > 0 ? 'Urgent Tasks' : 'No New Jobs'}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Jobs */}
                <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 group transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Activity size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                                Status
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground leading-none">
                                {activeTasks} <span className="text-sm text-muted-foreground font-medium">Jobs</span>
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Currently Active</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest">
                                On Schedule
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Efficiency */}
                <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 group transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                                Performance
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground leading-none">
                                {completionRate}%
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Completion Rate</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                <span>Target: 95%</span>
                                <span>{completionRate}%</span>
                            </div>
                            <Progress value={completionRate} className="h-1 bg-emerald-50" />
                        </div>
                    </CardContent>
                </Card>

                {/* Fuel/Battery */}
                <Card className="border border-border shadow-sm bg-card hover:border-emerald-200 group transition-all duration-300">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Fuel size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">
                                Resources
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-foreground leading-none">
                                {fuelLevel}%
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium">Estimated Fuel</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                                <span>Range: 45km</span>
                                <span>{fuelLevel}%</span>
                            </div>
                            <Progress 
                                value={fuelLevel} 
                                className="h-1 bg-emerald-50" 
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
