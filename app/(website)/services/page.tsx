"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Calendar,
  Recycle,
  BarChart3,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  Leaf,
  ChevronRight,
  Info,
  LucideIcon
} from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  link: string;
  color: string;
  stats?: string;
}

const ServiceCard = ({ icon: Icon, title, description, features, link, color, stats }: ServiceCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full group"
  >
    <div className={`h-2 w-full ${color}`} />
    <div className="p-8 flex-1 flex flex-col">
      <div className={`w-14 h-14 rounded-xl ${color.replace('bg-', 'bg-opacity-10 text-')} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 mb-6 line-clamp-2">{description}</p>
      
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {stats && (
        <div className="bg-slate-50 rounded-lg p-3 mb-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            {stats}
          </span>
        </div>
      )}

      <Link 
        href={link}
        className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors group"
      >
        Access Service
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

export default function ServicesPage() {
  const services = [
    {
      id: "pickup",
      icon: Truck,
      title: "Smart Waste Pickup",
      description: "On-demand and scheduled collection for households and small businesses.",
      features: [
        "AI-optimized routing",
        "Real-time collector tracking",
        "Flexible scheduling options",
        "Photo-verified completion"
      ],
      link: "/schedule-pickup",
      color: "bg-emerald-500",
      stats: "Active in Ndagani"
    },
    {
      id: "report",
      icon: MapPin,
      title: "Community Reporting",
      description: "Crowdsourced environmental cleanup tools for reporting illegal dumping or bin overflows.",
      features: [
        "Geo-tagged reporting",
        "Instant admin alerts",
        "Public progress tracking",
        "Community impact rewards"
      ],
      link: "/report",
      color: "bg-blue-500",
      stats: "Real-time Priority"
    },
    {
      id: "hub",
      icon: Recycle,
      title: "Sustainability Hub",
      description: "Educational resources and sorting tools to help you close the circular economy loop.",
      features: [
        "AI waste classifier",
        "Recycling guidelines",
        "Circular economy info",
        "Material lifecycle data"
      ],
      link: "/learning-hub",
      color: "bg-amber-500",
      stats: "AI-Sync Ready"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Impact Analytics",
      description: "Quantified environmental data for individuals and government governance.",
      features: [
        "Personal carbon offset",
        "Waste diversion metrics",
        "Community benchmarks",
        "Exportable ESG reports"
      ],
      link: "/auth/login",
      color: "bg-indigo-500",
      stats: "Personal Dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-slate-900 pt-32 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Leaf className="w-3.5 h-3.5 fill-current" />
              Circular Ecosystem
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              Closing the Loop with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Smart Services</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We combine community intelligence with AI-driven operations to provide Ndagani with 
              world-class sustainable waste infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                <Info className="w-5 h-5" />
                Specialized Support
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                Are you a large waste producer?
              </h2>
              <p className="text-slate-400 text-lg">
                We offer bulk collection and material management contracts for hotels, hospitals, 
                and university facilities at Ndagani.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/contact-us"
                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all hover:scale-105"
              >
                Contact Commercial Team
                <ChevronRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-700 text-white">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-xs">
                  <p className="font-bold">24/7 Response</p>
                  <p className="text-slate-500">Commercial Hotline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operation Hours/Contact Footer Info */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Standard Hours</p>
                <p className="text-sm text-slate-500">08:00 AM - 18:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Collection Days</p>
                <p className="text-sm text-slate-500">Mon - Sat (Weekly)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">NEMA Certified</p>
                <p className="text-sm text-slate-500">License: #WM-2024-001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
