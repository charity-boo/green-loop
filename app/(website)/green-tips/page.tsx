"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Leaf, Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";
import type { GreenTipDoc } from '@/types/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GREEN_TIP_CATEGORIES } from '@/lib/constants/community';

const CATEGORIES = ['All', ...GREEN_TIP_CATEGORIES];

export default function GreenTipsPage() {
  const [tips, setTips] = useState<GreenTipDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const fetchTips = useCallback(async () => {
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

      const response = await fetch(`/api/public/green-tips?${params}`);
      const data = await response.json();
      
      setTips(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch green tips:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchTips();
  }, [fetchTips]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTips();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-700 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Leaf className="w-8 h-8 text-emerald-200" />
              <span className="text-emerald-200 font-semibold uppercase tracking-wider text-sm">
                Community Tips
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Green Tips for a<br />
              <span className="text-emerald-200">Sustainable Future</span>
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Discover practical eco-friendly tips shared by our community to help you live sustainably
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-50 to-transparent"></div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tips..."
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
                      ? 'bg-emerald-600 text-white shadow-lg'
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

      {/* Tips Grid */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tips found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {tip.imageUrl && (
                  <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-green-100 overflow-hidden">
                    <Image
                      src={tip.imageUrl}
                      alt={tip.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                {!tip.imageUrl && (
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                    <Leaf className="w-16 h-16 text-emerald-300" />
                  </div>
                )}
                <div className="p-6">
                  <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                    {tip.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {tip.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
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
      </section>
    </div>
  );
}
