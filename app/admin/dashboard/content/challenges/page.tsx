'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChallengeDoc } from '@/types/firestore';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { CHALLENGE_CATEGORIES } from '@/lib/constants/community';

interface Filters {
  status?: string;
  category?: string;
  search?: string;
  page: number;
  limit: number;
}

const CATEGORIES = CHALLENGE_CATEGORIES;


export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<ChallengeDoc | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    status: 'active',
    startDate: '',
    endDate: '',
    goal: '',
    currentProgress: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(filters.page));
      params.set('limit', String(filters.limit));
      if (filters.status) params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);

      const res = await fetch(`/api/admin/challenges?${params}`);
      if (!res.ok) throw new Error('Failed to fetch challenges');
      const data = await res.json();
      setChallenges(data.data);
      setTotal(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleCreateNew = () => {
    setEditingChallenge(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      status: 'active',
      startDate: '',
      endDate: '',
      goal: '',
      currentProgress: 0,
    });
    setIsDialogOpen(true);
  };


  const handleEdit = (challenge: ChallengeDoc) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      imageUrl: challenge.imageUrl || '',
      category: challenge.category,
      status: challenge.status,
      startDate: challenge.startDate ? new Date(challenge.startDate).toISOString().split('T')[0] : '',
      endDate: challenge.endDate ? new Date(challenge.endDate).toISOString().split('T')[0] : '',
      goal: challenge.goal,
      currentProgress: challenge.currentProgress || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingChallenge
        ? `/api/admin/challenges/${editingChallenge.id}`
        : '/api/admin/challenges';
      const method = editingChallenge ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save challenge');

      setIsDialogOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
      alert('Failed to save challenge');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;

    try {
      const res = await fetch(`/api/admin/challenges/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete challenge');

      fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      alert('Failed to delete challenge');
    }
  };

  const handleStatusToggle = async (challenge: ChallengeDoc) => {
    try {
      let newStatus: string;
      if (challenge.status === 'upcoming') newStatus = 'active';
      else if (challenge.status === 'active') newStatus = 'completed';
      else newStatus = 'upcoming';

      const res = await fetch(`/api/admin/challenges/${challenge.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      fetchChallenges();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Trophy className="w-6 h-6 text-emerald-600" />
            </div>
            Challenges Management
          </h1>
          <p className="text-slate-600 mt-1">Create and manage community challenges and competitions</p>
        </div>
        <Button onClick={handleCreateNew} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Create New Challenge
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search challenges..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, status: value === 'all' ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category || 'all'}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value === 'all' ? undefined : value, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchChallenges}>
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Trophy className="w-12 h-12 mb-4" />
            <p>No challenges found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {challenges.map((challenge) => (
                  <tr key={challenge.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {challenge.imageUrl && (
                          <Image
                            src={challenge.imageUrl}
                            alt={challenge.title}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                            unoptimized
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{challenge.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{challenge.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{challenge.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {challenge.startDate && challenge.endDate ? (
                        <>
                          {new Date(challenge.startDate).toLocaleDateString()} - <br />
                          {new Date(challenge.endDate).toLocaleDateString()}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-slate-700">{challenge.goal}</div>
                        <div className="text-muted-foreground">Progress: {challenge.currentProgress || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants?.length || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleStatusToggle(challenge)}
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                          challenge.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : challenge.status === 'completed'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        )}
                      >
                        {challenge.status === 'active' ? 'Active' : challenge.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(challenge)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(challenge.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {(filters.page - 1) * filters.limit + 1} to{' '}
                {Math.min(filters.page * filters.limit, total)} of {total} challenges
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {filters.page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page >= totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingChallenge ? 'Edit Challenge' : 'Create New Challenge'}</DialogTitle>
            <DialogDescription>
              {editingChallenge ? 'Update the challenge details below' : 'Fill in the details for the new challenge'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 30-Day Zero Waste Challenge"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the challenge..."
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal</label>
              <Input
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                placeholder="e.g., Collect 100kg waste"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Progress</label>
              <Input
                type="number"
                value={formData.currentProgress}
                onChange={(e) => setFormData({ ...formData, currentProgress: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">Track the current progress towards the goal</p>
            </div>

            {editingChallenge && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-1">Participants</label>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {editingChallenge.participants?.length || 0} participants
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Read-only: Participants join through the app</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">Optional: Add an image URL for the challenge</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingChallenge ? 'Update Challenge' : 'Create Challenge'}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
