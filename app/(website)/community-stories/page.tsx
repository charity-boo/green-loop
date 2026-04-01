"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Heart, Search, ChevronLeft, ChevronRight, User, Star, BookOpen } from 'lucide-react';
import { motion } from "framer-motion";
import type { CommunityStoryDoc } from '@/types/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { STORY_CATEGORIES } from '@/lib/constants/community';

const CATEGORIES = ['All', ...STORY_CATEGORIES];

export default function CommunityStoriesPage() {
  const [stories, setStories] = useState<CommunityStoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/public/stories?${params}`);
      const data = await response.json();
      
      setStories(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const featuredStories = stories.filter(s => s.featured);
  const regularStories = stories.filter(s => !s.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-8 h-8 text-pink-200" />
              <span className="text-pink-200 font-semibold uppercase tracking-wider text-sm">
                Community Stories
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Stories That Inspire Change
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Real stories from community members making a difference in sustainability and environmental action
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-50 to-transparent"></div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); fetchStories(); }} className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </form>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
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
                <Skeleton className="h-64 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Featured Stories */}
          {featuredStories.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <Star className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredStories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} isFeatured={true} />
                ))}
              </div>
            </section>
          )}

          {/* Regular Stories */}
          {regularStories.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="w-6 h-6 text-purple-600" />
                <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularStories.map((story, index) => (
                  <StoryCard key={story.id} story={story} index={index} isFeatured={false} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {stories.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later for new stories
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

function StoryCard({ story, index, isFeatured }: { story: CommunityStoryDoc; index: number; isFeatured: boolean }) {
  const excerpt = story.story.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${
        isFeatured ? 'md:col-span-1' : ''
      }`}
    >
      {story.imageUrl ? (
        <div className={`relative ${isFeatured ? 'h-80' : 'h-64'} bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden`}>
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isFeatured && (
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>
      ) : (
        <div className={`${isFeatured ? 'h-80' : 'h-64'} bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center`}>
          <BookOpen className="w-16 h-16 text-purple-300" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
            {story.category}
          </Badge>
          {isFeatured && !story.imageUrl && (
            <Badge className="bg-purple-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        <h3 className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors`}>
          {story.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <User className="w-4 h-4 text-purple-600" />
          <span className="font-medium">{story.authorName}</span>
          <span className="text-gray-400">•</span>
          <span>{format(new Date(story.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <p className="text-gray-600 line-clamp-3 mb-4">
          {excerpt}
        </p>
        <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
          Read More
        </Button>
      </div>
    </motion.div>
  );
}