"use client";

import { useState } from 'react';
import { useCollectorTasks } from '@/hooks/use-collector-tasks';
import { TaskList } from '@/components/dashboard/collector/task-list';
import { PerformanceStats } from '@/components/dashboard/collector/performance-stats';
import { JobHistory } from '@/components/dashboard/collector/job-history';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ClipboardList,
    BarChart3,
    Loader2,
    WifiOff,
    LayoutDashboard,
    Bell,
    User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CollectorDashboard() {
    const { user } = useAuth();
    const { tasks, loading, error, isOffline } = useCollectorTasks(user?.uid || '');
    const [activeTab, setActiveTab] = useState('tasks');

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#022c22] font-outfit">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 animate-spin text-[#10b981]" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-[#10b981] blur-3xl rounded-full"
                        />
                    </div>
                    <p className="text-[#10b981] font-black text-sm tracking-[0.3em] uppercase italic animate-pulse">Initializing Field-Ops...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#022c22] text-slate-900 dark:text-white font-outfit transition-colors duration-500 pb-32">
            {/* Premium Dynamic Header */}
            <header className="sticky top-0 z-40 bg-white/70 dark:bg-[#022c22]/80 backdrop-blur-2xl border-b border-slate-200 dark:border-emerald-900/10 px-6 py-6 font-outfit">
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#10b981] shadow-lg shadow-emerald-500/40 flex items-center justify-center">
                            <LayoutDashboard className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter italic leading-none">
                                Ndagani<span className="text-[#10b981] opacity-80">.Ops</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 dark:text-emerald-100/40 uppercase tracking-[0.2em]">Sector 4-B Active</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-slate-50 dark:bg-emerald-950/40 text-slate-400 dark:text-emerald-100/30 rounded-2xl hover:text-[#10b981] transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                        </button>
                        <button className="p-3 bg-slate-50 dark:bg-emerald-950/40 text-slate-400 dark:text-emerald-100/30 rounded-2xl">
                            <UserIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-10">
                <Tabs defaultValue="tasks" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-[#064e3b]/20 backdrop-blur-xl border border-slate-200 dark:border-emerald-800/10 p-2 rounded-[1.5rem] mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <TabsTrigger
                            value="tasks"
                            className="rounded-2xl py-4 data-[state=active]:bg-[#10b981] data-[state=active]:text-white data-[state=active]:shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 transition-all duration-500"
                        >
                            <ClipboardList className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-[0.1em]">Target Queue</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="performance"
                            className="rounded-2xl py-4 data-[state=active]:bg-[#10b981] data-[state=active]:text-white data-[state=active]:shadow-2xl shadow-emerald-500/40 flex items-center justify-center gap-3 transition-all duration-500"
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-black text-xs uppercase tracking-[0.1em]">Unit Analytics</span>
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="tasks" key="tasks">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-8 px-2">
                                    <h2 className="text-[10px] font-black text-slate-400 dark:text-emerald-100/40 uppercase tracking-[0.3em]">Field Deployment Feed</h2>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-[10px] font-black tracking-widest">
                                        <Circle className="w-2 h-2 fill-current" />
                                        LIVE
                                    </div>
                                </div>
                                <TaskList />
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="performance" key="performance">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <PerformanceStats tasks={tasks} />
                                <JobHistory tasks={tasks} />
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </main>

            {/* Floating Tactical Navigation */}
            <nav className="fixed bottom-8 left-6 right-6 z-50 pointer-events-none">
                <div className="max-w-md mx-auto h-20 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl border border-slate-200 dark:border-emerald-800/10 rounded-[2rem] flex items-center justify-around px-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] pointer-events-auto">
                    <button
                        onClick={() => setActiveTab('tasks')}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'tasks' ? 'text-[#10b981] scale-110' : 'text-slate-400 dark:text-emerald-950 hover:text-slate-600 dark:hover:text-emerald-700'}`}
                    >
                        <ClipboardList className={`w-7 h-7 ${activeTab === 'tasks' ? 'fill-emerald-500/10' : ''}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Feed</span>
                    </button>

                    <div className="relative -mt-16 group">
                        <div className="absolute inset-0 bg-[#10b981] blur-2xl rounded-full opacity-40 animate-pulse" />
                        <button className="w-16 h-16 bg-[#10b981] rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-4 border-white dark:border-[#0a0a0a] transition-transform active:scale-90 relative z-10 group-hover:-translate-y-2 duration-300">
                            <Circle className="w-8 h-8 text-white fill-white/20" />
                        </button>
                    </div>

                    <button
                        onClick={() => setActiveTab('performance')}
                        className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'performance' ? 'text-[#10b981] scale-110' : 'text-slate-400 dark:text-emerald-950 hover:text-slate-600 dark:hover:text-emerald-700'}`}
                    >
                        <BarChart3 className={`w-7 h-7 ${activeTab === 'performance' ? 'fill-emerald-500/10' : ''}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Stats</span>
                    </button>
                </div>
            </nav>

            {/* Global Connectivity Banner */}
            <AnimatePresence>
                {isOffline && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-3 shadow-xl backdrop-blur-md border border-white/20">
                            <WifiOff className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Local Mode Active</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Circle({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10" className="opacity-30" />
        </svg>
    );
}
