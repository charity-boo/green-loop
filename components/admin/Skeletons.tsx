import React from 'react';

/**
 * KPI Skeleton for Admin Dashboard
 */
export function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="p-6 bg-card rounded-xl border border-slate-50 animate-pulse h-28 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="h-3 w-20 bg-slate-100 rounded"></div>
                        <div className="h-8 w-8 bg-muted/50 rounded-lg"></div>
                    </div>
                    <div className="h-6 w-16 bg-slate-100 rounded"></div>
                </div>
            ))}
        </div>
    );
}

/**
 * Chart Skeleton for Admin Dashboard
 */
export function ChartSkeleton() {
    return (
        <div className="bg-card rounded-xl shadow-sm p-6 w-full h-[350px] border border-slate-50 animate-pulse flex flex-col">
            <div className="h-4 w-32 bg-slate-100 rounded mb-6"></div>
            <div className="flex-1 w-full bg-muted/50 rounded-lg flex items-end p-4 gap-2">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-slate-100 rounded-t"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
