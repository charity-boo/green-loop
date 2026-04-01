import React, { Suspense } from 'react';
import { getDashboardKPIs, getWasteTrendData, getWasteDistribution } from '@/lib/firebase/services/analytics';

export const dynamic = 'force-dynamic';

import { DashboardClient } from './dashboard-client';
import WasteTrendChart from '@/components/admin/WasteTrendChart';
import WasteDistributionChart from '@/components/admin/WasteDistributionChart';
import { KPISkeleton, ChartSkeleton } from '@/components/admin/Skeletons';
import { KPIErrorState, ChartErrorState } from '@/components/admin/ErrorStates';
import AdminHero from '@/components/admin/admin-hero';

/**
 * Admin Dashboard Page
 * Minimal and simple layout using White & Green theme.
 */
export default async function AdminDashboardPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto py-6">

            <AdminHero />

            <Suspense fallback={<KPISkeleton />}>
                <KPISection />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Suspense fallback={<ChartSkeleton />}>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Weekly Collection Trends</h3>
                        </div>
                        <WasteTrendSection />
                    </div>
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm transition-colors">
                        <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Waste Type Distribution</h3>
                        </div>
                        <WasteDistributionSection />
                    </div>
                </Suspense>
            </div>
        </div>
    );
}

/**
 * KPI Section Component
 */
async function KPISection() {
    try {
        const kpis = await getDashboardKPIs();
        return <DashboardClient kpis={kpis} />;
    } catch (_error) {
        return <KPIErrorState />;
    }
}

/**
 * Waste Trend Section Component
 */
async function WasteTrendSection() {
    try {
        const trendData = await getWasteTrendData();
        return <WasteTrendChart data={trendData} />;
    } catch (_error) {
        return <ChartErrorState title="Waste Trend" />;
    }
}

/**
 * Waste Distribution Section Component
 */
async function WasteDistributionSection() {
    try {
        const distributionData = await getWasteDistribution();
        return <WasteDistributionChart data={distributionData} />;
    } catch (_error) {
        return <ChartErrorState title="Waste Distribution" />;
    }
}
