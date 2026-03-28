'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
    iconColor?: string;
}

export function KPICard({
    label,
    value,
    icon: Icon,
    trend,
    className,
}: KPICardProps) {
    return (
        <div
            className={cn(
                "p-6 bg-card rounded-xl border border-border shadow-sm transition-all hover:border-emerald-200 group",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        {label}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">
                        {value}
                    </h3>

                    {trend && (
                        <div className="flex items-center gap-1.5 mt-3">
                            <span className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                                trend.isUp 
                                    ? "text-emerald-700 bg-emerald-50" 
                                    : "text-rose-700 bg-rose-50"
                            )}>
                                {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                        </div>
                    )}
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
