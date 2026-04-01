"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function IssuesPage() {
    const [issueType, setIssueType] = useState('overflow');
    const [issueDesc, setIssueDesc] = useState('');
    const [reportSent, setReportSent] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden min-h-[600px] flex flex-col transition-all hover:border-emerald-200"
        >
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm border border-emerald-100/50 text-emerald-600">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">Report Issue</h2>
                        <p className="text-xs text-muted-foreground font-medium">Report field incidents or hazards</p>
                    </div>
                </div>
            </div>
            <div className="p-8 flex-1">
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
            </div>
        </motion.div>
    );
}
