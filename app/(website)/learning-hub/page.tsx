"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Video, 
  Search, 
  Leaf, 
  ChevronRight, 
  GraduationCap,
  Lightbulb,
  Globe,
  CheckCircle2,
  FileText,
  ArrowRight,
  Package,
  Trash2,
  Zap,
  Info,
  Download,
  Recycle,
  Building,
  Clock,
  Play,
  X,
  Loader2,
  Filter,
  Monitor,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types for Videos ---
interface VideoItem {
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

const STATIC_VIDEOS: VideoItem[] = [
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
    id: "video-005",
    title: "Food Waste & Its Climate Impact",
    description: "How food loss drives climate change and what we can do to stop it.",
    youtubeId: "ejh4NVS7fPM",
    youtubeUrl: "https://www.youtube.com/watch?v=ejh4NVS7fPM",
    embedUrl: "https://www.youtube.com/embed/ejh4NVS7fPM",
    thumbnailUrl: "https://img.youtube.com/vi/ejh4NVS7fPM/maxresdefault.jpg",
    category: "Food Waste", duration: "4:30", difficulty: "Beginner",
    tags: ["food waste", "climate"], featured: true, order: 5,
  }
];

const ALL_VIDEO_CATEGORIES = ["All", "Recycling", "Composting", "Sorting", "Safety", "Food Waste", "Community", "Technology", "Education"];

// --- Waste Categories ---
const wasteCategories = [
    {
        id: 'recyclables',
        name: 'Recyclables (Blue Bin)',
        icon: <Package className="w-8 h-8" />,
        description: "Clean recyclables are processed into new products. In Ndagani, ensuring these items are empty and rinsed is critical to prevent contamination.",
        examples: ["PET/HDPE Plastic bottles", "Aluminum & Tin Cans", "Clean Cardboard & Paper", "Rinsed Glass bottles"],
        accent: 'bg-green-600'
    },
    {
        id: 'organics',
        name: 'Organic Waste (Green Bin)',
        icon: <Leaf className="w-8 h-8" />,
        description: "Organic waste accounts for nearly 60% of household waste in Chuka. When properly collected, it becomes high-quality compost for local farms.",
        examples: ["Fruit & Vegetable scraps", "Coffee grounds & filters", "Yard trimmings & Grass", "Eggshells & Leftovers"],
        accent: 'bg-green-500'
    },
    {
        id: 'landfill',
        name: 'General Waste (Black Bin)',
        icon: <Trash2 className="w-8 h-8" />,
        description: "Items that cannot currently be recycled or composted in our facility. We aim to minimize this bin through better sorting.",
        examples: ["Sanitary & Hygiene products", "Heavily soiled wrappers", "Greasy pizza boxes", "Broken ceramics"],
        accent: 'bg-green-700'
    },
    {
        id: 'hazardous',
        name: 'Special/Hazardous Waste',
        icon: <Zap className="w-8 h-8" />,
        description: "Items containing toxic heavy metals or chemicals that require specialized handling to protect Ndagani's environment.",
        examples: ["Batteries (All types)", "Electronics (E-waste)", "Fluorescent bulbs", "Paints, chemicals, or oils"],
        accent: 'bg-green-400'
    },
];

// --- Guide Cards ---
const guides = [
    {
        title: "Household Separation Guide",
        description: "Our core manual for households in Ndagani. Learn exactly how to separate waste to maximize points.",
        icon: <Recycle className="w-8 h-8" />,
        link: "/docs/household-separation-guide.pdf"
    },
    {
        title: "Enterprise Protocol",
        description: "High-volume waste strategies tailored for Ndagani businesses, hostels, and restaurants.",
        icon: <Building className="w-8 h-8" />,
        link: "/docs/enterprise-waste-protocol.pdf"
    },
    {
        title: "Organic Composting",
        description: "Turn your kitchen scraps into gold. A step-by-step guide on creating organic compost.",
        icon: <Lightbulb className="w-8 h-8" />,
        link: "/docs/organic-composting-agriculture.pdf"
    },
    {
        title: "Hazardous & E-Waste",
        description: "Crucial instructions for the safe handling of old batteries, electronics, and medical waste.",
        icon: <BookOpen className="w-8 h-8" />,
        link: "/docs/hazardous-ewaste-manual.pdf"
    },
];

