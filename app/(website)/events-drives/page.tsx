"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, MapPin, Users, Search, ChevronLeft, ChevronRight, Clock, Ticket } from 'lucide-react';
import { motion } from "framer-motion";
import type { EventDoc } from '@/types/firestore';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isPast, isFuture } from 'date-fns';

import { EVENT_CATEGORIES } from '@/lib/constants/community';

const CATEGORIES = ['All', ...EVENT_CATEGORIES];


export default function EventsDrivesPage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, searchQuery, page]);

  const fetchEvents = async () => {
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

      const response = await fetch(`/api/public/events?${params}`);
      const data = await response.json();
      
      setEvents(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(e => isFuture(new Date(e.eventDate)));
  const pastEvents = events.filter(e => isPast(new Date(e.eventDate)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Calendar className="w-8 h-8 text-emerald-200" />
              <span className="text-emerald-200 font-semibold uppercase tracking-wider text-sm">
                Community Events
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Events & Drives
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join our community in making a difference through local environmental events and initiatives
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-emerald-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); fetchEvents(); }} className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events..."
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
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <Clock className="w-6 h-6 text-emerald-600" />
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} isUpcoming={true} />
                ))}
              </div>
            </section>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <section className="py-16 max-w-7xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="w-6 h-6 text-gray-600" />
                <h2 className="text-3xl font-bold text-gray-900">Past Events</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => (
                  <EventCard key={event.id} event={event} index={index} isUpcoming={false} />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later for new events
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

function EventCard({ event, index, isUpcoming }: { event: EventDoc; index: number; isUpcoming: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      {event.imageUrl ? (
        <div className="relative h-56 bg-gradient-to-br from-emerald-100 to-teal-100 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {!isUpcoming && (
            <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-xs font-bold">
              Completed
            </div>
          )}
        </div>
      ) : (
        <div className="h-56 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-emerald-300" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            {event.category}
          </Badge>
          {event.registrationRequired && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              <Ticket className="w-3 h-3 mr-1" />
              Registration Required
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-4">
          {event.description}
        </p>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>{format(new Date(event.eventDate), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{event.location}</span>
          </div>
          {event.currentParticipants !== undefined && event.maxParticipants && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{event.currentParticipants} / {event.maxParticipants} participants</span>
            </div>
          )}
        </div>
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          disabled={!isUpcoming}
        >
          {isUpcoming ? (event.registrationRequired ? 'Register Now' : 'View Details') : 'Event Completed'}
        </Button>
      </div>
    </motion.div>
  );
}