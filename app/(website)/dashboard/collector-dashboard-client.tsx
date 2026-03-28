"use client";

import { useState, useMemo } from 'react';
import { useCollectorTasks } from '@/hooks/use-collector-tasks';
import { useAuth } from '@/hooks/use-auth';
import { PerformanceStats } from '@/components/dashboard/collector/performance-stats';
import { JobHistory } from '@/components/dashboard/collector/job-history';
import { TaskTable } from '@/components/dashboard/collector/task-table';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    ClipboardList, Map, History, AlertTriangle, TrendingUp,
    Scale, Bell, WifiOff, Loader2,
    CheckCircle2, MapPin, Send, Wifi, ArrowRight,
    Navigation, Activity, Crosshair
} from 'lucide-react';
import MissionControlHeader from '@/components/dashboard/collector/mission-control-header';
import TacticalMap from '@/components/dashboard/collector/tactical-map';
import MissionQueue from '@/components/dashboard/collector/mission-queue';

type SidebarView = 'hud' | 'history' | 'issues' | 'earnings';

const navItems: { id: SidebarView; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }[] = [
    { id: 'hud',      label: 'Mission Control',     icon: Crosshair,      desc: 'Tactical HUD & Navigation' },
    { id: 'history',  label: 'Ops History',         icon: History,        desc: 'Completed sorties'  },
    { id: 'issues',   label: 'Incident Reports',    icon: AlertTriangle,  desc: 'Report field issues'    },
    { id: 'earnings', label: 'Incentives',          icon: TrendingUp,     desc: 'Performance rewards'},
];

export default function CollectorDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { tasks, loading, isOffline } = useCollectorTasks(user?.uid || '');

    const [activeView, setActiveView] = useState<SidebarView>('hud');
    const [issueType, setIssueType] = useState('overflow');
    const [issueDesc, setIssueDesc] = useState('');
    const [reportSent, setReportSent] = useState(false);

    const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);
    const activeJob = useMemo(() => tasks.find(t => t.status === 'active' || t.status === 'collected'), [tasks]);

    const totalWeight = completedTasks.reduce((acc, t) => acc + (t.weight ?? 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/50 font-outfit">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
                    <p className="text-emerald-900 font-black text-xs tracking-widest uppercase">Initializing Ops...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/50 font-outfit pb-20 lg:pb-12">
            
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 py-8 space-y-8">
                
                {/* ── Tier 1: Mission Status ── */}
                <MissionControlHeader 
                    collectorName={user?.displayName || "Agent"}
                    collectorZone="Ndagani"
                    totalWeight={totalWeight}
                    completionRate={completionRate}
                    activeTasks={activeTasks.length}
                    completedTasksCount={completedTasks.length}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ── Tier 2: Sidebar (Navigation & Quick Actions) ── */}
                    <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-8">
                        
                        {/* Live Status Widget */}
                        <div className="bg-card rounded-[2rem] p-6 shadow-sm border border-border">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">System Status</h3>
                                {isOffline ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase">
                                        <WifiOff size={12} /> Offline
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">
                                        <Wifi size={12} /> Live Sync
                                    </span>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                {navItems.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveView(id)}
                                        className={cn(
                                            'w-full flex items-center justify-between p-4 rounded-2xl transition-all group',
                                            activeView === id 
                                                ? 'bg-slate-900 text-white shadow-lg' 
                                                : 'bg-muted/50 text-slate-600 hover:bg-slate-100'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                'p-2 rounded-xl',
                                                activeView === id ? 'bg-background/10' : 'bg-card shadow-sm'
                                            )}>
                                                <Icon size={18} />
                                            </div>
                                            <span className="text-sm font-bold">{label}</span>
                                        </div>
                                        {id === 'hud' && activeTasks.length > 0 && (
                                            <span className={cn(
                                                'text-[10px] font-black px-2 py-0.5 rounded-full',
                                                activeView === id ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'
                                            )}>
                                                {activeTasks.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Mission Quick Action */}
                        {activeJob && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-emerald-600 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-200"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <Activity className="w-6 h-6 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Active Engagement</span>
                                </div>
                                <h4 className="text-2xl font-black mb-2 uppercase italic tracking-tighter">Current Target</h4>
                                <p className="text-emerald-100/60 text-xs font-medium mb-8 leading-relaxed">
                                    Location verified. Proceed with waste retrieval and digital signature.
                                </p>
                                <button
                                    onClick={() => router.push(`/dashboard/active/${activeJob.id}/verify`)}
                                    className="w-full py-4 bg-card text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg"
                                >
                                    Open Verification <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Tier 3: Main Viewport ── */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeView === 'hud' && (
                                <motion.div 
                                    key="hud"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="grid grid-cols-1 xl:grid-cols-12 gap-8"
                                >
                                    {/* Tactical Map */}
                                    <div className="xl:col-span-8">
                                        <TacticalMap tasks={tasks} activeTasks={activeTasks} />
                                    </div>

                                    {/* Mission Queue */}
                                    <div className="xl:col-span-4 h-[600px]">
                                        <MissionQueue tasks={activeTasks} />
                                    </div>
                                </motion.div>
                            )}

                            {activeView !== 'hud' && (
                                <motion.div 
                                    key="secondary"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-card rounded-[2.5rem] shadow-sm border border-border overflow-hidden min-h-[600px] flex flex-col"
                                >
                                    {/* Panel Header */}
                                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-muted/50 rounded-2xl">
                                                {(() => {
                                                    const item = navItems.find(n => n.id === activeView)!;
                                                    const Icon = item.icon;
                                                    return <Icon className="w-5 h-5 text-foreground" />;
                                                })()}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                                                    {navItems.find(n => n.id === activeView)?.label}
                                                </h2>
                                                <p className="text-xs text-slate-400 font-medium italic">
                                                    {navItems.find(n => n.id === activeView)?.desc}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden sm:flex items-center gap-2">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Zone_Alpha</span>
                                            <div className="h-4 w-px bg-slate-100" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ready_To_Deploy</span>
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
                                                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
                                                            <CheckCircle2 className="text-emerald-600" size={40} />
                                                        </div>
                                                        <h3 className="text-2xl font-black text-foreground uppercase italic">Report Synchronized</h3>
                                                        <p className="text-sm text-slate-400 mt-2 font-medium">Headquarters has been notified. Stand by for instructions.</p>
                                                        <button onClick={() => { setReportSent(false); setIssueDesc(''); }} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest">New Entry</button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Category</label>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                {['overflow', 'drain', 'hazard', 'access'].map(opt => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => setIssueType(opt)}
                                                                        className={cn(
                                                                            'py-4 px-6 rounded-2xl text-[10px] font-black transition-all border uppercase tracking-widest',
                                                                            issueType === opt ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-card text-slate-400 border-border hover:border-slate-300'
                                                                        )}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observation Log</label>
                                                            <textarea
                                                                value={issueDesc}
                                                                onChange={e => setIssueDesc(e.target.value)}
                                                                rows={6}
                                                                placeholder="LOG_OBSERVATION..."
                                                                className="w-full px-6 py-4 rounded-2xl bg-muted/50 border border-border text-sm font-bold placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase"
                                                            />
                                                        </div>
                                                        <button onClick={() => issueDesc.trim() && setReportSent(true)} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                                                            <Send size={16} /> Broadcast Incident Report
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
