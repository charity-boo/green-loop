"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trophy, Search, ChevronLeft, ChevronRight, Users, Target, Calendar, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion";
import type { ChallengeDoc } from '@/types/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';

const STATUS_OPTIONS = ['All', 'Active', 'Upcoming', 'Completed'];

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<ChallengeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (selectedStatus !== 'All') {
        params.append('status', selectedStatus.toLowerCase());
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/public/challenges?${params}`);
      const data = await response.json();
      
      setChallenges(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedStatus, searchQuery]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const upcomingChallenges = challenges.filter(c => c.status === 'upcoming');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-600 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="w-8 h-8 text-amber-200" />
              <span className="text-amber-200 font-semibold uppercase tracking-wider text-sm">
                Community Challenges
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Take on the Challenge
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Join sustainability challenges, track your progress, and make an impact with the community
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-50 to-transparent"></div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); fetchChallenges(); }} className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search challenges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </form>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setSelectedStatus(status);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedStatus === status
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading ? (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Active Challenges */}
          {activeChallenges.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-amber-600" />
                <h2 className="text-3xl font-bold text-gray-900">Active Challenges</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeChallenges.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Challenges */}
          {upcomingChallenges.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Challenges</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingChallenges.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Challenges */}
          {completedChallenges.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <Trophy className="w-6 h-6 text-gray-600" />
                <h2 className="text-3xl font-bold text-gray-900">Completed Challenges</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {completedChallenges.map((challenge, index) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {challenges.length === 0 && (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No challenges found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later for new challenges
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pb-16">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                size="icon"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
                size="icon"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ChallengeCard({ challenge, index }: { challenge: ChallengeDoc; index: number }) {
  const progressPercentage = challenge.currentProgress || 0;
  const participantCount = challenge.participants?.length || 0;
  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());
  const isActive = challenge.status === 'active';
  const isUpcoming = challenge.status === 'upcoming';
  const isCompleted = challenge.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      {challenge.imageUrl ? (
        <div className="relative h-56 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
          <Image
            src={challenge.imageUrl}
            alt={challenge.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            {isActive && (
              <Badge className="bg-green-600 text-white">Active</Badge>
            )}
            {isUpcoming && (
              <Badge className="bg-blue-600 text-white">Upcoming</Badge>
            )}
            {isCompleted && (
              <Badge className="bg-gray-600 text-white">Completed</Badge>
            )}
          </div>
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <Trophy className="w-16 h-16 text-amber-300" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
          {challenge.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {challenge.description}
        </p>
        
        {/* Progress Bar */}
        {isActive && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-bold text-amber-600">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="font-medium">Goal:</span>
            <span>{challenge.goal}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="font-medium">{participantCount} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            {isActive && daysLeft > 0 && (
              <span className="font-medium text-green-600">{daysLeft} days left</span>
            )}
            {isUpcoming && (
              <span className="font-medium">Starts {format(new Date(challenge.startDate), 'MMM d, yyyy')}</span>
            )}
            {isCompleted && (
              <span className="font-medium">Ended {format(new Date(challenge.endDate), 'MMM d, yyyy')}</span>
            )}
          </div>
        </div>
        
        <Button 
          className={`w-full ${
            isActive 
              ? 'bg-amber-600 hover:bg-amber-700' 
              : isCompleted 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
          disabled={isCompleted}
        >
          {isActive && 'Join Challenge'}
          {isUpcoming && 'Sign Up'}
          {isCompleted && 'Challenge Ended'}
        </Button>
      </div>
    </motion.div>
  );
}