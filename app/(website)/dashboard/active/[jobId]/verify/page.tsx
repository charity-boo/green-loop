'use client';

import { useParams, useRouter } from 'next/navigation';
import { useActiveJob } from '@/hooks/use-active-job';
import { WeightEntry } from '@/components/dashboard/collector/weight-entry';
import { PhotoUpload } from '@/components/dashboard/collector/photo-upload';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerificationPage() {
    const { jobId } = useParams() as { jobId: string };
    const router = useRouter();
    const { job, loading, error, updateJob } = useActiveJob(jobId);

    const [weight, setWeight] = useState<number | null>(null);
    const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
    const [afterUrl, setAfterUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCompleteJob = async () => {
        if (!weight || !beforeUrl || !afterUrl) return;

        setIsSubmitting(true);
        try {
            await updateJob({
                weight,
                beforeImageUrl: beforeUrl,
                afterImageUrl: afterUrl,
                status: 'completed',
                completedAt: new Date().toISOString(),
            } as Record<string, unknown>);

            // Navigate to performance/success view
            router.push('/dashboard?success=true');
        } catch (err) {
            console.error('Failed to complete job:', err);
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 space-y-8 bg-slate-50 dark:bg-[#022c22] min-h-screen font-outfit">
                <div className="flex items-center gap-4 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-[400px] w-full rounded-[2.5rem]" />
                <Skeleton className="h-[300px] w-full rounded-[2.5rem]" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="p-6 text-center bg-slate-50 dark:bg-[#022c22] min-h-screen flex flex-col items-center justify-center font-outfit">
                <p className="text-red-500 mb-6 font-black uppercase tracking-widest">{error || 'Job not found'}</p>
                <Button asChild variant="outline" className="rounded-2xl border-slate-200">
                    <Link href="/dashboard">Return Queue</Link>
                </Button>
            </div>
        );
    }

    const isFormValid = weight !== null && beforeUrl !== null && afterUrl !== null;

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#022c22] text-slate-900 dark:text-white p-4 pb-40 font-outfit transition-colors duration-500">
            <div className="max-w-xl mx-auto space-y-10">
                {/* Mobile Header */}
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="text-slate-700 dark:text-emerald-100 hover:bg-emerald-500/10 rounded-full">
                            <Link href={`/dashboard/active/${jobId}`}>
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight leading-none uppercase italic">Field Audit</h1>
                            <p className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.3em] mt-1">Batch ID: {jobId.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="p-3 bg-[#10b981]/10 rounded-2xl">
                        <ShieldCheck className="w-6 h-6 text-[#10b981]" />
                    </div>
                </div>

                {/* Evidence Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#10b981] flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/30">1</div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Evidence Capture</h2>
                    </div>
                    <div className="bg-white dark:bg-[#064e3b]/20 backdrop-blur-md border border-slate-200 dark:border-emerald-800/10 rounded-[2.5rem] p-8 space-y-10 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <PhotoUpload
                            jobId={jobId}
                            type="before"
                            label="Pre-Collection State"
                            onUploadComplete={setBeforeUrl}
                        />
                        <div className="h-px bg-slate-100 dark:bg-emerald-950/50" />
                        <PhotoUpload
                            jobId={jobId}
                            type="after"
                            label="Post-Collection Verification"
                            onUploadComplete={setAfterUrl}
                        />
                    </div>
                </section>

                {/* Weight Section */}
                <section className="space-y-6 pb-20">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-[#10b981] flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/30">2</div>
                        <h2 className="text-xl font-black uppercase tracking-tighter italic">Payload Audit</h2>
                    </div>
                    <WeightEntry
                        onConfirm={(w) => setWeight(w)}
                        isSubmitting={isSubmitting}
                    />
                </section>

                {/* Global Submission Bar */}
                <AnimatePresence>
                    {isFormValid && (
                        <motion.div
                            initial={{ y: 100, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.9 }}
                            className="fixed bottom-8 left-6 right-6 z-40"
                        >
                            <Button
                                onClick={handleCompleteJob}
                                disabled={isSubmitting}
                                className="w-full h-20 text-xl font-black bg-[#10b981] hover:bg-emerald-600 text-white rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(16,185,129,0.5)] border-t border-white/20 relative overflow-hidden group transition-all"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-4 uppercase tracking-[0.2em]">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Sealing Manifest...</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center gap-4 uppercase tracking-tighter relative z-10 italic">
                                            Finalize Batch Submission
                                            <Send className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-[#10b981] opacity-0 group-hover:opacity-20 transition-opacity" />
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
