'use client';

import { useParams, useRouter } from 'next/navigation';
import { useActiveJob } from '@/hooks/use-active-job';
import { WeightEntry } from '@/components/dashboard/collector/weight-entry';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerificationPage() {
    const { jobId } = useParams() as { jobId: string };
    const router = useRouter();
    const { job, loading, error, completeJob } = useActiveJob(jobId);

    const [weight, setWeight] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pointsEarned, setPointsEarned] = useState<number | null>(null);

    const handleCompleteJob = async () => {
        if (!weight) return;

        setIsSubmitting(true);
        try {
            const result = await completeJob(weight);
            setPointsEarned(result.pointsEarned);
        } catch (err) {
            console.error('Failed to complete job:', err);
            setIsSubmitting(false);
        }
    };

    if (pointsEarned !== null) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-outfit">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-8 max-w-sm w-full"
                >
                    <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Log Complete</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Collection Recorded</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex flex-col items-center mb-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Points Earned</span>
                            <span className="text-5xl font-black text-emerald-600">+{pointsEarned}</span>
                        </div>
                        <div className="h-px bg-slate-200/50 w-full mb-4" />
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400 uppercase tracking-wider text-[10px]">Logged Weight</span>
                            <span className="text-slate-900">{weight} kg</span>
                        </div>
                    </div>

                    <Button 
                        asChild
                        className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
                    >
                        <Link href="/dashboard/collector">Return to Queue</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6 space-y-8 bg-white min-h-screen font-outfit max-w-2xl mx-auto">
                <div className="flex items-center gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-[300px] w-full rounded-3xl" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="p-6 text-center bg-white min-h-screen flex flex-col items-center justify-center font-outfit">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-slate-600 mb-6 font-bold uppercase tracking-widest text-sm">{error || 'Job not found'}</p>
                <Button asChild variant="outline" className="rounded-xl border-slate-200">
                    <Link href="/dashboard/collector">Return to Queue</Link>
                </Button>
            </div>
        );
    }

    const isFormValid = weight !== null && weight > 0;

    return (
        <div className="min-h-screen bg-white text-slate-900 p-4 pb-40 font-outfit">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-slate-50 text-slate-600">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-slate-900">Collection Log</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {jobId.slice(-6).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Weight Section */}
                <section className="space-y-4">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Enter Payload</h2>
                        <p className="text-2xl font-black text-slate-900 leading-tight">How much weight was collected?</p>
                    </div>
                    
                    <div className="bg-slate-50/50 rounded-3xl p-2 border border-slate-100">
                        <WeightEntry
                            onConfirm={(w) => setWeight(w)}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </section>

                {/* Submission Bar */}
                <AnimatePresence>
                    {isFormValid && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-12 z-40"
                        >
                            <div className="max-w-2xl mx-auto">
                                <Button
                                    onClick={handleCompleteJob}
                                    disabled={isSubmitting}
                                    className="w-full h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-3 uppercase tracking-widest text-sm">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-3 uppercase tracking-wide">
                                            Submit Collection
                                            <Send className="w-5 h-5" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
