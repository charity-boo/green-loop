'use client';

import React from 'react';
import {
    Users,
    Trash2,
    Coins,
    Zap,
} from 'lucide-react';
import { KPICard } from '@/components/admin/KPIcard';
import type { DashboardKPIs } from '@/lib/firebase/services/analytics';

interface DashboardClientProps {
    kpis: DashboardKPIs;
}

export function DashboardClient({ kpis }: DashboardClientProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <KPICard
                label="Waste Collected"
                value={`${(kpis.pickupsToday * 12.5).toFixed(1)}kg`}
                icon={Trash2}
                trend={{ value: 8, isUp: true }}
            />
            <KPICard
                label="Smart Bins"
                value={Math.floor(kpis.totalUsers / 10) + 12}
                icon={Zap}
            />
            <KPICard
                label="Eco-Points"
                value={(kpis.completedToday * 150).toLocaleString()}
                icon={Coins}
                trend={{ value: 24, isUp: true }}
            />
            <KPICard
                label="Active Users"
                value={kpis.totalUsers}
                icon={Users}
            />
        </div>
    );
}
