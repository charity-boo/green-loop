"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from "next/link";
import Image from "next/image";
import {
  Play,
  Clock,
  ArrowLeft,
  ChevronRight,
  Monitor,
  CheckCircle2,
  Calendar,
  X,
  Loader2,
  Search,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────
interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  featured: boolean;
  order: number;
}

// ── Category colours ───────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Recycling:  "bg-green-100 text-green-800",
  Composting: "bg-lime-100 text-lime-800",
  Sorting:    "bg-emerald-100 text-emerald-800",
  Safety:     "bg-amber-100 text-amber-800",
  "Food Waste": "bg-orange-100 text-orange-800",
  Community:  "bg-teal-100 text-teal-800",
  Technology: "bg-blue-100 text-blue-800",
  Education:  "bg-violet-100 text-violet-800",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner:     "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Advanced:     "bg-red-50 text-red-700 border-red-200",
};

// ── Fallback static data (shown while Firestore loads or on error) ──────────
const STATIC_VIDEOS: Video[] = [
  {
    id: "video-001",
    title: "How Recycling Works: The TED-Ed Guide",
    description: "A deep dive into the mechanical and chemical processes of recycling various materials.",
    youtubeId: "5ceG-v6f_kI",
    youtubeUrl: "https://www.youtube.com/watch?v=5ceG-v6f_kI",
    embedUrl: "https://www.youtube.com/embed/5ceG-v6f_kI",
    thumbnailUrl: "https://img.youtube.com/vi/5ceG-v6f_kI/maxresdefault.jpg",
    category: "Recycling", duration: "4:07", difficulty: "Beginner",
    tags: ["recycling", "science"], featured: true, order: 1,
  },
  {
    id: "video-002",
    title: "Composting 101: Beginners Guide",
    description: "Everything you need to know to start your first compost pile today.",
    youtubeId: "q_6tY0Kj0W8",
    youtubeUrl: "https://www.youtube.com/watch?v=q_6tY0Kj0W8",
    embedUrl: "https://www.youtube.com/embed/q_6tY0Kj0W8",
    thumbnailUrl: "https://img.youtube.com/vi/q_6tY0Kj0W8/maxresdefault.jpg",
    category: "Composting", duration: "18:41", difficulty: "Beginner",
    tags: ["composting", "garden"], featured: true, order: 2,
  },
  {
    id: "video-003",
    title: "Why Plastic Recycling is So Hard",
    description: "CNBC explores the economic and technical challenges of plastic recovery.",
    youtubeId: "h3y950dJ-c0",
    youtubeUrl: "https://www.youtube.com/watch?v=h3y950dJ-c0",
    embedUrl: "https://www.youtube.com/embed/h3y950dJ-c0",
    thumbnailUrl: "https://img.youtube.com/vi/h3y950dJ-c0/maxresdefault.jpg",
    category: "Sorting", duration: "19:33", difficulty: "Intermediate",
    tags: ["plastic", "sorting"], featured: false, order: 3,
  },
  {
    id: "video-004",
    title: "Hazardous Waste Safety Training",
    description: "Important safety protocols for handling batteries, chemicals, and medical waste.",
    youtubeId: "N4u_03a5b30",
    youtubeUrl: "https://www.youtube.com/watch?v=N4u_03a5b30",
    embedUrl: "https://www.youtube.com/embed/N4u_03a5b30",
    thumbnailUrl: "https://img.youtube.com/vi/N4u_03a5b30/maxresdefault.jpg",
    category: "Safety", duration: "12:05", difficulty: "Intermediate",
    tags: ["safety", "hazardous"], featured: false, order: 4,
  },
  {
    id: "video-005",
    title: "Food Waste & Its Climate Impact",
    description: "How food loss drives climate change and what we can do to stop it.",
    youtubeId: "ejh4NVS7fPM",
    youtubeUrl: "https://www.youtube.com/watch?v=ejh4NVS7fPM",
    embedUrl: "https://www.youtube.com/embed/ejh4NVS7fPM",
    thumbnailUrl: "https://img.youtube.com/vi/ejh4NVS7fPM/maxresdefault.jpg",
    category: "Food Waste", duration: "4:30", difficulty: "Beginner",
    tags: ["food waste", "climate"], featured: true, order: 5,
  },
  {
    id: "video-006",
    title: "Advanced Recycling Technologies",
    description: "A look into chemical recycling and modern recovery systems.",
    youtubeId: "cW_w1N_rU7o",
    youtubeUrl: "https://www.youtube.com/watch?v=cW_w1N_rU7o",
    embedUrl: "https://www.youtube.com/embed/cW_w1N_rU7o",
    thumbnailUrl: "https://img.youtube.com/vi/cW_w1N_rU7o/maxresdefault.jpg",
    category: "Technology", duration: "14:38", difficulty: "Advanced",
    tags: ["technology", "advanced"], featured: false, order: 6,
  },
  {
    id: "video-007",
    title: "Zero Waste Town: Kamikatsu",
    description: "Business Insider visits the town in Japan that recycles 80% of its waste.",
    youtubeId: "Ey6vE_689pI",
    youtubeUrl: "https://www.youtube.com/watch?v=Ey6vE_689pI",
    embedUrl: "https://www.youtube.com/embed/Ey6vE_689pI",
    thumbnailUrl: "https://img.youtube.com/vi/Ey6vE_689pI/maxresdefault.jpg",
    category: "Community", duration: "10:48", difficulty: "Intermediate",
    tags: ["community", "zero-waste"], featured: false, order: 7,
  },
  {
    id: "video-008",
    title: "The Circular Economy Explainer",
    description: "The fundamental guide to the circular economy by the Ellen MacArthur Foundation.",
    youtubeId: "zCRKvDyyHmI",
    youtubeUrl: "https://www.youtube.com/watch?v=zCRKvDyyHmI",
    embedUrl: "https://www.youtube.com/embed/zCRKvDyyHmI",
    thumbnailUrl: "https://img.youtube.com/vi/zCRKvDyyHmI/maxresdefault.jpg",
    category: "Education", duration: "3:41", difficulty: "Beginner",
    tags: ["circular economy", "sustainability"], featured: false, order: 8,
  },
];

