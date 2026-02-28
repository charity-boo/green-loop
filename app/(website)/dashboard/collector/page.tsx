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
    QrCode, Scale, User, Bell, WifiOff, Loader2,
    CheckCircle2, MapPin, Send, Wifi, Package
} from 'lucide-react';

type SidebarView = 'tasks' | 'map' | 'history' | 'issues' | 'earnings';

const navItems: { id: SidebarView; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }[] = [
    { id: 'tasks',    label: 'Active Tasks',       icon: ClipboardList,  desc: 'Assigned pickups'   },
    { id: 'map',      label: 'Route Map',           icon: Map,            desc: 'Collection points'  },
    { id: 'history',  label: 'Collection History',  icon: History,        desc: 'Completed pickups'  },
    { id: 'issues',   label: 'Issues / Alerts',     icon: AlertTriangle,  desc: 'Report problems'    },
    { id: 'earnings', label: 'Earnings',            icon: TrendingUp,     desc: 'Incentives & rewards'},
];

const collectionPoints = [
    { name: 'Ndagani Main Point',    status: 'Active',     tasks: 3 },
    { name: 'Muongoni Collection',   status: 'Scheduled',  tasks: 0 },
    { name: 'Near Chuka University', status: 'Active',     tasks: 2 },
    { name: 'Sector 4-B Central',    status: 'Idle',       tasks: 0 },
];

