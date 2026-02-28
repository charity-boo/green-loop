import React, { Suspense } from 'react';
import { getDashboardKPIs, getWasteTrendData, getWasteDistribution } from '@/lib/firebase/services/analytics';
import { DashboardClient } from './dashboard-client';
import WasteTrendChart from '@/components/admin/WasteTrendChart';
import WasteDistributionChart from '@/components/admin/WasteDistributionChart';
import { KPISkeleton, ChartSkeleton } from '@/components/admin/Skeletons';
import { KPIErrorState, ChartErrorState } from '@/components/admin/ErrorStates';

/**
 * Admin Dashboard Page
 * Orchestrates server-side data fetching with granular Suspense and Error boundaries.
 */
export default async function AdminDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back. Here&apos;s what&apos;s happening today in GreenLoop.</p>
            </div>

            <Suspense fallback={<KPISkeleton />}>
                <KPISection />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Suspense fallback={<ChartSkeleton />}>
                    <WasteTrendSection />
                </Suspense>

                <Suspense fallback={<ChartSkeleton />}>
                    <WasteDistributionSection />
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
