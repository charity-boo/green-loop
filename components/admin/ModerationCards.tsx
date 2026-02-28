'use client';

import React, { useState } from 'react';

// Types inlined to avoid importing server-only firebase services
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
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  MapPin, 
  MessageSquare, 
  User, 
  Mail, 
  Calendar,
  Image as ImageIcon,
  Cpu,
  ShieldCheck,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface IssueCardProps {
  report: ReportDoc;
  onUpdate: () => void;
}

export function IssueModerationCard({ report, onUpdate }: IssueCardProps) {
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const handleStatusUpdate = async (newStatus: ReportDoc['status']) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/moderation/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'issue', status: newStatus, comment }),
      });
      if (!res.ok) throw new Error('Failed to update report');
      onUpdate();
      setShowCommentInput(false);
      setComment('');
    } catch (error) {
      console.error('Failed to update report:', error);
    } finally {
      setUpdating(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-100',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-100',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    DISMISSED: 'bg-slate-50 text-slate-700 border-slate-100',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group overflow-hidden relative">
      <div className={cn(
        "absolute top-0 right-0 px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-xl border-l border-b",
        statusColors[report.status]
      )}>
        {report.status}
      </div>

      <div className="flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-amber-50 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 line-clamp-1">{report.issueType}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(new Date(report.createdAt), 'MMM d, h:mm a')}
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-6 flex-1 line-clamp-3 italic">
          &quot;{report.description}&quot;
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <User className="w-4 h-4 text-slate-400" />
            <span className="font-medium">{report.fullName}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-500">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{report.email}</span>
          </div>
          {report.location && (
            <div className="flex items-center gap-2.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{report.location}</span>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          {showCommentInput ? (
            <div className="flex-1 flex gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="flex-1 text-sm border-b border-slate-200 focus:border-emerald-500 outline-none pb-1"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button 
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCommentInput(true)}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Add Comment"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </button>
              {report.imageFile && (
                <button 
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Image"
                >
                  <ImageIcon className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {report.status !== 'RESOLVED' && (
              <button 
                onClick={() => handleStatusUpdate('RESOLVED')}
                disabled={updating}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
            {report.status !== 'DISMISSED' && (
              <button 
                onClick={() => handleStatusUpdate('DISMISSED')}
                disabled={updating}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface WasteCardProps {
  report: WasteReportDoc;
  onUpdate: () => void;
}

export function WasteModerationCard({ report, onUpdate }: WasteCardProps) {
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState('');

  const handleModerate = async (newStatus: WasteReportDoc['status']) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/moderation/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'waste', status: newStatus, comment, userId: report.userId }),
      });
      if (!res.ok) throw new Error('Failed to moderate waste report');
      onUpdate();
      setComment('');
    } catch (error) {
      console.error('Failed to moderate waste report:', error);
    } finally {
      setUpdating(false);
    }
  };

  const confidenceScore = report.classification?.confidence || 0;
  const isLowConfidence = confidenceScore < 0.7;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img 
          src={report.imageUrl} 
          alt="Waste classification" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <div className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm",
            isLowConfidence ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"
          )}>
            AI: {report.classification?.wasteType || 'Unknown'}
          </div>
          <div className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-slate-900 shadow-sm border border-slate-200">
            {(confidenceScore * 100).toFixed(0)}% Conf.
          </div>
        </div>
        
        {report.status === 'AI_REVIEW' && (
          <div className="absolute inset-0 bg-amber-600/10 flex items-center justify-center">
            <div className="px-4 py-2 bg-amber-500 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <Cpu className="w-4 h-4" /> REVIEW NEEDED
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shadow-sm ring-2 ring-white">
            {report.userName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">{report.userName}</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-widest font-semibold">
              <Clock className="w-3 h-3" /> {format(new Date(report.createdAt), 'MMM d, p')}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detected Labels</div>
          <div className="flex flex-wrap gap-1.5">
            {report.classification?.labels.map((label, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[10px] rounded-md border border-slate-100 font-medium">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <textarea 
            placeholder="Add moderation notes..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none h-16"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleModerate('MODERATED')}
              disabled={updating}
              className="flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm AI
            </button>
            <button 
              onClick={() => handleModerate('MODERATED')}
              disabled={updating}
              className="flex items-center justify-center gap-2 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 text-xs font-bold transition-all shadow-sm shadow-emerald-200 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" /> Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
