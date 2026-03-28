'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { UserDoc, Role } from '@/types/firestore';
import { UserTable } from '@/components/admin/UserTable';
import { 
  Search, 
  Filter, 
  Users, 
  UserPlus, 
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserFilters {
  role?: Role;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    role: undefined,
    search: '',
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(filters.page || 1));
      params.set('limit', String(filters.limit || 10));
      if (filters.role) params.set('role', filters.role);
      if (filters.status) params.set('status', filters.status);
      if (filters.search) params.set('search', filters.search);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleRoleFilter = (role: Role | 'ALL') => {
    setFilters(prev => ({ 
      ...prev, 
      role: role === 'ALL' ? undefined : role,
      page: 1 
    }));
  };

  const totalPages = Math.ceil(total / (filters.limit || 10));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage account permissions, roles, and status for all platform members.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors font-medium">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-sm shadow-emerald-200">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-11 pr-4 py-2.5 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
        <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          {[
            { label: 'All Users', value: 'ALL' },
            { label: 'Residents', value: 'USER' },
            { label: 'Collectors', value: 'COLLECTOR' },
            { label: 'Admins', value: 'ADMIN' },
            { label: 'Pending Approvals', value: 'PENDING' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => {
                if (item.value === 'PENDING') {
                  setFilters(prev => ({ ...prev, role: undefined, status: 'PENDING_APPROVAL', page: 1 }));
                } else {
                  handleRoleFilter(item.value as Role | 'ALL');
                  setFilters(prev => ({ ...prev, status: undefined }));
                }
              }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                ((item.value === 'PENDING' && filters.status === 'PENDING_APPROVAL') || 
                 (item.value === 'ALL' && !filters.role && !filters.status) ||
                 (item.value !== 'PENDING' && item.value !== 'ALL' && filters.role === item.value))
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-card text-slate-600 border-border hover:border-slate-300 hover:bg-muted/50"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{total}</div>
              <div className="text-sm text-muted-foreground">Total Registered Users</div>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Loader2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {users.filter(u => u.active).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Accounts</div>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-slate-400">
           <div className="flex items-center justify-center h-full text-xs font-medium uppercase tracking-widest">
             More stats coming soon
           </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-card border border-border rounded-2xl shadow-sm">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Loading user data...</p>
        </div>
      ) : (
        <>
          <UserTable users={users} onUpdate={fetchUsers} />
          
          {/* Pagination */}
          <div className="flex items-center justify-between bg-card px-6 py-4 border border-border rounded-2xl shadow-sm">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{(filters.page! - 1) * filters.limit! + 1}</span> to <span className="font-semibold text-foreground">{Math.min(filters.page! * filters.limit!, total)}</span> of <span className="font-semibold text-foreground">{total}</span> users
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                disabled={filters.page === 1}
                className="p-2 text-slate-600 hover:bg-muted/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
                    className={cn(
                      "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                      filters.page === i + 1
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-muted/50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, page: Math.min(totalPages, prev.page! + 1) }))}
                disabled={filters.page === totalPages}
                className="p-2 text-slate-600 hover:bg-muted/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
