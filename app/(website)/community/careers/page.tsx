"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Zap, 
  Users, 
  Globe, 
  ArrowRight,
  Sparkles,
  Search,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { motion } from "framer-motion";

const jobListings = [
  { 
    title: "AI / ML Engineer", 
    location: "Ndagani Tech Hub", 
    type: "Full-time", 
    category: "Engineering",
    salary: "Competitive",
    desc: "Help us build the next generation of automated waste sorting algorithms using computer vision."
  },
  { 
    title: "Logistics Coordinator", 
    location: "Field Operations", 
    type: "Full-time", 
    category: "Operations",
    salary: "Base + Performance",
    desc: "Optimize our collection routes and manage the growing fleet of smart waste collectors."
  },
  { 
    title: "Community Outreach", 
    location: "Hybrid / Ndagani", 
    type: "Part-time", 
    category: "Sustainability",
    salary: "Per Event",
    desc: "Be the face of Green Loop at local schools, markets, and community gatherings."
  },
];

const perks = [
  { title: "Impact First", desc: "Every line of code you write directly reduces landfill waste and carbon footprint.", icon: <Zap className="w-5 h-5 text-amber-500" /> },
  { title: "Hybrid Culture", desc: "Flexible work arrangements for our tech and administrative teams.", icon: <Globe className="w-5 h-5 text-blue-500" /> },
  { title: "Health & Wellness", desc: "Comprehensive health coverage and mental health support for all full-time staff.", icon: <Users className="w-5 h-5 text-green-500" /> },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-green-950 font-sans">
      
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-32 bg-green-50 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-200/40 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/community" className="inline-flex items-center gap-2 text-green-700 font-bold mb-10 hover:text-green-900 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </Link>
          
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-green-700 text-[10px] font-black uppercase tracking-widest mb-8"
            >
              <Sparkles className="w-3 h-3 fill-current" /> We are hiring
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-green-950 leading-[0.9] mb-10 tracking-tighter"
            >
              BUILD THE FUTURE OF <br />
              <span className="text-green-600 italic font-serif font-normal">Sustai-Tech.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl"
            >
              Join a high-performance team dedicated to solving the global waste crisis through robotics, AI, and community-first logistics.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── CULTURE / PERKS ───────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 bg-white p-12 rounded-[4rem] shadow-2xl shadow-green-900/5 border border-green-50">
          {perks.map((perk, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {perk.icon}
              </div>
              <h4 className="text-xl font-black text-green-950 mb-3 tracking-tight">{perk.title}</h4>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOB LISTINGS ─────────────────────────────────────────────── */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-16 px-4">
          <h2 className="text-4xl font-black text-green-950 tracking-tight">Open Positions <span className="text-green-600 ml-4 font-black">({jobListings.length})</span></h2>
          <div className="hidden md:flex items-center gap-2 text-gray-400 font-bold text-sm">
            <Search className="w-4 h-4" /> Filter Roles
          </div>
        </div>

        <div className="space-y-6">
          {jobListings.map((job, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.01 }}
              className="group p-8 md:p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-8 cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">{job.category}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-green-950 group-hover:text-green-600 transition-colors mb-2 tracking-tight">{job.title}</h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-1">{job.desc}</p>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-black text-green-950">{job.type}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{job.salary}</div>
                </div>
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TALENT POOL / OUTRO ───────────────────────────────────────── */}
      <section className="py-32 bg-green-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-green-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-green-800/50">
            <Mail className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Don&apos;t see a fit?</h2>
          <p className="text-green-100/60 font-medium mb-12 text-lg md:text-xl leading-relaxed">
            We&apos;re always looking for brilliant minds in engineering, sustainability, and community leadership. If you&apos;re passionate about zero-waste, we want to hear from you.
          </p>
          <a 
            href="mailto:careers@greenloop.com" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-2xl shadow-green-900/50 text-lg group"
          >
            Send Speculative Application <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="mt-20 flex flex-wrap justify-center gap-8">
            {["Relocation Support", "Stock Options", "Remote Friendly"].map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-green-500/60 text-[10px] font-black uppercase tracking-[0.2em]">
                <CheckCircle2 className="w-4 h-4" /> {perk}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}