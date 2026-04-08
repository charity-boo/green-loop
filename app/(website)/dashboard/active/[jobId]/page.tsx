'use client';

import Image from 'next/image';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    MapPin,
    Clock,
    AlertCircle,
    ChevronLeft,
    Phone
} from 'lucide-react';
import { useActiveJob } from '@/hooks/use-active-job';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function ActiveJobPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as string;
    const { job, loading, error, startJob } = useActiveJob(jobId);

    if (loading) {
        return (
            <div className="p-4 space-y-4 max-w-2xl mx-auto min-h-screen bg-white">
                <div className="flex items-center gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-[200px] w-full rounded-2xl" />
                <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center">
                <div className="p-4 bg-red-50 rounded-full mb-6 text-red-500">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Operation Halted</h2>
                <p className="text-slate-500 mb-10 max-w-xs">{error || "Task no longer available in the active queue."}</p>
                <Button
                    variant="outline"
                    className="rounded-xl px-10"
                    onClick={() => router.push('/dashboard/collector')}
                >
                    Return to Dashboard
                </Button>
            </div>
        );
    }

    const isActive = job.status === 'active';

    return (
        <div className="min-h-screen pb-32 bg-white font-outfit">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="rounded-full hover:bg-slate-50"
                        >
                            <ChevronLeft size={24} className="text-slate-600" />
                        </Button>
                        <h1 className="text-base font-bold text-slate-900 uppercase tracking-tight">Operation Detail</h1>
                    </div>
                    <Badge
                        variant={isActive ? "success" : "secondary"}
                        className="rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                    >
                        {job.status}
                    </Badge>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-1">
                    <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        {isActive ? "Operations Ongoing" : "System Ready for Deployment"}
                    </p>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Resident & Destination Info */}
                    <Card className="border-none shadow-none bg-slate-50/50 rounded-3xl p-6">
                        <CardContent className="p-0 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resident</p>
                                    <h4 className="text-xl font-black text-slate-900 leading-none">
                                        {job.user?.name || job.userName || 'Resident'}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Code: {job.id.slice(-6).toUpperCase()}</p>
                                </div>
                                {job.userPhone && (
                                    <Button asChild variant="outline" className="rounded-2xl h-10 w-10 p-0 border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600">
                                        <a href={`tel:${job.userPhone}`}>
                                            <Phone size={18} />
                                        </a>
                                    </Button>
                                )}
                            </div>

                            <div className="h-px bg-slate-200/50" />

                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Location</p>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-600" />
                                    <h4 className="text-xl font-black text-slate-900 leading-none">
                                        {job.location || 'Ndagani Sector'}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Clock size={12} className="text-slate-400" />
                                    <p className="text-xs font-bold text-slate-400">
                                        Received {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Request Preview Image (Simplified) */}
                    {job.imageUrl && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Preview</p>
                            <div className="relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-64">
                                <Image src={job.imageUrl} alt="Request Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest opacity-80">
                                        Captured {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Primary Action Button */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent pt-12 z-40">
                    <div className="max-w-2xl mx-auto">
                        {!isActive ? (
                            <Button
                                className="w-full h-16 text-lg font-black bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                                onClick={startJob}
                            >
                                DEPLOY OPERATION
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                                onClick={() => router.push(`/dashboard/active/${jobId}/verify`)}
                            >
                                LOG COLLECTION
                            </Button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
