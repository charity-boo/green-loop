'use client';

import React, { useState, useEffect } from 'react';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { AddPropertyModal } from '@/components/admin/AddPropertyModal';
import { HostelDoc } from '@/types/firestore';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';

export default function HostelsPage() {
  const [hostels, setHostels] = useState<HostelDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHostels = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/hostels');
      if (!res.ok) throw new Error('Failed to fetch hostels');
      const data = await res.json();
      setHostels(data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const filteredHostels = hostels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostels Management</h1>
          <p className="text-slate-500">Manage and verify registered hostels.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10"
        >
          <Plus className="w-5 h-5" />
          Add Hostel
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search hostels by name or location..."
          className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">Loading hostels...</p>
        </div>
      ) : (
        <PropertyTable 
          properties={filteredHostels} 
          type="hostel" 
          onUpdate={fetchHostels} 
        />
      )}

      <AddPropertyModal
        type="hostel"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchHostels}
      />
    </div>
  );
}
