"use client";

import { 
    MapPin, 
    Scale, 
    TrendingUp 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsProps {
    collectorName: string;
    collectorZone: string;
    totalWeight: number;
    completionRate: number;
    completedTasksCount: number;
}

export function DashboardStats({
    collectorName,
    collectorZone,
    totalWeight,
    completionRate,
    completedTasksCount
}: DashboardStatsProps) {
    // Standardizing capacity to 500 KG as per original
    const payloadPercentage = Math.min(100, (totalWeight / 500) * 100);

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
                        You&apos;ve completed {completedTasksCount} collections today. Keep up the great work!
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
        </div>
    );
}
