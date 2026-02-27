"use client";

import React, { useState, useEffect } from 'react';
import { useCollectorTasks } from '@/hooks/use-collector-tasks';
import { TaskCard } from './task-card';
import {
    WifiOff,
    AlertCircle,
    Loader2,
    Inbox,
    RefreshCcw,
    Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase/config';

export const TaskList: React.FC = () => {
    const [uid, setUid] = useState<string | undefined>(auth.currentUser?.uid);
    const { tasks, loading, error, isOffline: isFirestoreOffline } = useCollectorTasks(uid);
    const [isBrowserOffline, setIsBrowserOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUid(user?.uid);
        });

        const handleConnectivity = () => setIsBrowserOffline(!navigator.onLine);
        window.addEventListener('online', handleConnectivity);
        window.addEventListener('offline', handleConnectivity);

        return () => {
            unsubscribe();
            window.removeEventListener('online', handleConnectivity);
            window.removeEventListener('offline', handleConnectivity);
        };
    }, []);

    const showOfflineBanner = isBrowserOffline || isFirestoreOffline;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#10b981] animate-spin" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-[#10b981] blur-xl rounded-full"
                    />
                </div>
                <p className="text-slate-500 font-bold mt-6 tracking-wide italic">INITIALIZING FIELD OPS...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center backdrop-blur-md">
                <AlertCircle className="text-red-500 mb-4" size={40} />
                <h3 className="text-red-600 dark:text-red-400 text-xl font-black uppercase tracking-tighter">Sync Interrupted</h3>
                <p className="text-red-500/80 text-sm mt-2 font-medium max-w-[280px]">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl font-bold text-sm"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    return (
        <div className="pb-24">
            {/* Offline Banner */}
            <AnimatePresence>
                {showOfflineBanner && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-4 rounded-[1.5rem] flex items-center justify-between shadow-xl shadow-amber-500/20">
                            <div className="flex items-center gap-3 text-sm font-bold">
                                <WifiOff size={20} />
                                <div className="flex flex-col">
                                    <span>OFFLINE MODE</span>
                                    <span className="text-[10px] opacity-80 font-medium">Using cached field data</span>
                                </div>
                            </div>
                            <RefreshCcw size={16} className="animate-spin opacity-50" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Summary Area */}
            {tasks.length > 0 && (
                <div className="flex items-center justify-between mb-6 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-emerald-200/40">
                            Live Feed: {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                        </span>
                    </div>
                    <button className="text-[10px] font-bold text-[#10b981] flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        <Navigation size={12} />
                        OPTIMIZE ROUTE
                    </button>
                </div>
            )}

            {/* Task Stack */}
            {tasks.length > 0 ? (
                <div className="flex flex-col space-y-2">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 px-8 text-center bg-white/50 dark:bg-[#064e3b]/20 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-emerald-800/30"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                        <Inbox className="text-[#10b981]" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Zero Waste!</h3>
                    <p className="text-slate-500 dark:text-emerald-100/50 max-w-[240px] mt-2 font-medium">
                        No pending collections in your sector. New requests will appear here instantly.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
