import React from 'react';

/**
 * KPI Skeleton for Admin Dashboard
 */
export function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="p-6 bg-white rounded-2xl border border-slate-100 animate-pulse h-32 flex flex-col justify-between"
                >
                    <div className="flex justify-between items-start">
                        <div className="h-4 w-24 bg-slate-100 rounded"></div>
                        <div className="h-10 w-10 bg-slate-50 rounded-xl"></div>
                    </div>
                    <div className="h-8 w-16 bg-slate-100 rounded"></div>
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
        <div className="bg-white rounded-xl shadow-sm p-6 w-full h-[400px] border border-slate-100 animate-pulse flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                    <div className="h-5 w-32 bg-slate-100 rounded"></div>
                    <div className="h-3 w-48 bg-slate-50 rounded"></div>
                </div>
                <div className="h-8 w-8 bg-slate-50 rounded-lg"></div>
            </div>

            <div className="flex-1 w-full bg-slate-50/50 rounded-lg flex items-end p-4 gap-2">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-slate-100 rounded-t-sm"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                    ></div>
                ))}
            </div>

            <div className="mt-4 flex justify-between">
                <div className="h-3 w-12 bg-slate-50 rounded"></div>
                <div className="h-3 w-12 bg-slate-50 rounded"></div>
                <div className="h-3 w-12 bg-slate-50 rounded"></div>
            </div>
        </div>
    );
}
