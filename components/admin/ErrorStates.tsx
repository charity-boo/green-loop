'use client';

import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ChartErrorStateProps {
    title: string;
    onRetry?: () => void;
}

export function ChartErrorState({ title, onRetry }: ChartErrorStateProps) {
    return (
        <div className="bg-card rounded-xl shadow-sm p-6 w-full h-[400px] border border-red-100 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-foreground font-semibold">{title} Unavailable</h3>
                    <p className="text-muted-foreground text-sm max-w-[250px] mx-auto mt-1">
                        We couldn&apos;t load this data. This might be a temporary connection issue.
                    </p>
                </div>
                {onRetry && (
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Retry
                    </button>
                )}
            </div>
        </div>
    );
}

export function KPIErrorState() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 bg-card rounded-2xl border border-red-50 flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-500">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Metric Cluster {i + 1}</p>
                        <p className="text-xs text-red-400 font-medium">Data Sync Failed</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
