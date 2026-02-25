'use client';

import React from 'react';
import {
    Users,
    Truck,
    CheckCircle2,
    Clock,
    Target,
    Activity
} from 'lucide-react';
import { KPICard } from '@/components/admin/KPIcard';
import { DashboardKPIs } from '@/lib/admin/analytics';

interface DashboardClientProps {
    kpis: DashboardKPIs;
}

/**
 * DashboardClient
 * Purely for KPI cluster UI assembly and animations.
 */
export function DashboardClient({ kpis }: DashboardClientProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <KPICard
                label="Total Users"
                value={kpis.totalUsers}
                icon={Users}
                iconColor="bg-blue-500"
                trend={{ value: 12, isUp: true }}
            />
            <KPICard
                label="Active Collectors"
                value={kpis.activeCollectors}
                icon={Truck}
                iconColor="bg-indigo-500"
            />
            <KPICard
                label="Pickups Today"
                value={kpis.pickupsToday}
                icon={Activity}
                iconColor="bg-emerald-500"
            />
            <KPICard
                label="Completed"
                value={kpis.completedToday}
                icon={CheckCircle2}
                iconColor="bg-green-500"
            />
            <KPICard
                label="Pending Pickups"
                value={kpis.pendingPickups}
                icon={Clock}
                iconColor="bg-amber-500"
            />
            <KPICard
                label="AI Accuracy"
                value={`${kpis.aiAccuracy}%`}
                icon={Target}
                iconColor="bg-rose-500"
            />
        </div>
    );
}
