"use client";

import React from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Globe, 
  Target, 
  ArrowLeft, 
  ShieldCheck, 
  BarChart4, 
  Megaphone,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from "framer-motion";

const sponsorshipProjects = [
  { 
    icon: <Globe className="w-8 h-8" />, 
    title: "Community Clean-Up Drives", 
    description: "Sponsor tools, logistics, and neighborhood mobilization for monthly high-impact cleaning events.",
    tier: "Starting at $500",
    color: "bg-green-600"
  },
  { 
    icon: <Zap className="w-8 h-8" />, 
    title: "School Education Kits", 
    description: "Fund curriculum-aligned educational materials and smart-sorting bins for local primary schools.",
    tier: "Starting at $1,200",
    color: "bg-emerald-600"
  },
  { 
    icon: <ShieldCheck className="w-8 h-8" />, 
    title: "Collector Safety Initiative", 
    description: "Provide medical insurance, high-viz gear, and digital training for independent waste collectors.",
    tier: "Starting at $2,500",
    color: "bg-lime-600"
  },
];

const benefits = [
  { title: "Brand Exposure", desc: "Logo placement on physical assets, digital platforms, and event marketing.", icon: <Megaphone className="w-5 h-5" /> },
  { title: "Impact Reporting", desc: "Detailed quarterly audits showing waste diverted and carbon offsets achieved.", icon: <BarChart4 className="w-5 h-5" /> },
  { title: "CSR Compliance", desc: "Official certification of your contribution to Sustainable Development Goals (SDGs).", icon: <CheckCircle2 className="w-5 h-5" /> },
];

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-white text-green-950 font-sans">
      
      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-32 bg-green-950 overflow-hidden text-center">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-600/20 via-transparent to-transparent opacity-50 select-none pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/community" className="inline-flex items-center gap-2 text-green-400 font-bold mb-10 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-900/50 rounded-full border border-green-800/50 text-green-400 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3" /> Partner with Green Loop
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-10 tracking-tighter"
          >
            INVEST IN A <br />
            <span className="text-green-500">CLEANER FUTURE.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-green-100/60 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Deploy your CSR capital where it matters most. Sponsor tangible community projects that drive circularity and empower local workforce.
          </motion.p>
        </div>
      </section>

      {/* ── PROJECT TIERS / OPTIONS ───────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sponsorshipProjects.map((project, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-green-950/10 border border-green-50 flex flex-col items-center text-center group"
            >
              <div className={`mb-8 w-20 h-20 ${project.color} text-white rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl`}>
                {project.icon}
              </div>
              <h3 className="text-2xl font-black text-green-950 mb-3">{project.title}</h3>
              <div className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest mb-6">
                {project.tier}
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>
              <Link 
                href="/contact"
                className="w-full py-4 bg-gray-50 text-green-950 font-black rounded-2xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
              >
                Inquire Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PARTNERSHIP BENEFITS ─────────────────────────────────────── */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-green-950 mb-4">Strategic Advantages</h2>
          <p className="text-gray-400 font-medium">Why the region&apos;s top organizations choose to partner with us.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-black text-green-950 mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA / CONTACT ─────────────────────────────────────────────── */}
      <section className="py-32 pb-48 px-6">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-green-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to Fuel <br />the Movement?</h2>
            <p className="text-green-50 text-lg mb-12 max-w-2xl mx-auto font-medium opacity-90">
              Contact our partnership team for a detailed proposal tailored to your corporate social responsibility goals and ESG requirements.
            </p>
            <Link 
              href="/contact"
              className="px-12 py-5 bg-white text-green-600 font-black rounded-2xl hover:bg-green-50 transition shadow-2xl text-lg inline-block"
            >
              Request a Proposal
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}