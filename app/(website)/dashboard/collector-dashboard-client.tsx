"use client";

import { useState, useMemo } from 'react';
import { useCollectorTasks } from '@/hooks/use-collector-tasks';
import { useAuth } from '@/hooks/use-auth';
import { PerformanceStats } from '@/components/dashboard/collector/performance-stats';
import { JobHistory } from '@/components/dashboard/collector/job-history';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    History, AlertTriangle, TrendingUp,
    WifiOff, Loader2,
    CheckCircle2, Send, Wifi, ArrowRight,
    Activity, Crosshair
} from 'lucide-react';
import { DashboardStats } from '@/components/dashboard/collector/dashboard-stats';
import InteractiveMap from '@/components/dashboard/collector/interactive-map';
import TaskQueue from '@/components/dashboard/collector/task-queue';

type SidebarView = 'overview' | 'history' | 'issues' | 'earnings';

const navItems: { id: SidebarView; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }[] = [
    { id: 'overview', label: 'Overview',            icon: Crosshair,      desc: 'Live tasks & navigation' },
    { id: 'history',  label: 'Job History',         icon: History,        desc: 'Completed collections'  },
    { id: 'issues',   label: 'Report Issue',        icon: AlertTriangle,  desc: 'Report field incidents'    },
    { id: 'earnings', label: 'Earnings',            icon: TrendingUp,     desc: 'Performance rewards'},
];

export default function CollectorDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { tasks, loading, isOffline } = useCollectorTasks(user?.uid || '');

    // Sync activeView with searchParams
    const activeView = (searchParams.get('view') as SidebarView) || 'overview';
    
    const [issueType, setIssueType] = useState('overflow');
    const [issueDesc, setIssueDesc] = useState('');
    const [reportSent, setReportSent] = useState(false);

    const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);
    const activeJob = useMemo(() => tasks.find(t => t.status === 'active'), [tasks]);

    const totalWeight = completedTasks.reduce((acc, t) => acc + (t.weight ?? 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

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

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background transition-colors font-outfit pb-12">
            
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-8">
                
                {/* ── Dashboard Header & Stats ── */}
                <DashboardStats 
                    collectorName={user?.displayName || "Collector"}
                    collectorZone="Ndagani"
                    totalWeight={totalWeight}
                    completionRate={completionRate}
                    activeTasks={activeTasks.length}
                    completedTasksCount={completedTasks.length}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ── Tier 2: Sidebar (Quick Actions) ── */}
                    <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                        
                        {/* Live Status Widget */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-all hover:border-emerald-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">System Status</h3>
                                {isOffline ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 text-[9px] font-bold uppercase">
                                        <WifiOff size={10} /> Offline
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase">
                                        <Wifi size={10} /> Live
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
                                    <Activity size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">Collector_v4.2</p>
                                    <p className="text-[10px] text-muted-foreground font-medium">Session Active</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm transition-all hover:border-emerald-200">
                            <div className="p-2 space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isCurrent = activeView === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => router.push(`/dashboard/collector?view=${item.id}`)}
                                            className={cn(
                                                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative",
                                                isCurrent 
                                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                                                    : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "p-2 rounded-xl transition-colors",
                                                isCurrent ? "bg-white/20" : "bg-muted group-hover:bg-white"
                                            )}>
                                                <Icon size={18} />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold uppercase tracking-widest">{item.label}</p>
                                                <p className={cn(
                                                    "text-[10px] font-medium transition-colors",
                                                    isCurrent ? "text-emerald-100" : "text-muted-foreground/60"
                                                )}>{item.desc}</p>
                                            </div>
                                            {isCurrent && (
                                                <motion.div 
                                                    layoutId="active-indicator"
                                                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active Job Quick Action */}
                        {activeJob && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20 border border-emerald-500/50"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Activity className="w-5 h-5 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">Current Job</span>
                                </div>
                                <h4 className="text-xl font-bold mb-2 tracking-tight">Active Pickup</h4>
                                <p className="text-emerald-100/70 text-xs font-medium mb-6 leading-relaxed">
                                    Proceed to location for waste collection and digital verification.
                                </p>
                                <button
                                    onClick={() => router.push(`/dashboard/active/${activeJob.id}/verify`)}
                                    className="w-full py-3 bg-white text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg shadow-black/5"
                                >
                                    Open Verification <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Tier 3: Main Viewport ── */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeView === 'overview' && (
                                <motion.div 
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 xl:grid-cols-12 gap-8"
                                >
                                    {/* Interactive Map */}
                                    <div className="xl:col-span-8">
                                        <InteractiveMap tasks={tasks} activeTasks={activeTasks} />
                                    </div>

                                    {/* Task Queue */}
                                    <div className="xl:col-span-4 h-[600px]">
                                        <TaskQueue tasks={activeTasks} />
                                    </div>
                                </motion.div>
                            )}

                            {activeView !== 'overview' && (
                                <motion.div 
                                    key="secondary"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden min-h-[600px] flex flex-col transition-all hover:border-emerald-200"
                                >
                                    {/* Panel Header */}
                                    <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm border border-emerald-100/50 text-emerald-600">
                                                {(() => {
                                                    const item = navItems.find(n => n.id === activeView) || navItems[1];
                                                    const Icon = item.icon;
                                                    return <Icon className="w-5 h-5" />;
                                                })()}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-foreground tracking-tight">
                                                    {navItems.find(n => n.id === activeView)?.label || activeView}
                                                </h2>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {navItems.find(n => n.id === activeView)?.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Panel Body */}
                                    <div className="p-8 flex-1">
                                        {activeView === 'history' && <JobHistory tasks={tasks} />}
                                        {activeView === 'earnings' && <PerformanceStats tasks={tasks} />}
                                        {activeView === 'issues' && (
                                            <div className="max-w-2xl mx-auto space-y-8 py-8">
                                                {reportSent ? (
                                                    <div className="text-center py-12">
                                                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                                            <CheckCircle2 className="text-emerald-600" size={40} />
                                                        </div>
                                                        <h3 className="text-2xl font-bold text-foreground tracking-tight">Issue Reported</h3>
                                                        <p className="text-sm text-muted-foreground mt-2 font-medium">Your report has been received. Support will review it shortly.</p>
                                                        <button onClick={() => { setReportSent(false); setIssueDesc(''); }} className="mt-8 px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">New Report</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Issue Category</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {['overflow', 'hazard', 'access', 'other'].map(opt => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => setIssueType(opt)}
                                                                        className={cn(
                                                                            'py-4 px-6 rounded-xl text-[10px] font-bold transition-all border uppercase tracking-widest',
                                                                            issueType === opt 
                                                                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                                                                                : 'bg-card text-muted-foreground border-border hover:border-emerald-200 shadow-sm'
                                                                        )}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Detailed Description</label>
                                                            <textarea
                                                                value={issueDesc}
                                                                onChange={e => setIssueDesc(e.target.value)}
                                                                rows={6}
                                                                placeholder="Describe the issue in detail..."
                                                                className="w-full px-6 py-4 rounded-xl bg-muted/30 border border-border text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                                            />
                                                        </div>
                                                        <button onClick={() => issueDesc.trim() && setReportSent(true)} className="w-full py-5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 hover:bg-emerald-700 transition-colors">
                                                            <Send size={16} /> Submit Issue Report
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
