"use client";

import { Package, Shield, Zap, TrendingUp } from "lucide-react";

interface CollectorHeroProps {
    collectorName: string;
    collectorZone: string;
    totalWeight: number;
    completionRate: number;
    activeTasks: number;
}

export default function CollectorHero({ 
    collectorName, 
    collectorZone, 
    totalWeight, 
    completionRate, 
    activeTasks 
}: CollectorHeroProps) {
    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 transition-colors">
                            <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                            Collector Dashboard • {collectorZone} Sector
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight transition-colors">
                        Operations Overview
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1 max-w-md transition-colors">
                        Welcome back, {collectorName}. Monitor your pickup efficiency and active collection queue.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <CollectorMetric 
                        icon={Package} 
                        value={totalWeight.toFixed(1)} 
                        unit="kg" 
                        label="Total Weight" 
                    />
                    <div className="h-10 w-px bg-border hidden sm:block"></div>
                    <CollectorMetric 
                        icon={TrendingUp} 
                        value={`${completionRate}%`} 
                        unit="" 
                        label="Efficiency" 
                    />
                    <div className="h-10 w-px bg-border hidden sm:block"></div>
                    <CollectorMetric 
                        icon={Zap} 
                        value={activeTasks.toString()} 
                        unit="tasks" 
                        label="Active Queue" 
                    />
                </div>
            </div>
        </div>
    );
}

interface CollectorMetricProps {
    icon: React.ElementType;
    value: string;
    unit?: string;
    label: string;
}

function CollectorMetric({ icon: Icon, value, unit, label }: CollectorMetricProps) {
    return (
        <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
                {unit && <span className="text-[10px] font-medium text-muted-foreground uppercase">{unit}</span>}
            </div>
        </div>
    );
}
