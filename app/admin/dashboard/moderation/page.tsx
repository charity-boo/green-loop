'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { IssueModerationCard, WasteModerationCard } from '@/components/admin/ModerationCards';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  LayoutGrid, 
  Layers,
  Search,
  CheckCircle2,
  Clock,
  Loader2,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportDoc {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  issueType: string;
  location?: string;
  dateTime?: string;
  description: string;
  preferredContact?: string;
  imageFile?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

interface WasteReportDoc {
  id: string;
  userId: string;
  userName: string;
  imageUrl: string;
  status: 'PENDING' | 'CLASSIFIED' | 'AI_REVIEW' | 'AI_FAILED' | 'MODERATED';
  classification?: {
    wasteType: string;
    confidence: number;
    labels: string[];
  };
  adminComment?: string;
  createdAt: string;
  updatedAt?: string;
}

type ActiveTab = 'issues' | 'ai-review';

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('issues');
  const [issueReports, setIssueReports] = useState<ReportDoc[]>([]);
  const [wasteReports, setWasteReports] = useState<WasteReportDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === 'ai-review') {
        params.set('type', 'waste');
        if (statusFilter) params.set('status', statusFilter);
      } else {
        params.set('type', 'issues');
        if (statusFilter) params.set('status', statusFilter);
      }
      const res = await fetch(`/api/admin/moderation?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (activeTab === 'issues') {
        setIssueReports(data);
      } else {
        setWasteReports(data);
      }
    } catch (error) {
      console.error('Error fetching moderation data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusFilter = (status: string | 'ALL') => {
    setStatusFilter(status === 'ALL' ? '' : status);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
            Content Moderation
          </h1>
          <p className="text-slate-500 mt-1">Review user-submitted reports and oversee AI waste classification.</p>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
          <button 
            onClick={() => { setActiveTab('issues'); setStatusFilter('PENDING'); }}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'issues' 
                ? "bg-white text-slate-900 shadow-lg ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            Issue Reports
          </button>
          <button 
            onClick={() => { setActiveTab('ai-review'); setStatusFilter('AI_REVIEW'); }}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2 rounded-xl text-sm font-bold transition-all",
              activeTab === 'ai-review' 
                ? "bg-white text-slate-900 shadow-lg ring-1 ring-slate-200" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <Cpu className="w-4 h-4" />
            AI Review
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-2 md:pb-0">
          <div className="flex items-center gap-2 mr-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter by
          </div>
          
          {(activeTab === 'issues' ? [
            { label: 'Pending', value: 'PENDING', icon: Clock },
            { label: 'In Progress', value: 'IN_PROGRESS', icon: Loader2 },
            { label: 'Resolved', value: 'RESOLVED', icon: CheckCircle2 },
            { label: 'All', value: 'ALL', icon: Layers },
          ] : [
            { label: 'Review Needed', value: 'AI_REVIEW', icon: Cpu },
            { label: 'Classified', value: 'CLASSIFIED', icon: CheckCircle2 },
            { label: 'Moderated', value: 'MODERATED', icon: ShieldCheck },
            { label: 'All', value: 'ALL', icon: Layers },
          ]).map((item) => (
            <button
              key={item.value}
              onClick={() => handleStatusFilter(item.value)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm",
                (statusFilter === item.value || (item.value === 'ALL' && !statusFilter))
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
             <ShieldCheck className="w-6 h-6 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-slate-500 font-bold text-sm tracking-wide animate-pulse">Scanning Secure Repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'issues' ? (
            issueReports.length > 0 ? (
              issueReports.map(report => (
                <IssueModerationCard key={report.id} report={report} onUpdate={fetchData} />
              ))
            ) : (
              <EmptyState title="No issue reports found" desc="Adjust your filters or check back later." />
            )
          ) : (
            wasteReports.length > 0 ? (
              wasteReports.map(report => (
                <WasteModerationCard key={report.id} report={report} onUpdate={fetchData} />
              ))
            ) : (
              <EmptyState title="No waste reports for review" desc="AI confidence is high. Good job!" />
            )
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 mb-6">
        <LayoutGrid className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs text-center">{desc}</p>
    </div>
  );
}
