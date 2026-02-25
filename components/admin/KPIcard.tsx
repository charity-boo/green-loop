'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
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
    iconColor = "bg-emerald-500"
}: KPICardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>

                    {trend && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className={cn(
                                "text-xs font-semibold px-1.5 py-0.5 rounded-md",
                                trend.isUp ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
                            )}>
                                {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-slate-400">vs last month</span>
                        </div>
                    )}
                </div>

                <div className={cn(
                    "p-3 rounded-xl text-white",
                    iconColor
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );
}
