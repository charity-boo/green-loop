"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Handshake, 
  ArrowLeft, 
  Globe, 
  Zap, 
  TrendingUp, 
  Sparkles,
  Building2,
  Workflow,
  BarChart4
} from 'lucide-react';
import { motion } from "framer-motion";

const partnerCategories = [
  {
    title: "Technology & Innovation",
    icon: <Zap className="w-6 h-6" />,
    description: "Seeking firms specializing in advanced sensor technology, computer vision, and AI modeling for global waste recognition.",
    color: "bg-green-600"
  },
  {
    title: "Logistics & Fleet",
    icon: <Workflow className="w-6 h-6" />,
    description: "Collaborating with route optimization software providers and sustainable fuel suppliers to minimize our carbon footprint.",
    color: "bg-emerald-600"
  },
  {
    title: "NGOs & Advocacy",
    icon: <Globe className="w-6 h-6" />,
    description: "Working with environmental organizations to promote policy changes and scale our grassroots educational programs.",
    color: "bg-lime-600"
  },
  {
    title: "Recycling Facilities",
    icon: <Building2 className="w-6 h-6" />,
    description: "Partnering with certified processing hubs to ensure 100% of collected materials are diverted from landfills.",
    color: "bg-teal-600"
  }
];

const processSteps = [
  { n: "01", title: "Discovery", desc: "Initial consultation to align mission values and strategic goals." },
  { n: "02", title: "Strategic Audit", desc: "Expert assessment of operational synergy and impact potential." },
  { n: "03", title: "Integration", desc: "Seamless deployment of pilot programs and technical API syncing." },
  { n: "04", title: "Scaling", desc: "Full-scale rollout across our expanding network of regional hubs." }
];

export default function PartnershipsPage() {
  return (
    <div className="min-h-screen bg-white text-green-950 font-sans">
      
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-32 bg-green-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/50 rounded-full blur-[130px] translate-x-1/2 -translate-y-1/2" />
        
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
              <Handshake className="w-3 h-3" /> Global Alliances
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black text-green-950 leading-[0.9] mb-10 tracking-tighter"
            >
              ALIGNED FOR <br />
              <span className="text-green-600">SYSTEMIC IMPACT.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed max-w-3xl"
            >
              Join a strategic ecosystem of innovators and leaders. We collaborate with firms and governments to build a truly circular waste economy.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES GRID ──────────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnerCategories.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-green-900/5 border border-green-50 flex flex-col items-center text-center group cursor-default h-full"
            >
              <div className={`mb-8 w-16 h-16 ${cat.color} text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-950/10`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-black text-green-950 mb-3 tracking-tight">{cat.title}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PARTNERSHIP STEPPER ───────────────────────────────────────── */}
      <section className="py-32 bg-green-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-800 rounded-full blur-[150px] opacity-10 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">The Path to Integration</h2>
            <p className="text-green-400 font-bold uppercase tracking-[0.2em] text-xs">Our Four-Phase Strategic Lifecycle</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Horizontal Line on Desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-green-900/50 z-0" />
            
            {processSteps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-green-900 border-4 border-green-950 rounded-[3rem] text-white flex items-center justify-center text-3xl font-black mb-8 group hover:bg-green-600 transition-colors duration-300">
                  {step.n}
                </div>
                <h4 className="text-xl font-black text-white mb-3 tracking-tight">{step.title}</h4>
                <p className="text-sm text-green-100/40 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B FEATURE LIST ─────────────────────────────────────────── */}
      <section className="py-32 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-green-950 mb-8 leading-tight tracking-tight">Enterprise Scaling & <br /><span className="text-green-600">Global Standards.</span></h2>
            <div className="space-y-6">
              {[
                { t: "Deep API Integration", d: "Seamlessly connect your legacy waste systems to our real-time tracking hub.", i: <Zap className="w-5 h-5" /> },
                { t: "Measurable ESG Metrics", d: "Hard data points for your sustainability reports and stakeholder audits.", i: <BarChart4 className="w-5 h-5" /> },
                { t: "Logistics Optimization", d: "Reduce your operational costs by over 25% through smart route planning.", i: <TrendingUp className="w-5 h-5" /> },
              ].map((feature, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="mt-1 w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    {feature.i}
                  </div>
                  <div>
                    <h5 className="font-black text-green-950 mb-1">{feature.t}</h5>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">{feature.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-green-50 rounded-[4rem] p-12 relative overflow-hidden border border-green-100/50">
              <Sparkles className="w-12 h-12 text-green-200 mb-8" />
              <p className="text-2xl font-bold text-green-950/80 italic leading-relaxed mb-10">
                &quot;Green Loop is the strategic layer Ndagani was missing. Their focus on B2B integration makes scaling a breeze.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-black">
                  JD
                </div>
                <div>
                  <div className="font-black text-green-950">Jane Doe</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VP, Ndagani Logistics Hub</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 bg-white pb-48">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-green-600 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-green-900/40">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-[0.9] tracking-tighter italic font-serif font-normal">Start a Strategic <br />Inquiry Today.</h2>
              <p className="text-green-50 text-xl mb-12 max-w-2xl mx-auto font-medium opacity-90 leading-relaxed">
                Connect with our partnership executives to receive a specialized integration proposal and feasibility study.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8">
                <Link 
                  href="/contact"
                  className="px-12 py-5 bg-white text-green-950 font-black rounded-2xl hover:bg-green-50 transition shadow-2xl transform hover:scale-105 text-lg"
                >
                  Request Partnership Deck
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}