export default function LearningHubPage() {
  const [activeWasteCategory, setActiveWasteCategory] = useState('recyclables');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [selectedVideoCategory, setSelectedVideoCategory] = useState("All");
  const [videoSearchQuery, setVideoSearchQuery] = useState("");

  const selectedWasteCategory = wasteCategories.find(cat => cat.id === activeWasteCategory) || wasteCategories[0];

  useEffect(() => {
    fetch('/api/educational-videos')
      .then((r) => r.json())
      .then((data) => {
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          setVideos(STATIC_VIDEOS);
        }
      })
      .catch(() => setVideos(STATIC_VIDEOS))
      .finally(() => setLoadingVideos(false));
  }, []);

  const filteredVideos = videos.filter((v) => {
    const matchCat = selectedVideoCategory === "All" || v.category === selectedVideoCategory;
    const q = videoSearchQuery.toLowerCase();
    const matchSearch = !q || v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative py-24 bg-green-950 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-800/50 rounded-full text-green-400 text-sm font-bold mb-6 border border-green-700/50 uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" /> Knowledge is Power
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Green Loop <br/><span className="text-green-500">Learning Hub</span>
            </h1>
            <p className="text-xl text-green-100/80 mb-10 leading-relaxed font-medium">
              Master the art of sustainability. From basic recycling rules to 
              advanced waste-tech insights, we provide the tools to make you 
              a zero-waste expert.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#waste-classification" className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-xl">
                Start Learning
              </a>
              <a href="#guides" className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition border border-white/20">
                Browse Guides
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 1. WASTE CLASSIFICATION SECTION --- */}
      <section id="waste-classification" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-4">🔬 Waste Classification</h2>
            <p className="text-green-700 text-xl font-medium">Know your bins! Correct sorting is the first step to zero waste.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {wasteCategories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => setActiveWasteCategory(cat.id)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black transition-all duration-300 ${
                        activeWasteCategory === cat.id
                            ? `bg-green-950 text-white shadow-xl scale-105`
                            : 'bg-green-50 text-green-800 hover:bg-green-100'
                    }`}
                >
                    <span className={activeWasteCategory === cat.id ? 'text-green-400' : 'text-green-600'}>
                        {cat.icon}
                    </span>
                    <span className="text-sm">{cat.name.split(' (')[0]}</span>
                </button>
            ))}
        </div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={activeWasteCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-10 md:p-16 rounded-[3.5rem] border shadow-2xl overflow-hidden relative ${selectedWasteCategory.id === 'landfill' ? 'bg-green-950 text-green-50 border-green-900' : 'bg-white border-green-50 shadow-green-900/5'}`}
            >
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="lg:w-3/5">
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`p-4 rounded-3xl ${selectedWasteCategory.accent} text-white shadow-lg`}>
                                {selectedWasteCategory.icon}
                            </div>
                            <h2 className="text-3xl font-black">{selectedWasteCategory.name}</h2>
                        </div>
                        <p className="text-lg leading-relaxed mb-8 font-medium">{selectedWasteCategory.description}</p>
                        <div className="bg-green-500/10 p-6 rounded-3xl border border-green-500/20">
                            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-green-500" /> Key Examples:
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedWasteCategory.examples.map((example, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></div>
                                        <span className="font-bold text-sm">{example}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-2/5 hidden lg:flex justify-center">
                         <div className="w-48 h-64 bg-green-50 rounded-3xl border-4 border-dashed border-green-200 flex items-center justify-center">
                            <span className="text-xs font-black uppercase opacity-20 rotate-90">{selectedWasteCategory.id} bin</span>
                         </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </section>

      {/* --- 2. RECYCLING GUIDES SECTION --- */}
      <section id="guides" className="py-24 bg-green-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-4">📚 Essential Recycling Guides</h2>
                <p className="text-green-700 text-xl font-medium">Download comprehensive manuals to master waste management.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {guides.map((guide, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50 flex flex-col"
                    >
                        <div className="mb-6 p-4 bg-green-50 rounded-2xl w-fit text-green-600">{guide.icon}</div>
                        <h3 className="text-xl font-black text-green-950 mb-3">{guide.title}</h3>
                        <p className="text-sm text-green-800 font-medium leading-relaxed mb-6 flex-grow">{guide.description}</p>
                        <Link href={guide.link} className="flex items-center justify-between p-3 bg-green-50 hover:bg-green-600 hover:text-white rounded-xl text-green-700 font-black transition-all group">
                            <span className="text-xs">Download PDF</span>
                            <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 3. EDUCATIONAL VIDEOS SECTION --- */}
      <section id="videos" className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-4">🎥 Video Tutorials</h2>
            <p className="text-green-700 text-xl font-medium">Visual walkthroughs of waste sorting & sustainability.</p>
        </div>

        {/* Video Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-white p-4 border border-green-100 rounded-3xl">
            <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search videos..."
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-green-400"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
                {ALL_VIDEO_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedVideoCategory(cat)}
                        className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
                            selectedVideoCategory === cat
                                ? "bg-green-600 text-white border-green-600"
                                : "bg-white text-gray-500 border-gray-200 hover:border-green-300"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {loadingVideos ? (
            <div className="flex items-center justify-center py-20 gap-3 text-green-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-medium">Loading videos...</span>
            </div>
        ) : filteredVideos.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No videos found.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, i) => (
                    <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setActiveVideo(video)}
                        className="group cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="relative h-40 overflow-hidden">
                            <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <Play className="w-4 h-4 text-green-700 fill-current ml-0.5" />
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`text-[10px] font-black rounded-full px-2 py-0.5 uppercase tracking-wide ${CATEGORY_COLORS[video.category] || "bg-gray-100 text-gray-700"}`}>
                                    {video.category}
                                </span>
                            </div>
                            <h3 className="font-black text-sm text-green-950 group-hover:text-green-700 transition-colors line-clamp-2">{video.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
      </section>

      {/* --- 4. QUICK TIPS SECTION --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-green-950 mb-4">Quick Wins for the Planet</h2>
            <p className="text-green-700 text-xl font-medium">Small changes that make a massive impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "Rinse Recyclables", desc: "Always rinse plastic and metal containers. Contamination can ruin an entire batch of recycling.", icon: <CheckCircle2 className="w-6 h-6" /> },
                { title: "Avoid 'Wishcycling'", desc: "If you're not sure, check the guide. Putting non-recyclables in the blue bin does more harm than good.", icon: <CheckCircle2 className="w-6 h-6" /> },
                { title: "Flatten Cardboard", desc: "Maximize space in collection trucks by flattening all cardboard boxes before pickup.", icon: <CheckCircle2 className="w-6 h-6" /> }
            ].map((tip, i) => (
                <div key={i} className="p-10 bg-white border-2 border-green-50 rounded-[2.5rem] hover:border-green-200 transition-colors">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                        {tip.icon}
                    </div>
                    <h4 className="text-2xl font-black text-green-950 mb-4">{tip.title}</h4>
                    <p className="text-green-700 leading-relaxed font-medium">{tip.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* --- DOWNLOAD CTA --- */}
      <section className="py-24 pb-32">
        <div className="max-w-5xl mx-auto px-6">
            <div className="bg-green-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <Globe className="w-full h-full text-white scale-150 rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to Level Up?</h2>
                    <p className="text-green-200 text-lg mb-12 max-w-2xl mx-auto font-medium">
                        Download our comprehensive Zero-Waste Guide PDF and keep it on your fridge for quick reference.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="px-12 py-5 bg-green-500 text-green-950 font-black rounded-2xl hover:bg-green-400 transition shadow-2xl flex items-center gap-3 justify-center">
                            Download PDF <FileText className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- VIDEO MODAL --- */}
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
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <div className="p-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-green-950 mb-1">{activeVideo.title}</h3>
                  <p className="text-gray-600 text-sm">{activeVideo.description}</p>
                </div>
                <button onClick={() => setActiveVideo(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
