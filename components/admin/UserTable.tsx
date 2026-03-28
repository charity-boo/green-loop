'use client';

import React, { useState } from 'react';
import { UserDoc, Role } from '@/types/firestore';
import { 
  Users, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  UserMinus, 
  UserCheck, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { format } from 'date-fns';

interface UserTableProps {
  users: UserDoc[];
  onUpdate: () => void;
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Failed to update role');
      onUpdate();
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusChange = async (userId: string, active: boolean) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      onUpdate();
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-500/20 transition-colors">
          <ShieldCheck className="w-3.5 h-3.5" /> ADMIN
        </span>;
      case 'COLLECTOR':
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-100 dark:border-amber-500/20 transition-colors">
          <ShieldAlert className="w-3.5 h-3.5" /> COLLECTOR
        </span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold border border-emerald-100 dark:border-emerald-500/20 transition-colors">
          <Users className="w-3.5 h-3.5" /> RESIDENT
        </span>;
    }
  };

  return (
    <div className="overflow-hidden bg-card border border-border rounded-2xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shadow-sm ring-2 ring-white dark:ring-slate-900 transition-colors">
                      {u.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{u.name || 'Anonymous User'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(u.role)}
                </td>
                <td className="px-6 py-4">
                  {u.active ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-500 text-sm font-medium">
                      <XCircle className="w-4 h-4" /> Suspended
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(u.createdAt), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {updating === u.id ? (
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        {u.active ? (
                          <button 
                            onClick={() => handleStatusChange(u.id, false)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Suspend User"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(u.id, true)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Activate User"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        
                        <div className="relative group/menu">
                          <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl z-10 hidden group-hover/menu:block py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Change Role</div>
                            <button 
                              onClick={() => handleRoleChange(u.id, 'USER')}
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                            >
                              Make Resident
                            </button>
                            <button 
                              onClick={() => handleRoleChange(u.id, 'COLLECTOR')}
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                            >
                              Make Collector
                            </button>
                            <button 
                              onClick={() => handleRoleChange(u.id, 'ADMIN')}
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors"
                            >
                              Make Admin
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="font-medium text-slate-600">No users found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