const ALL_CATEGORIES = ["All", "Recycling", "Composting", "Sorting", "Safety", "Food Waste", "Community", "Technology", "Education"];

// ══════════════════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════
export default function EducationalVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Fetch from API (which reads Firestore) ─────────────────────────────
  useEffect(() => {
    fetch('/api/educational-videos')
      .then((r) => r.json())
      .then((data) => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          // Firestore empty or seed not run yet — use static data
          setVideos(STATIC_VIDEOS);
        }
      })
      .catch(() => {
        // API error — fall back to static
        setVideos(STATIC_VIDEOS);
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Close modal on Escape ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveVideo(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Filtered list ──────────────────────────────────────────────────────
  const filteredVideos = videos.filter((v) => {
    const matchCat = selectedCategory === "All" || v.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.tags?.some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  const featuredVideos = videos.filter((v) => v.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-green-950">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Link href="/learning-hub" className="inline-flex items-center gap-2 text-green-300 font-semibold mb-8 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Educational <br /><span className="text-green-400">Video Library</span>
          </h1>
          <p className="text-xl text-green-100/80 font-medium max-w-2xl leading-relaxed">
            Expert-curated YouTube videos covering waste management, recycling, composting, and sustainable living — ready to watch anytime.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { n: videos.length || 8, label: "Videos" },
              { n: ALL_CATEGORIES.length - 1, label: "Categories" },
              { n: "Free", label: "Always" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-green-400">{s.n}</div>
                <div className="text-xs font-semibold text-green-200 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS ───────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-40 bg-white border-b border-green-100 shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* ── FEATURED ROW ────────────────────────────────────────────── */}
        {featuredVideos.length > 0 && selectedCategory === "All" && !searchQuery && (
          <div className="mb-16">
            <h2 className="text-2xl font-black text-green-950 mb-6 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              Featured Videos
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveVideo(video)}
                  className="group cursor-pointer bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 text-green-700 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {video.duration}
                    </div>
                    {/* Featured badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      Featured
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black rounded-full px-2.5 py-1 uppercase tracking-wide ${CATEGORY_COLORS[video.category] || "bg-gray-100 text-gray-700"}`}>
                        {video.category}
                      </span>
                      <span className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border ${DIFFICULTY_COLORS[video.difficulty] || ""}`}>
                        {video.difficulty}
                      </span>
                    </div>
                    <h3 className="font-black text-base text-green-950 group-hover:text-green-700 transition-colors leading-snug">
                      {video.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── ALL VIDEOS GRID ──────────────────────────────────────────── */}
        <div>
          <h2 className="text-2xl font-black text-green-950 mb-6">
            {selectedCategory === "All" ? "All Videos" : selectedCategory}
            <span className="ml-3 text-base font-semibold text-gray-400">({filteredVideos.length})</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-32 gap-3 text-green-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Loading videos...</span>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-32 text-gray-400">
              <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No videos found for &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setActiveVideo(video)}
                  className="group cursor-pointer flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-green-100">
                    <Image
                      src={video.thumbnailUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl">
                        <Play className="w-5 h-5 text-green-700 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded-full text-[10px] font-bold text-white flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {video.duration}
                    </div>
                    {/* Category */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-black rounded-full px-2 py-0.5 uppercase tracking-wide ${CATEGORY_COLORS[video.category] || "bg-gray-100 text-gray-700"}`}>
                        {video.category}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border ${DIFFICULTY_COLORS[video.difficulty] || ""}`}>
                        {video.difficulty}
                      </span>
                    </div>
                    <h3 className="font-black text-sm text-green-950 group-hover:text-green-700 transition-colors leading-snug mb-2 flex-grow">
                      {video.title}
                    </h3>
                    <button className="flex items-center gap-1 text-xs font-bold text-green-600 group-hover:text-green-800 transition-colors mt-auto pt-3 border-t border-gray-50">
                      Watch Now <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── LIVE WORKSHOP BANNER ─────────────────────────────────────── */}
        <div className="mt-24 bg-green-950 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="lg:w-3/5 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-800/50 rounded-full text-green-400 text-xs font-black mb-6 border border-green-700/50 uppercase tracking-widest">
              <Monitor className="w-4 h-4" /> Monthly Live Workshop
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Interactive <span className="text-green-500">Q&amp;A Session</span>
            </h2>
            <p className="text-xl text-green-100/80 mb-8 font-medium max-w-xl leading-relaxed">
              Join Green Loop sustainability experts for a live session on the first Monday of every month. Ask questions and get real-time sorting advice.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 font-bold text-green-400">
                <Calendar className="w-5 h-5" /> April 7, 2026
              </div>
              <div className="flex items-center gap-2 font-bold text-green-400">
                <CheckCircle2 className="w-5 h-5" /> 200+ Registered
              </div>
            </div>
          </div>
          <div className="lg:w-2/5 w-full">
            <button className="w-full py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-2xl shadow-green-900/50 text-lg">
              Register for Live Event
            </button>
            <Link href="/learning-hub/guides" className="mt-4 block text-center font-bold text-green-400 hover:text-white transition text-sm">
              Download Session Materials →
            </Link>
          </div>
        </div>
      </main>

      {/* ── VIDEO MODAL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* YouTube embed */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Info */}
              <div className="p-6 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black rounded-full px-2.5 py-1 ${CATEGORY_COLORS[activeVideo.category] || "bg-gray-100 text-gray-700"}`}>
                      {activeVideo.category}
                    </span>
                    <span className={`text-[10px] font-semibold rounded-full px-2.5 py-1 border ${DIFFICULTY_COLORS[activeVideo.difficulty] || ""}`}>
                      {activeVideo.difficulty}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activeVideo.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-green-950 leading-snug mb-1">{activeVideo.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{activeVideo.description}</p>
                  <a
                    href={activeVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-green-600 hover:text-green-800 transition-colors"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="shrink-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
