'use client';

import Image from 'next/image';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    MapPin,
    Trash2,
    Navigation,
    Clock,
    AlertCircle,
    ChevronLeft,
    Layers
} from 'lucide-react';
import { CollectorTask } from '@/types';
import { useActiveJob } from '@/hooks/use-active-job';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActiveJobPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const { job, loading, error, startJob } = useActiveJob(jobId);

    if (loading) {
        return (
            <div className="p-4 space-y-4 max-w-2xl mx-auto min-h-screen bg-slate-50 dark:bg-[#022c22]">
                <div className="flex items-center gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-[150px] w-full rounded-3xl" />
                <Skeleton className="h-[250px] w-full rounded-3xl" />
                <div className="fixed bottom-6 left-6 right-6">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#022c22] p-6 text-center">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Job Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xs">{error || "This job may have been re-assigned or completed."}</p>
                <Button
                    variant="outline"
                    className="rounded-2xl px-10 border-slate-200"
                    onClick={() => router.push('/dashboard')}
                >
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    // Formatting coordinates for Map deep link
    const extJob = job as CollectorTask & { coordinates?: { latitude: number; longitude: number }; location?: string };
    const coordinates = extJob.coordinates;
    const mapLink = coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(extJob.location || 'Springfield Estate')}`;

    const isActive = job.status === 'active';

    return (
        <div className="min-h-screen pb-28 bg-[#f8fafc] dark:bg-[#022c22] transition-colors duration-500 font-outfit">
            {/* Header Navigation */}
            <div className="sticky top-0 z-20 bg-white/70 dark:bg-[#022c22]/80 backdrop-blur-xl border-b border-slate-200 dark:border-emerald-900/30">
                <div className="flex items-center p-4 max-w-2xl mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="mr-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-full"
                    >
                        <ChevronLeft className="h-6 w-6 text-slate-700 dark:text-emerald-100" />
                    </Button>
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Operation</h1>
                    <div className="ml-auto">
                        <Badge
                            variant={isActive ? "success" : "secondary"}
                            className="rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg"
                        >
                            {job.status}
                        </Badge>
                    </div>
                </div>
            </div>

            <main className="p-4 space-y-6 max-w-2xl mx-auto">
                {/* Destination Card */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-none bg-white dark:bg-[#064e3b]/20 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] overflow-hidden">
                        <div className={`h-2 w-full ${isActive ? 'bg-[#10b981]' : 'bg-slate-300 dark:bg-emerald-900/50'} transition-all duration-700`} />
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-3">Target Location</p>
                                    <div className="flex items-start">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl mr-4">
                                            <MapPin className="h-6 w-6 text-[#10b981]" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-2xl text-slate-900 dark:text-white leading-tight">
                                                {job.location || 'General Area'}
                                            </h4>
                                            <p className="text-sm text-slate-400 dark:text-emerald-100/40 mt-1">Chuka Municipality S-41</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center text-sm font-bold text-slate-500 dark:text-emerald-400/60">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>Due {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <Button
                                    asChild
                                    className="bg-[#10b981] hover:bg-emerald-600 text-white rounded-2xl px-6 h-12 font-bold shadow-lg shadow-emerald-500/20"
                                >
                                    <a href={mapLink} target="_blank" rel="noopener noreferrer">
                                        <Navigation className="h-5 w-5 mr-2" />
                                        Open Maps
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Cargo Specification Card */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-none bg-white dark:bg-[#064e3b]/20 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] p-8">
                        <CardTitle className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em] mb-6">
                            Cargo Assessment
                        </CardTitle>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-800/20">
                                <Trash2 className="h-5 w-5 text-amber-500 mb-3" />
                                <p className="text-slate-400 dark:text-emerald-100/30 text-[10px] font-black uppercase tracking-widest">Type</p>
                                <p className="font-black text-slate-900 dark:text-white text-lg">{job.type || 'Recyclable'}</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-emerald-950/40 border border-slate-100 dark:border-emerald-800/20">
                                <Layers className="h-5 w-5 text-[#10b981] mb-3" />
                                <p className="text-slate-400 dark:text-emerald-100/30 text-[10px] font-black uppercase tracking-widest">AI Suggestion</p>
                                <p className="font-black text-slate-900 dark:text-white text-lg">{job.aiCategory || 'Scanning...'}</p>
                            </div>
                        </div>

                        {job.imageUrl && (
                            <div className="mt-8 relative group rounded-3xl overflow-hidden shadow-2xl" style={{ height: '224px' }}>
                                <Image src={job.imageUrl} alt="Request Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                                    <div className="p-1 px-3 bg-[#10b981] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">Verified Preview</div>
                                    <div className="text-white/80 text-[10px] font-bold">Captured {new Date(job.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Global Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-6 z-30 bg-gradient-to-t from-white via-white/95 dark:from-[#022c22] dark:via-[#022c22]/95 to-transparent pt-10 lg:static lg:bg-transparent lg:p-0">
                    <div className="max-w-2xl mx-auto">
                        {!isActive ? (
                            <Button
                                className="w-full h-20 text-xl font-black bg-[#10b981] hover:bg-emerald-600 text-white rounded-[1.5rem] shadow-2xl shadow-emerald-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                                onClick={startJob}
                            >
                                DEPLOY NOW
                                <ChevronLeft className="h-6 w-6 rotate-180" />
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-20 text-xl font-black bg-[#10b981] hover:bg-emerald-600 text-white rounded-[1.5rem] shadow-2xl shadow-emerald-500/40 transition-all active:scale-[0.98]"
                                onClick={() => router.push(`/dashboard/active/${jobId}/verify`)}
                            >
                                LOG COLLECTION
                            </Button>
                        )}
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <div className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-[#10b981] animate-pulse' : 'bg-slate-300'}`} />
                            <p className="text-[10px] font-black text-slate-400 dark:text-emerald-700 uppercase tracking-[0.2em]">
                                {isActive ? "Operations Ongoing" : "System Ready for Deployment"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
