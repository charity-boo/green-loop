'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { InquiriesTable } from '@/components/admin/InquiriesTable';
import { Inquiry } from '@/types/firestore';
import { Loader2, Mail, Search } from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (!res.ok) throw new Error('Failed to fetch inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filteredInquiries = inquiries.filter(
    (inquiry) =>
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Mail className="h-6 w-6" />
            All Inquiries
          </h1>
          <p className="text-slate-500">
            A centralized view of all incoming requests and reports.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or submitter..."
          className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">Loading inquiries...</p>
        </div>
      ) : (
        <InquiriesTable
          inquiries={filteredInquiries}
          onUpdate={fetchInquiries}
        />
      )}
    </div>
  );
}
