"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCollectorTasks } from "@/hooks/use-collector-tasks";
import { useUserData } from "@/hooks/use-user-data";
import { DashboardStats } from "@/components/dashboard/collector/dashboard-stats";
import { StatusCards } from "@/components/dashboard/collector/status-cards";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

export default function CollectorLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { loading: userLoading } = useUserData();
    const pathname = usePathname();
    const { tasks, loading: tasksLoading } = useCollectorTasks(user?.uid || '');

    const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);

    const totalWeight = completedTasks.reduce((acc, t) => acc + (t.weight ?? 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const loading = tasksLoading || userLoading;

    const isHome = pathname === '/dashboard/collector';
    const isActivePage = pathname.includes('/active');
    const isHistoryPage = pathname.includes('/history');

    // Determine the type for StatusCards based on the current path
    const getStatusType = () => {
        if (pathname.includes('/active')) return 'active';
        if (pathname.includes('/earnings')) return 'earnings';
        if (pathname.includes('/issues')) return 'issues';
        return 'default';
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-background transition-colors font-outfit">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    <p className="text-emerald-900 dark:text-emerald-100 font-bold text-xs tracking-widest uppercase">Initializing Ops...</p>
                </div>
            </div>
        );
    }

    const totalPoints = completedTasks.length * 50 + Math.floor(totalWeight * 2);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background transition-colors font-outfit pb-12">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8">
                {isHome ? (
                    <DashboardStats 
                        collectorName={user?.displayName || "Collector"}
                        collectorZone="Ndagani"
                        totalWeight={totalWeight}
                        completionRate={completionRate}
                        completedTasksCount={completedTasks.length}
                    />
                ) : (!isActivePage && !isHistoryPage) ? (
                    <StatusCards 
                        type={getStatusType()}
                        data={{
                            totalWeight,
                            completionRate,
                            activeTasks: activeTasks.length,
                            completedTasksCount: completedTasks.length,
                            totalPoints
                        }}
                    />
                ) : null}
                {children}
            </div>
        </div>
    );
    }
