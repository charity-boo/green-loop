"use client";

import React from 'react';
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
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  {
    title: "Recycling Guides",
    desc: "Detailed manuals for home and business recycling.",
    icon: <BookOpen className="w-8 h-8 text-green-600" />,
    link: "/learning-hub/guides",
    count: "12 Guides"
  },
  {
    title: "Video Tutorials",
    desc: "Visual walkthroughs of waste sorting & composting.",
    icon: <Video className="w-8 h-8 text-green-700" />,
    link: "/learning-hub/videos",
    count: "8 Videos"
  },
  {
    title: "Waste Classification",
    desc: "Master the bin system with our detailed guide.",
    icon: <Search className="w-8 h-8 text-green-800" />,
    link: "/learning-hub/waste-types",
    count: "4 Categories"
  },
  {
    title: "Green Living Tips",
    desc: "Daily habits for a more sustainable lifestyle.",
    icon: <Leaf className="w-8 h-8 text-green-500" />,
    link: "/green-tips",
    count: "20+ Tips"
  }
];

const featuredMaterial = {
  title: "The Science of AI Sorting",
  desc: "Discover how Green Loop uses computer vision to categorize waste with 98% accuracy. Learn how to take better photos for the AI.",
  image: "/images/AI-Recycling.png",
  tag: "Featured Lesson",
  link: "/about-us/technology-innovation"
};

export default function LearningHubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-green-950 overflow-hidden text-white">
        {/* Background Overlay Pattern */}
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-800/50 rounded-full text-green-400 text-sm font-bold mb-6 border border-green-700/50">
              <GraduationCap className="w-4 h-4" /> KNOWLEDGE IS POWER
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Green Loop <br/><span className="text-green-500">Learning Hub</span>
            </h1>
            <p className="text-xl text-green-100/80 mb-10 leading-relaxed font-medium">
              Master the art of sustainability. From basic recycling rules to 
              advanced waste-tech insights, we provide the tools to make you 
              a zero-waste expert in Ndagani.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search for guides, tips, or videos..." 
                        className="w-full bg-green-900/50 border border-green-800 rounded-2xl py-4 pl-12 pr-6 text-white placeholder:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                </div>
                <button className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-xl shadow-green-900/20">
                    Search
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
                <Link 
                    key={i} 
                    href={cat.link}
                    className="group p-8 bg-white border border-green-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2"
                >
                    <div className="mb-6 p-4 bg-green-50 rounded-3xl w-fit group-hover:scale-110 transition-transform">
                        {cat.icon}
                    </div>
                    <h3 className="text-2xl font-black text-green-900 mb-3 group-hover:text-green-600 transition-colors">{cat.title}</h3>
                    <p className="text-sm text-green-700 font-medium mb-8 flex-grow">{cat.desc}</p>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-black text-green-500 uppercase tracking-widest">{cat.count}</span>
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* Featured Material */}
      <section className="py-24 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[3.5rem] border border-green-100 shadow-xl overflow-hidden flex flex-col lg:flex-row items-stretch">
                <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-black mb-6 w-fit uppercase tracking-widest">
                        <Lightbulb className="w-4 h-4" /> {featuredMaterial.tag}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-6 leading-tight">
                        {featuredMaterial.title}
                    </h2>
                    <p className="text-green-800 text-lg mb-10 leading-relaxed font-medium">
                        {featuredMaterial.desc}
                    </p>
                    <Link 
                        href={featuredMaterial.link}
                        className="px-10 py-5 bg-green-950 text-white font-black rounded-2xl hover:bg-green-900 transition shadow-xl w-fit flex items-center gap-3"
                    >
                        Start Learning <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                <div className="lg:w-1/2 bg-green-100 relative min-h-[400px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-transparent"></div>
                    <Image 
                        src={featuredMaterial.image} 
                        alt={featuredMaterial.title} 
                        width={500}
                        height={400}
                        className="relative z-10 w-4/5 h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Quick Tips Section */}
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

      {/* Download Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
            <div className="bg-green-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <Globe className="w-full h-full text-white scale-150 rotate-12" />
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        Ready to Level Up?
                    </h2>
                    <p className="text-green-200 text-lg mb-12 max-w-2xl mx-auto font-medium">
                        Download our comprehensive Ndagani Zero-Waste Guide PDF and keep it on your fridge for quick reference.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button className="px-12 py-5 bg-green-500 text-green-950 font-black rounded-2xl hover:bg-green-400 transition shadow-2xl transform hover:scale-105 flex items-center gap-3 justify-center">
                            Download PDF <FileText className="w-6 h-6" />
                        </button>
                        <Link 
                            href="/auth/register"
                            className="px-12 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition transform hover:scale-105 flex items-center gap-3 justify-center"
                        >
                            Join a Workshop <ChevronRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
