"use client";

import React from 'react';
import Link from "next/link";
import { 
  Play, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  Monitor,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";

const videoLibrary = [
  {
    id: 1,
    title: "How AI Sorts Your Trash",
    desc: "A behind-the-scenes look at our smart sorting facility in Ndagani.",
    duration: "2:45",
    category: "Technology",
    thumbnail: "bg-green-100"
  },
  {
    id: 2,
    title: "Composting 101: Scraps",
    desc: "Turn your food waste into nutrient-rich soil at home easily.",
    duration: "4:10",
    category: "Composting",
    thumbnail: "bg-green-200"
  },
  {
    id: 3,
    title: "Plastic Codes Explained",
    desc: "Understanding the numbers on plastic containers for recycling.",
    duration: "1:55",
    category: "Sorting",
    thumbnail: "bg-green-300"
  },
  {
    id: 4,
    title: "Hazardous Waste Safety",
    desc: "Crucial steps for handling batteries and chemicals safely.",
    duration: "3:30",
    category: "Safety",
    thumbnail: "bg-green-400"
  },
  {
    id: 5,
    title: "The Zero-Waste Kitchen",
    desc: "Simple swaps to reduce packaging waste in your daily cooking.",
    duration: "5:20",
    category: "Living",
    thumbnail: "bg-green-500"
  },
  {
    id: 6,
    title: "Community Clean-up Highlights",
    desc: "Relive the energy from our last massive Ndagani street cleanup.",
    duration: "2:15",
    category: "Community",
    thumbnail: "bg-green-600"
  }
];

export default function EducationalVideosPage() {
  return (
    <div className="min-h-screen bg-white text-green-950">
        {/* Header Section */}
        <section className="bg-green-50 py-20 px-6 overflow-hidden relative">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <Link 
                    href="/learning-hub" 
                    className="inline-flex items-center gap-2 text-green-600 font-bold mb-8 hover:text-green-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
                </Link>
                <h1 className="text-4xl md:text-6xl font-black text-green-950 mb-6 leading-tight">
                    Educational <br/><span className="text-green-600">Video Library</span>
                </h1>
                <p className="text-xl text-green-800 font-medium max-w-2xl mx-auto">
                    Visual guides and expert walkthroughs to help you master 
                    waste management and sustainable living.
                </p>
            </div>
        </section>

        {/* Video Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoLibrary.map((video, i) => (
                    <motion.div 
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex flex-col bg-white border border-green-50 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                        <div className={`h-52 relative overflow-hidden ${video.thumbnail}`}>
                            <div className="absolute inset-0 bg-green-900/10 group-hover:bg-green-900/30 transition-colors"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl text-green-600">
                                    <Play className="w-6 h-6 fill-current" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-green-950/80 backdrop-blur-md rounded-full text-[10px] font-black text-white flex items-center gap-1.5">
                                <Clock className="w-3 h-3 text-green-400" /> {video.duration}
                            </div>
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-green-900 uppercase tracking-widest">
                                {video.category}
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                            <h3 className="text-2xl font-black mb-3 group-hover:text-green-600 transition-colors">
                                {video.title}
                            </h3>
                            <p className="text-green-800 mb-8 flex-grow leading-relaxed font-medium">
                                {video.desc}
                            </p>
                            <button className="flex items-center gap-2 font-black text-green-950 group-hover:text-green-600 transition-colors">
                                Watch Tutorial <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Featured Workshop Spot */}
            <div className="mt-24 bg-green-950 rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="lg:w-3/5 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-800/50 rounded-full text-green-400 text-xs font-black mb-8 border border-green-700/50 uppercase tracking-widest">
                        <Monitor className="w-4 h-4" /> Monthly Live Workshop
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                        Interactive <span className="text-green-500">Q&A Session</span>
                    </h2>
                    <p className="text-xl text-green-100/80 mb-10 leading-relaxed font-medium max-w-xl">
                        Join our lead sustainability experts for a live session on the first 
                        Monday of every month. Ask questions and get real-time sorting advice.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-3 font-bold text-green-400">
                            <Calendar className="w-5 h-5" /> March 2, 2026
                        </div>
                        <div className="flex items-center gap-3 font-bold text-green-400">
                            <CheckCircle2 className="w-5 h-5" /> 200+ Registered
                        </div>
                    </div>
                </div>

                <div className="lg:w-2/5 w-full">
                    <button className="w-full py-6 bg-green-600 text-white font-black rounded-3xl hover:bg-green-500 transition shadow-2xl shadow-green-900/50 text-xl transform hover:-translate-y-1">
                        Register for Live Event
                    </button>
                    <Link href="/learning-hub/guides" className="mt-6 block text-center font-bold text-green-400 hover:text-white transition">
                        Download Session Materials →
                    </Link>
                </div>
            </div>
        </section>
    </div>
  );
}
