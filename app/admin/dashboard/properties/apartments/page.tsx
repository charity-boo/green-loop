'use client';

import React, { useState, useEffect } from 'react';
import { PropertyTable } from '@/components/admin/PropertyTable';
import { AddPropertyModal } from '@/components/admin/AddPropertyModal';
import { ApartmentDoc } from '@/types/firestore';
import { Plus, Search, Building2, Loader2 } from 'lucide-react';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState<ApartmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/apartments');
      if (!res.ok) throw new Error('Failed to fetch apartments');
      const data = await res.json();
      setApartments(data);
    } catch (error) {
      console.error('Error fetching apartments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const filteredApartments = apartments.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apartments Management</h1>
          <p className="text-slate-500">Manage and verify registered apartment complexes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10"
        >
          <Plus className="w-5 h-5" />
          Add Apartment
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm max-w-md">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search apartments by name or location..."
          className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">Loading apartments...</p>
        </div>
      ) : (
        <PropertyTable 
          properties={filteredApartments} 
          type="apartment" 
          onUpdate={fetchApartments} 
        />
      )}

      <AddPropertyModal
        type="apartment"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchApartments}
      />
    </div>
  );
}
