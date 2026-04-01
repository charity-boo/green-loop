"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  Calendar, 
  Heart, 
  ArrowRight,
  TrendingUp,
  TreePine,
  Droplets,
  Globe,
  Quote,
  ChevronRight,
  Sparkles,
  Zap,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

// ── Types & Data ───────────────────────────────────────────────────────────

const communityMetrics = [
  { label: "Eco-Warriors", value: "2,840+", icon: <Users className="w-6 h-6 text-green-600" /> },
  { label: "Waste Diverted (kg)", value: "52,100", icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
  { label: "Trees Preserved", value: "940", icon: <TreePine className="w-6 h-6 text-green-600" /> },
  { label: "Water Saved (L)", value: "1.4M", icon: <Droplets className="w-6 h-6 text-green-600" /> }
];

const projects = [
  {
    title: "Eco-School Initiative",
    desc: "Implementing smart sorting stations and circular economy workshops at local primary schools.",
    date: "Active Phase",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    category: "Education"
  },
  {
    title: "The Zero-Waste Market",
    desc: "Partnering with Ndagani vendors to replace single-use plastics with sustainable packaging.",
    date: "Weekly Event",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    category: "Retail"
  },
  {
    title: "Urban Reforestation",
    desc: "Restoring local biodiversity by planting native species in reclaimed waste sites.",
    date: "Spring 2026",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    category: "Ecology"
  }
];

const joinWays = [
  { 
    title: "Volunteer", 
    link: "/community/volunteer", 
    icon: <Users className="w-8 h-8" />, 
    desc: "Join our hands-on events and weekly neighborhood cleanup drives.", 
    color: "bg-green-600",
    hoverColor: "group-hover:text-green-600"
  },
  { 
    title: "Sponsorship", 
    link: "/community/sponsorship", 
    icon: <Heart className="w-8 h-8" />, 
    desc: "Fund a specific school project, community bin, or digital initiative.", 
    color: "bg-emerald-600",
    hoverColor: "group-hover:text-emerald-600"
  },
  { 
    title: "Careers", 
    link: "/community/careers", 
    icon: <Zap className="w-8 h-8" />, 
    desc: "Join our mission-driven team and build the future of waste-tech.", 
    color: "bg-lime-600",
    hoverColor: "group-hover:text-lime-600"
  },
  { 
    title: "Partnerships", 
    link: "/community/partnerships", 
    icon: <Globe className="w-8 h-8" />, 
    desc: "For businesses looking to integrate our pro-circular waste solutions.", 
    color: "bg-teal-600",
    hoverColor: "group-hover:text-teal-600"
  }
];

const stats = [
  { name: "Global Reach", value: "15+", label: "Communities" },
  { name: "Clean Cities", value: "85%", label: "Satisfaction" },
  { name: "Impact", value: "1.2M", label: "Kg Recycled" },
];

// ══════════════════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white text-green-950">

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative py-32 bg-green-950 overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-600 rounded-full blur-[150px] opacity-20 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[130px] opacity-20 translate-x-1/3 translate-y-1/3 select-none pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/40 rounded-full border border-green-800/50 text-green-400 text-xs font-black uppercase tracking-widest mb-10 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" /> Join the Movement
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter"
          >
            BE THE CHANGE <br />
            <span className="text-green-500">WE NEED TODAY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-green-100/70 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Green Loop is more than a platform — it&apos;s a shared mission to transform our world through cleaner, smarter, and more sustainable waste management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link 
              href="/auth/register"
              className="px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition-all shadow-2xl shadow-green-900/50 text-lg group"
            >
              Sign Up to Start <ArrowRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-5 border-2 border-green-700/50 text-white font-black rounded-2xl hover:bg-green-700/20 transition backdrop-blur-sm text-lg"
            >
              Speak to Our Team
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── IMPACT STATS STRIP ────────────────────────────────────────── */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {communityMetrics.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-green-900/5 border border-green-50 flex flex-col items-center text-center group cursor-default h-full"
              >
                <div className="mb-6 w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-green-950 mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-green-600/60 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PILLARS (HOW TO JOIN) ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-green-950 mb-6 leading-tight">
              Four Ways You Can <br /><span className="text-green-600">Get Involved.</span>
            </h2>
            <p className="text-lg text-gray-400 font-medium">Whether you represent a global corporation or want to help as an individual, we have a place for you.</p>
          </div>
          <div className="hidden md:block">
            <ShieldCheck className="w-16 h-16 text-green-100" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {joinWays.map((item, i) => (
            <Link 
              key={i}
              href={item.link}
              className="group p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center hover:-translate-y-3"
            >
              <div className={`mb-8 w-20 h-20 ${item.color} text-white rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-900/10`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-black text-green-950 mb-4">{item.title}</h3>
              <p className="text-sm text-gray-500 font-medium mb-8 flex-grow leading-relaxed">{item.desc}</p>
              <div className={`w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300`}>
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PROJECT HIGHLIGHTS ────────────────────────────────────────── */}
      <section className="py-32 bg-green-50/50 border-y border-green-100/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-green-600 font-black mb-4 uppercase tracking-[0.2em] text-xs">
                <Zap className="w-4 h-4 fill-current" /> Impact in Motion
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-green-950 leading-tight">
                Live Community <br /><span className="text-green-600 italic font-serif font-normal">Initiatives</span>
              </h2>
            </div>
            <Link 
              href="/community-projects"
              className="px-10 py-5 bg-white border border-green-200 text-green-950 font-black rounded-2xl hover:border-green-400 hover:shadow-lg transition-all flex items-center gap-3 group"
            >
              Explore All Projects <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projects.map((project, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-green-900/5 border border-white hover:border-green-200 transition-all duration-500 h-full"
              >
                <div className="h-64 relative overflow-hidden">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-green-950/20 group-hover:bg-green-950/0 transition-colors" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black text-green-950 uppercase tracking-widest shadow-xl">
                    {project.category}
                  </div>
                </div>
                <div className="p-10 flex flex-col items-start flex-grow">
                  <div className="text-green-600 font-black text-[10px] mb-4 uppercase tracking-[0.2em] flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <Calendar className="w-3 h-3" /> {project.date}
                  </div>
                  <h3 className="text-2xl font-black text-green-950 mb-4 group-hover:text-green-600 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 font-medium mb-10 flex-grow leading-relaxed">
                    {project.desc}
                  </p>
                  <Link 
                    href="/auth/register"
                    className="inline-flex items-center gap-2 font-black text-green-950 hover:text-green-600 transition-colors border-b-2 border-green-100 hover:border-green-600 pb-1"
                  >
                    Join This Phase <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Quote className="w-16 h-16 text-green-100 mx-auto" />
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-5xl font-medium text-green-950 italic leading-tight mb-16 px-4 tracking-tight">
              &quot;Green Loop didn&apos;t just give us a way to dispose of waste; they gave us a sense of shared responsibility. My kids now compete to see who sorts the most plastic!&quot;
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center font-black text-green-700 text-2xl shadow-inner">
                MM
              </div>
              <div className="text-center">
                <div className="font-black text-green-950 text-xl tracking-tight">Mama Mike</div>
                <div className="text-xs font-bold text-green-600/50 uppercase tracking-widest mt-1">Community Eco-Warrior</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ─────────────────────────────────────────── */}
      <section className="py-32 pb-48">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-green-950 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-green-900/40">
            {/* Background Grain/Noise Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/p6.png")'}} />
            
            {/* Massive Green Orb */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600 rounded-full blur-[150px] opacity-30 -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-[0.9] tracking-tighter">
                READY TO <br />
                <span className="text-green-500">START SOMETHING?</span>
              </h2>
              <p className="text-xl text-green-100/70 mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
                Whether you&apos;re a student, a parent, or a business leader, your move accelerates our journey towards a cleaner, greener Ndagani.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <Link 
                  href="/auth/register"
                  className="px-12 py-6 bg-green-500 text-green-950 font-black rounded-3xl hover:bg-green-400 transition-all shadow-2xl shadow-green-500/30 transform hover:scale-105 text-lg"
                >
                  Create Your Identity
                </Link>
                <Link 
                  href="/contact"
                  className="px-12 py-6 border-2 border-white/20 text-white font-black rounded-3xl hover:bg-white/10 transition transform hover:scale-105 text-lg backdrop-blur-sm"
                >
                  Contact Community Hub
                </Link>
              </div>

              {/* Minimal Stats Inline */}
              <div className="mt-24 pt-16 border-t border-white/10 flex flex-wrap justify-center gap-12 md:gap-24">
                {stats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
