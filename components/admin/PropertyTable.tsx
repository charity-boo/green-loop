'use client';

import React from 'react';
import { HostelDoc, ApartmentDoc } from '@/types/firestore';
import { 
  Building2, 
  MapPin, 
  Trophy, 
  ShieldCheck, 
  ShieldAlert, 
  Edit,
  Trash2
} from 'lucide-react';

type Property = HostelDoc | ApartmentDoc;

interface PropertyTableProps {
  properties: Property[];
  type: 'hostel' | 'apartment';
  onUpdate: () => void;
}

export function PropertyTable({ properties, type, onUpdate: _onUpdate }: PropertyTableProps) {

  const getTierBadge = (tier: Property['tier']) => {
    switch (tier) {
      case 'enterprise':
        return <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 uppercase">Enterprise</span>;
      case 'premium':
        return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200 uppercase">Premium</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 uppercase">Standard</span>;
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Points</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{p.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getTierBadge(p.tier)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700 font-medium">
                    {'studentCount' in p ? `${p.studentCount} Students` : `${p.unitCount} Units`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Trophy className="w-4 h-4" />
                    {p.points.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.verified ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                      <ShieldCheck className="w-4 h-4" /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-500 text-sm font-medium">
                      <ShieldAlert className="w-4 h-4" /> Pending
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {properties.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="font-medium text-slate-600">No {type}s found</p>
          <p className="text-sm">Add your first {type} to get started</p>
        </div>
      )}
    </div>
  );
}
