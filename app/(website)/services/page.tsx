"use client";

import React from 'react';
import Link from "next/link";
import {
  CreditCard,
  Package,
  Cpu,
  Trash2,
  Battery,
  FlaskConical,
  BarChart,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  PlusCircle,
  Calendar,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- DATA DEFINITIONS ---

const serviceSections = [
  {
    id: "account",
    category: "Subscription & Account Management",
    description: "The core of your digital relationship with Green Loop. Streamlined administrative tools for seamless service.",
    items: [
      {
        title: "Plan Management",
        details: "View your current tier or explore our specialized packages. Upgrade for faster pickups and higher point multipliers.",
        action: "Change Plan",
        link: "/dashboard/settings",
        icon: <Package className="w-10 h-10 text-emerald-600" />,
        accent: "bg-emerald-50",
        stats: "3 Available Tiers"
      },
      {
        title: "Digital Billing & Invoices",
        details: "Secure, paperless billing. Review your transaction history, settle balances, and automate your recurring payments.",
        action: "Pay My Bill",
        link: "/dashboard/billing",
        icon: <CreditCard className="w-10 h-10 text-blue-600" />,
        accent: "bg-blue-50",
        stats: "MPESA / Card"
      },
      {
        title: "Smart Bin Connectivity",
        details: "Activate your IoT nodes. Connect physical sensors to your dashboard for real-time fill-level monitoring.",
        action: "Link New Device",
        link: "/dashboard/devices",
        icon: <Cpu className="w-10 h-10 text-purple-600" />,
        accent: "bg-purple-50",
        stats: "AI-Sync Ready"
      }
    ]
  },
  {
    id: "pickup",
    category: "Specialized Pickup Requests",
    description: "Beyond the routine. Book on-demand handling for materials that require specialized logistical protocols.",
    items: [
      {
        title: "Bulk & Oversized Items",
        details: "Service for furniture, demolition debris, and appliances. Transparent pricing based on weight and volume.",
        action: "Request Bulk Pickup",
        link: "/schedule-pickup?type=bulk",
        icon: <Trash2 className="w-10 h-10 text-amber-600" />,
        accent: "bg-amber-50",
        stats: "Next Day Pickup"
      },
      {
        title: "E-Waste & Battery Disposal",
        details: "Safe recovery of toxic electronic components. We provide 'Certificates of Disposal' for all processed hardware.",
        action: "Schedule E-Waste Pick-up",
        link: "/schedule-pickup?type=ewaste",
        icon: <Battery className="w-10 h-10 text-cyan-600" />,
        accent: "bg-cyan-50",
        stats: "Secure Disposal"
      },
      {
        title: "Hazardous Materials",
        details: "Chassis-mounted containment for chemicals and medical waste. Compliant with local Ndagani safety regulations.",
        action: "Book Specialist Handling",
        link: "/schedule-pickup?type=hazardous",
        icon: <FlaskConical className="w-10 h-10 text-rose-600" />,
        accent: "bg-rose-50",
        stats: "Priority Case"
      }
    ]
  },
  {
    id: "business",
    category: "Business & Institutional Portal",
    description: "Tools for Ndagani's institutions and enterprises to manage their environmental compliance and audit trails.",
    items: [
      {
        title: "Waste Audit Services",
        details: "Professional on-site study of your waste stream. Identify cost-saving opportunities and efficiency gains.",
        action: "Request Audit",
        link: "/contact?subject=audit",
        icon: <BarChart className="w-10 h-10 text-indigo-600" />,
        accent: "bg-indigo-50",
        stats: "Annual/Quarterly"
      },
      {
        title: "Certificate of Recycling",
        details: "Access your verifiable impact documentation for ESG reporting or local environmental compliance.",
        action: "View Certificate",
        link: "/dashboard/reports",
        icon: <FileCheck className="w-10 h-10 text-green-600" />,
        accent: "bg-green-50",
        stats: "Official Copy"
      }
    ]
  }
];

// --- COMPONENTS ---

const ActionCard = ({ title, details, action, link, icon, accent, delay, stats }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay
      }}
      viewport={{ once: true }}
      className="group bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] hover:border-emerald-200 transition-all duration-700 relative overflow-hidden"
    >
      {/* 3D Floating Icon Container */}
      <div className={`w-24 h-24 ${accent} rounded-[2rem] flex items-center justify-center mb-10 relative shadow-inner group-hover:scale-110 transition-transform duration-500 perspective-1000`}>
        <motion.div
          whileHover={{ rotateY: 15, rotateX: -15, scale: 1.1 }}
          className="relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] flex items-center justify-center"
        >
          {icon}
        </motion.div>
        <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-gray-400 border border-gray-50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {stats}
        </div>
      </div>

      <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-emerald-900 transition-colors tracking-tight">
        {title}
      </h3>

      <p className="text-gray-500 font-bold leading-relaxed mb-10 text-sm md:text-base flex-grow">
        {details}
      </p>

      <div className="pt-6 border-t border-gray-50 mt-auto">
        <Link
          href={link}
          className="w-full inline-flex items-center justify-center px-10 py-5 bg-emerald-950 text-white font-black rounded-2xl hover:bg-emerald-800 transition-all transform active:scale-95 shadow-xl shadow-emerald-950/20"
        >
          {action}
          <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>

      {/* Glossy Overlay Mimicry */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">

      {/* Dynamic Header Section */}
      <header className="relative pt-32 pb-48 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-sm border border-emerald-50 mb-10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Transactional Action Center</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
                Digital <br />
                <span className="text-emerald-600 relative inline-block">
                  Service Hub
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 2 }}
                    className="absolute -bottom-4 left-0 h-3 bg-emerald-100 -z-10 rounded-full"
                  />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed font-bold italic mb-12">
                Professional waste management at your fingertips. Manage your subscriptions, schedules, and service requests with industrial-grade efficiency.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a href="#account" className="px-8 py-4 bg-emerald-950 text-white font-black rounded-2xl hover:bg-emerald-800 transition shadow-2xl">
                  View My Plans
                </a>
                <a href="#pickup" className="px-8 py-4 bg-white text-emerald-950 font-black rounded-2xl border border-gray-200 hover:border-emerald-200 transition">
                  Book Logistics
                </a>
              </div>
            </motion.div>

            {/* 3D Visual Replacement with Animated Icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="lg:w-2/5 relative"
            >
              <div className="w-full aspect-square bg-white rounded-[4rem] shadow-[-20px_40px_80px_-20px_rgba(0,0,0,0.1)] border border-gray-50 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 via-white to-blue-50 opacity-40"></div>

                {/* Floating Elements (Mimicking 3D photos) */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-emerald-300 rounded-full"
                      style={{ transform: `rotate(${i * 90}deg) translateY(-140px)` }}
                    />
                  ))}
                </motion.div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Layers className="w-40 h-40 text-emerald-950 drop-shadow-2xl opacity-80" />
                  </motion.div>
                  <div className="text-center">
                    <div className="text-4xl font-black text-emerald-950 tracking-tighter">Nd-HUB v2.0</div>
                    <div className="text-xs font-black text-emerald-500 tracking-[0.4em] uppercase mt-2">Verified Endpoint</div>
                  </div>
                </div>

                {/* Corner Accents */}
                <PlusCircle className="absolute top-12 left-12 w-8 h-8 text-emerald-100" />
                <Calendar className="absolute bottom-12 right-12 w-8 h-8 text-blue-100" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute top-0 right-0 w-[50vh] h-[50vh] bg-emerald-100/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      </header>

      {/* Main Grid Sections */}
      <main className="max-w-7xl mx-auto px-6 pb-48 space-y-48">

        {serviceSections.map((section, sIdx) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <div className="flex flex-col md:flex-row items-end gap-10 mb-20">
              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-1 px-0 bg-emerald-600 rounded-full"></div>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Portal 0{sIdx + 1}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                  {section.category}
                </h2>
                <p className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed italic">
                  {section.description}
                </p>
              </div>
              <div className="h-px bg-gray-100 flex-grow hidden md:block mb-6 opacity-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
              {section.items.map((item, iIdx) => (
                <ActionCard
                  key={iIdx}
                  {...item}
                  delay={iIdx * 0.15}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Comparison Logic Highlight (The Matrix) */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="bg-emerald-950 rounded-[4rem] p-12 md:p-24 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,10,0,0.4)]"
        >
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight">Intent Tracking</h2>
                <p className="text-emerald-100/70 text-xl font-bold leading-relaxed max-w-lg">
                  Not sure where to navigate? Our platform is divided into three distinct zones based on your current mission.
                </p>
              </div>

              <div className="grid gap-6">
                {[
                  { title: "Report Waste Issues", label: "Something is wrong.", icon: <ShieldCheck className="text-emerald-400" />, shadow: "shadow-emerald-900/40" },
                  { title: "Online Services", label: "I want to do/buy/manage.", icon: <Zap className="text-yellow-400" />, shadow: "shadow-yellow-900/40" },
                  { title: "Sustainability Center", label: "I want to learn/see impact.", icon: <Globe className="text-blue-400" />, shadow: "shadow-blue-900/40" }
                ].map((row, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 20 }}
                    className={`flex items-center gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group ${row.shadow}`}
                  >
                    <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {row.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white tracking-tight mb-1">{row.title}</div>
                      <div className="text-sm text-emerald-100/50 font-black uppercase tracking-widest">{row.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-[3.5rem] p-16 text-gray-900 shadow-3xl text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="w-32 h-32 bg-emerald-100 rounded-[2.5rem] mx-auto mb-12 flex items-center justify-center shadow-xl"
                >
                  <Zap className="w-16 h-16 text-emerald-950" />
                </motion.div>

                <h3 className="text-3xl font-black mb-6 tracking-tight">Action Center v2</h3>
                <p className="text-gray-500 mb-12 leading-relaxed font-bold italic text-lg">
                  Optimized for Ndagani logistics. Secure, transactional, and built for high-performance waste management.
                </p>

                <div className="space-y-4">
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center px-10 py-6 bg-emerald-950 text-white font-black rounded-2xl hover:bg-emerald-800 transition transform active:scale-95 shadow-2xl"
                  >
                    Enter User Dashboard
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                  <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600 transition">
                    View Hub Docs (Online)
                  </button>
                </div>
              </div>

              {/* 3D Decorative Orbs */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-400 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>

          {/* Decorative background details */}
          <div className="absolute inset-0 bg-[url('/images/dots.png')] opacity-[0.05] pointer-events-none"></div>
        </motion.section>
      </main>

      {/* Footer Branding */}
      <footer className="py-24 text-center border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs font-black text-gray-400 uppercase tracking-[0.5em] mb-4">The Green Loop Network</div>
          <p className="text-gray-900 font-black text-lg">Professional. Transactional. Sustainable.</p>
        </div>
      </footer>
    </div>
  );
}
