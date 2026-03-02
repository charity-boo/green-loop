'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Layers,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ClassificationBadge from '@/components/user/classification-badge';
import { ClassificationStatus } from '@/types';

interface Schedule {
  id: string;
  userId: string;
  userName: string;
  wasteType: string;
  address: string;
  pickupDate: string | null;
  timeSlot: string;
  status: string;
  createdAt: string;
  instructions?: string;
  aiWasteType?: string | null;
  disposalTips?: string | null;
  classificationStatus?: ClassificationStatus;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { label: 'All', value: 'ALL', icon: Layers },
  { label: 'Pending', value: 'pending', icon: Clock },
  { label: 'Assigned', value: 'assigned', icon: Truck },
  { label: 'Completed', value: 'completed', icon: CheckCircle2 },
  { label: 'Cancelled', value: 'cancelled', icon: XCircle },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [reclassifyingIds, setReclassifyingIds] = useState<Set<string>>(new Set());

  const fetchSchedules = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const res = await fetch(`/api/admin/schedules?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSchedules(data.schedules);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSchedules(1);
  }, [fetchSchedules]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update');
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status } : s))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReclassify = useCallback(async (scheduleId: string) => {
    setReclassifyingIds((prev) => new Set(prev).add(scheduleId));
    try {
      await fetch('/api/schedule-pickup/reclassify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId }),
      });
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleId ? { ...s, classificationStatus: 'pending' } : s))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const filtered = search.trim()
    ? schedules.filter(
        (s) =>
          s.userName?.toLowerCase().includes(search.toLowerCase()) ||
          s.address?.toLowerCase().includes(search.toLowerCase()) ||
          s.wasteType?.toLowerCase().includes(search.toLowerCase())
      )
    : schedules;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Truck className="w-8 h-8 text-emerald-600" />
            Pickups
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage all waste pickup requests across all users.
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 font-medium">
          {meta.total} total pickups
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          <div className="flex items-center gap-2 mr-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest shrink-0">
            <Filter className="w-3.5 h-3.5" /> Filter
          </div>
          {STATUS_OPTIONS.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shadow-sm',
                statusFilter === value
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, address, waste type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs font-medium"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="mt-6 text-slate-500 font-bold text-sm tracking-wide animate-pulse">
            Loading schedules…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <Calendar className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No schedules found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide">
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-5">Waste Type</th>
                  <th className="py-3 px-5">AI Classification</th>
                  <th className="py-3 px-5">Address</th>
                  <th className="py-3 px-5">Pickup Date</th>
                  <th className="py-3 px-5">Slot</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-medium text-slate-900">{s.userName || '—'}</td>
                    <td className="py-4 px-5 text-slate-600">{s.wasteType}</td>
                    <td className="py-4 px-5">
                      <ClassificationBadge
                        scheduleId={s.id}
                        aiWasteType={s.aiWasteType}
                        disposalTips={s.disposalTips}
                        classificationStatus={s.classificationStatus}
                        canReclassify
                        onReclassify={handleReclassify}
                        reclassifying={reclassifyingIds.has(s.id)}
                      />
                    </td>
                    <td className="py-4 px-5 text-slate-600 max-w-[180px] truncate">{s.address}</td>
                    <td className="py-4 px-5 text-slate-600">{s.pickupDate || '—'}</td>
                    <td className="py-4 px-5 text-slate-600">{s.timeSlot}</td>
                    <td className="py-4 px-5">
                      <span
                        className={cn(
                          'px-2.5 py-1 text-xs font-semibold rounded-full border capitalize',
                          STATUS_STYLES[s.status] ?? 'bg-slate-100 text-slate-700 border-slate-200'
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <select
                        disabled={updatingId === s.id}
                        value={s.status}
                        onChange={(e) => updateStatus(s.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        {['pending', 'assigned', 'completed', 'cancelled'].map((st) => (
                          <option key={st} value={st}>
                            {st.charAt(0).toUpperCase() + st.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={meta.page <= 1}
                onClick={() => fetchSchedules(meta.page - 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <span className="text-sm font-medium text-slate-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                disabled={meta.page >= meta.totalPages}
                onClick={() => fetchSchedules(meta.page + 1)}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium border rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