export default function CollectorDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { tasks, loading, isOffline } = useCollectorTasks(user?.uid || '');

    const [activeView, setActiveView]       = useState<SidebarView>('tasks');
    const [issueType, setIssueType]         = useState('overflow');
    const [issueDesc, setIssueDesc]         = useState('');
    const [reportSent, setReportSent]       = useState(false);
    const [weightInput, setWeightInput]     = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');

    const activeTasks    = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'),  [tasks]);
    const activeJob      = useMemo(() => tasks.find(t => t.status === 'active' || t.status === 'collected'), [tasks]);

    const totalWeight    = completedTasks.reduce((acc, t) => acc + (t.weight ?? 0), 0);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f0f4f0] dark:bg-[#011a14] font-outfit">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Loader2 className="w-14 h-14 animate-spin text-[#10b981]" />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-[#10b981] blur-3xl rounded-full"
                        />
                    </div>
                    <p className="text-[#10b981] font-black text-xs tracking-[0.35em] uppercase animate-pulse">Initializing Field-Ops...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4f0] dark:bg-[#011a14] font-outfit text-slate-900 dark:text-white">

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#011a14]/92 backdrop-blur-2xl border-b border-slate-200 dark:border-emerald-900/20">
                <div className="flex items-center justify-between px-4 lg:px-6 h-15 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-black uppercase tracking-tighter leading-none">
                                Ndagani<span className="text-[#10b981]">.Ops</span>
                            </h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 dark:text-emerald-100/40 uppercase tracking-[0.2em]">Zone 4-B Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isOffline ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-wide">
                                <WifiOff size={11} /> Offline
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wide">
                                <Wifi size={11} /> Live
                            </span>
                        )}
                        <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-900/20 transition-colors">
                            <Bell className="w-5 h-5 text-slate-400 dark:text-emerald-100/40" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#011a14]" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-emerald-900/20 transition-colors">
                            <User className="w-5 h-5 text-slate-400 dark:text-emerald-100/40" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── 3-COLUMN BODY ── */}
            <div className="flex min-h-[calc(100vh-3.75rem)]">

                {/* ── LEFT SIDEBAR ── */}
                <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-slate-200 dark:border-emerald-900/20 bg-white dark:bg-[#022c22]/50 sticky top-[3.75rem] h-[calc(100vh-3.75rem)] overflow-y-auto pt-5 pb-6">
                    <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.25em] px-5 mb-3">Navigation</p>
                    <nav className="flex flex-col gap-0.5 px-3">
                        {navItems.map(({ id, label, icon: Icon, desc }) => (
                            <button
                                key={id}
                                onClick={() => setActiveView(id)}
                                className={cn(
                                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group',
                                    activeView === id
                                        ? 'bg-[#10b981] text-white shadow-lg shadow-emerald-500/20'
                                        : 'hover:bg-slate-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-emerald-100/60'
                                )}
                            >
                                <Icon
                                    size={15}
                                    className={activeView === id
                                        ? 'text-white'
                                        : 'text-slate-400 dark:text-emerald-100/40 group-hover:text-[#10b981] transition-colors'}
                                />
                                <div className="min-w-0">
                                    <p className={cn('text-xs font-black leading-none truncate', activeView === id ? 'text-white' : '')}>{label}</p>
                                    <p className={cn('text-[10px] mt-0.5 font-medium', activeView === id ? 'text-white/70' : 'text-slate-400 dark:text-emerald-100/30')}>{desc}</p>
                                </div>
                                {id === 'tasks' && activeTasks.length > 0 && (
                                    <span className={cn('ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0',
                                        activeView === id ? 'bg-white/25 text-white' : 'bg-emerald-100 dark:bg-emerald-900/40 text-[#10b981]')}>
                                        {activeTasks.length}
                                    </span>
                                )}
                                {id === 'issues' && (
                                    <span className={cn('ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0',
                                        activeView === id ? 'bg-white/25 text-white' : 'bg-red-100 dark:bg-red-900/20 text-red-500')}>!</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Zone info */}
                    <div className="mt-auto px-4 pt-4">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-900/20 border border-slate-100 dark:border-emerald-800/20">
                            <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-widest mb-1.5">Assigned Zone</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">Ndagani</p>
                            <p className="text-[10px] text-slate-400 dark:text-emerald-100/30 font-medium mt-0.5">Muongoni Collection Pt.</p>
                        </div>
                    </div>
                </aside>

                {/* ── CENTER CONTENT ── */}
                <main className="flex-1 min-w-0 p-4 lg:p-6 pb-28 lg:pb-8">

                    {/* Metric cards */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                            { label: 'Assigned Jobs', value: activeTasks.length.toString(),    sub: 'Remaining today',    color: 'text-amber-500',    bg: 'bg-amber-50 dark:bg-amber-900/20',       icon: ClipboardList },
                            { label: 'Total Weight',  value: `${totalWeight.toFixed(1)}kg`,    sub: 'Collected today',    color: 'text-[#10b981]',    bg: 'bg-emerald-50 dark:bg-emerald-900/20',   icon: Scale         },
                            { label: 'Completion',    value: `${completionRate}%`,             sub: 'QR-verified rate',   color: 'text-blue-500',     bg: 'bg-blue-50 dark:bg-blue-900/20',         icon: CheckCircle2  },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className="bg-white dark:bg-[#022c22]/60 rounded-2xl p-3.5 border border-slate-100 dark:border-emerald-800/10 shadow-sm"
                            >
                                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-2.5', stat.bg)}>
                                    <stat.icon size={15} className={stat.color} />
                                </div>
                                <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.15em] mt-1 leading-tight">{stat.label}</p>
                                <p className="text-[10px] text-slate-400 dark:text-emerald-100/20 mt-0.5 font-medium hidden sm:block">{stat.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Content panel */}
                    <div className="bg-white dark:bg-[#022c22]/60 rounded-3xl border border-slate-100 dark:border-emerald-800/10 shadow-sm overflow-hidden">
                        {/* Panel header */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-emerald-800/10">
                            {(() => {
                                const item = navItems.find(n => n.id === activeView)!;
                                const Icon = item.icon;
                                return (
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                                            <Icon size={14} className="text-[#10b981]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.label}</h2>
                                            <p className="text-[10px] text-slate-400 dark:text-emerald-100/30 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })()}
                            {activeView === 'tasks' && (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-[9px] font-black tracking-widest uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                                    Live
                                </span>
                            )}
                        </div>

                        {/* Panel body */}
                        <div className="p-5">
                            <AnimatePresence mode="wait">

                                {/* ACTIVE TASKS */}
                                {activeView === 'tasks' && (
                                    <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <TaskTable tasks={activeTasks} />
                                    </motion.div>
                                )}

                                {/* ROUTE MAP */}
                                {activeView === 'map' && (
                                    <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                        <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-emerald-800/20 h-60">
                                            <iframe
                                                title="Ndagani Collection Map"
                                                src="https://maps.google.com/maps?q=Ndagani,Chuka,Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                                className="w-full h-full border-0"
                                                allowFullScreen
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {collectionPoints.map(pt => (
                                                <div key={pt.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-100 dark:border-emerald-800/20">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{pt.name}</p>
                                                            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-emerald-100/30 font-medium">
                                                                <MapPin size={9} />
                                                                {pt.tasks} task{pt.tasks !== 1 ? 's' : ''}
                                                            </div>
                                                        </div>
                                                        <span className={cn('text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0',
                                                            pt.status === 'Active'    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                                            pt.status === 'Scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                                                        'bg-slate-100 dark:bg-slate-800/30 text-slate-500')}>
                                                            {pt.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* COLLECTION HISTORY */}
                                {activeView === 'history' && (
                                    <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <JobHistory tasks={tasks} />
                                    </motion.div>
                                )}

                                {/* ISSUES / ALERTS */}
                                {activeView === 'issues' && (
                                    <motion.div key="issues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                                        {reportSent ? (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                                                    <CheckCircle2 className="text-[#10b981]" size={28} />
                                                </div>
                                                <h3 className="text-base font-black text-slate-900 dark:text-white">Report Sent</h3>
                                                <p className="text-sm text-slate-400 dark:text-emerald-100/40 mt-1">Your issue has been logged and dispatched.</p>
                                                <button
                                                    onClick={() => { setReportSent(false); setIssueDesc(''); }}
                                                    className="mt-5 px-5 py-2 rounded-xl bg-[#10b981] text-white text-sm font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                                >
                                                    New Report
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-500 dark:text-emerald-100/40 uppercase tracking-widest mb-2 block">Issue Type</label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {[
                                                            { val: 'overflow',  label: 'Overflowing Bin'  },
                                                            { val: 'drain',     label: 'Blocked Drain'    },
                                                            { val: 'equipment', label: 'Equipment Need'   },
                                                            { val: 'hazard',    label: 'Hazardous Waste'  },
                                                            { val: 'access',    label: 'Access Blocked'   },
                                                            { val: 'other',     label: 'Other'            },
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.val}
                                                                onClick={() => setIssueType(opt.val)}
                                                                className={cn(
                                                                    'py-2 px-3 rounded-xl text-xs font-bold transition-all text-left border',
                                                                    issueType === opt.val
                                                                        ? 'bg-[#10b981] text-white border-[#10b981] shadow-md shadow-emerald-500/20'
                                                                        : 'bg-slate-50 dark:bg-emerald-950/20 text-slate-600 dark:text-emerald-100/50 border-slate-100 dark:border-emerald-800/20 hover:border-[#10b981]/40'
                                                                )}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-500 dark:text-emerald-100/40 uppercase tracking-widest mb-2 block">Description</label>
                                                    <textarea
                                                        value={issueDesc}
                                                        onChange={e => setIssueDesc(e.target.value)}
                                                        rows={4}
                                                        placeholder="Describe the issue in detail..."
                                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/20 text-sm text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-emerald-100/20 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981]/50 transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => issueDesc.trim() && setReportSent(true)}
                                                    disabled={!issueDesc.trim()}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                                                >
                                                    <Send size={14} />
                                                    Submit Report
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {/* EARNINGS */}
                                {activeView === 'earnings' && (
                                    <motion.div key="earnings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <PerformanceStats tasks={tasks} />
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* ── RIGHT SIDEBAR ── */}
                <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 border-l border-slate-200 dark:border-emerald-900/20 bg-white dark:bg-[#022c22]/50 sticky top-[3.75rem] h-[calc(100vh-3.75rem)] overflow-y-auto pt-5 pb-6 px-4 gap-4">

                    {/* QR Scanner Widget */}
                    <div className="rounded-2xl border border-slate-100 dark:border-emerald-800/20 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-emerald-950/20 px-4 py-2.5 border-b border-slate-100 dark:border-emerald-800/20">
                            <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.2em]">QR Verification</p>
                        </div>
                        <div className="p-4 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-900 dark:bg-emerald-950 flex items-center justify-center shadow-inner">
                                <QrCode className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black text-slate-900 dark:text-white">Scan Resident QR</p>
                                <p className="text-[10px] text-slate-400 dark:text-emerald-100/30 font-medium mt-0.5">Confirm identity &amp; log pickup</p>
                            </div>
                            <button
                                onClick={() => activeJob && router.push(`/dashboard/collector/active/${activeJob.id}/verify`)}
                                disabled={!activeJob}
                                className={cn(
                                    'w-full py-2.5 rounded-xl text-sm font-black transition-all active:scale-[0.98]',
                                    activeJob
                                        ? 'bg-[#10b981] hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                        : 'bg-slate-100 dark:bg-emerald-900/20 text-slate-400 dark:text-emerald-100/30 cursor-not-allowed'
                                )}
                            >
                                {activeJob ? 'Open QR Scanner' : 'No Active Job'}
                            </button>
                        </div>
                    </div>

                    {/* Quick Weight Report */}
                    <div className="rounded-2xl border border-slate-100 dark:border-emerald-800/20 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-emerald-950/20 px-4 py-2.5 border-b border-slate-100 dark:border-emerald-800/20">
                            <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.2em]">Quick Weight Log</p>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <label className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-widest mb-1 block">Task</label>
                                <select
                                    value={selectedTaskId}
                                    onChange={e => setSelectedTaskId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/20 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#10b981]/30"
                                >
                                    <option value="">Select task...</option>
                                    {activeTasks.map(t => (
                                        <option key={t.id} value={t.id}>
                                            #{t.id.slice(0, 6).toUpperCase()} — {t.type || 'General'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-widest mb-1 block">Weight (kg)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={weightInput}
                                        onChange={e => setWeightInput(e.target.value)}
                                        placeholder="0.0"
                                        min="0"
                                        step="0.1"
                                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-800/20 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-[#10b981]/30"
                                    />
                                    <button
                                        disabled={!weightInput || !selectedTaskId}
                                        onClick={() => { setWeightInput(''); setSelectedTaskId(''); }}
                                        className="px-3 py-2 rounded-xl bg-[#10b981] hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all active:scale-[0.98]"
                                    >
                                        <Scale size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collector Profile */}
                    <div className="rounded-2xl border border-slate-100 dark:border-emerald-800/20 overflow-hidden">
                        <div className="bg-slate-50 dark:bg-emerald-950/20 px-4 py-2.5 border-b border-slate-100 dark:border-emerald-800/20">
                            <p className="text-[9px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-[0.2em]">Collector Profile</p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                                    <User size={18} className="text-[#10b981]" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">{user?.displayName || 'Collector'}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-emerald-100/30 font-medium truncate">{user?.email || ''}</p>
                                </div>
                            </div>
                            <div className="space-y-0">
                                {[
                                    { label: 'Status', value: 'On Duty',             dot: true  },
                                    { label: 'Zone',   value: 'Ndagani / 4-B',       dot: false },
                                    { label: 'Shift',  value: '06:00 – 14:00',       dot: false },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-emerald-800/10 last:border-0">
                                        <span className="text-[10px] font-black text-slate-400 dark:text-emerald-100/30 uppercase tracking-wider">{item.label}</span>
                                        <div className="flex items-center gap-1.5">
                                            {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />}
                                            <span className="text-[11px] font-bold text-slate-700 dark:text-emerald-100/70">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </aside>
            </div>

            {/* ── MOBILE BOTTOM NAV ── */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/92 dark:bg-[#011a14]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-emerald-900/20">
                <div className="flex items-center justify-around px-2 py-2.5">
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveView(id)}
                            className={cn(
                                'flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all',
                                activeView === id ? 'text-[#10b981]' : 'text-slate-400 dark:text-slate-600'
                            )}
                        >
                            <Icon size={19} className={activeView === id ? 'scale-110 transition-transform' : ''} />
                            <span className="text-[8px] font-black uppercase tracking-wider">{label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </nav>

        </div>
    );
}
