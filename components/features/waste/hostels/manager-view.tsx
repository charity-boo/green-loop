'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, CheckCircle2, TrendingUp, Loader2, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { BookingModal } from "./booking-modal";

interface HostelStats {
  totalWasteKg: number;
  totalStudents: number;
  hostelCount: number;
  diversionRate: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 26 } },
};

const TIERS = [
  {
    id: "standard",
    name: "Standard",
    price: "KES 5K",
    sub: "For smaller residences",
    accent: "border-green-100",
    accentBar: "bg-green-100",
    cta: "Get Started",
    ctaClass: "border-2 border-green-200 hover:bg-green-900 hover:text-white hover:border-green-900",
    featured: false,
    features: [
      "Weekly pickup — Mon, Wed, Fri",
      "Monthly impact PDF report",
      "1 sorted bin set installed",
      "Student leaderboard access",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "KES 12K",
    sub: "Complete property management",
    accent: "border-green-500",
    accentBar: "bg-green-500",
    cta: "Go Premium",
    ctaClass: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100",
    featured: true,
    features: [
      "Daily pickup — Mon to Sat",
      "Student gamification & rewards",
      "Full live analytics dashboard",
      "3 sorted bin sets installed",
      "Priority support line",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    sub: "Large campuses & estates",
    accent: "border-green-100",
    accentBar: "bg-green-900",
    cta: "Contact Sales",
    ctaClass: "border-2 border-green-200 hover:bg-green-900 hover:text-white hover:border-green-900",
    featured: false,
    features: [
      "7-day daily operations",
      "Dedicated account manager",
      "Custom API integration",
      "SLA-backed response times",
    ],
  },
];

export function ManagerView() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<HostelStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetch('/api/hostels/stats')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: HostelStats) => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setIsLoadingStats(false));
  }, []);

  const handleBook = (tierId: string) => {
    const label = TIERS.find((t) => t.id === tierId)?.name ?? tierId;
    setSelectedTier(label);
    setIsModalOpen(true);
  };

  const fmtWaste = (kg: number) => kg >= 1000 ? `${(kg / 1000).toFixed(1)} t` : `${kg} kg`;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10">

      {/* Analytics strip */}
      <motion.div variants={item}>
        <Card className="border border-green-100 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-green-50 pb-4 flex flex-row items-center justify-between bg-white">
            <div>
              <CardTitle className="text-base font-bold text-green-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" /> Platform Impact
              </CardTitle>
              <CardDescription className="text-xs mt-0.5 text-green-700/60">
                Live data from all registered hostels on Green Loop
              </CardDescription>
            </div>
            <a href="/contact" className="text-xs font-bold text-green-600 hover:underline">
              Request full report →
            </a>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-green-50">
              {isLoadingStats ? (
                <div className="col-span-3 flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Total Recycled</p>
                    <p className="text-3xl font-black text-green-950">{stats ? fmtWaste(stats.totalWasteKg) : "—"}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Across all active properties
                    </p>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Diversion Rate</p>
                    <p className="text-3xl font-black text-green-950">
                      {stats?.diversionRate != null ? `${stats.diversionRate}%` : "—"}
                    </p>
                    <p className="text-xs text-green-600/40 font-medium mt-1">Target: 75% · industry avg: 45%</p>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">Registered Students</p>
                    <p className="text-3xl font-black text-green-950">
                      {stats?.totalStudents != null ? stats.totalStudents.toLocaleString() : "—"}
                    </p>
                    <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {stats?.hostelCount ?? 0} properties onboarded
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pricing */}
      <motion.div variants={item}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-green-950 tracking-tight">Service Plans</h2>
          <p className="text-green-800/50 text-sm mt-1.5">No hidden fees. Cancel or upgrade any time.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TIERS.map((tier) => (
            <Card
              key={tier.id}
              className={`border-2 rounded-2xl overflow-hidden flex flex-col bg-white ${tier.accent} ${tier.featured ? "shadow-xl shadow-green-100/60 scale-[1.02] z-10" : "shadow-sm"}`}
            >
              {tier.featured && (
                <div className="bg-green-600 text-white text-[10px] uppercase font-black tracking-widest text-center py-1.5">
                  Most Popular
                </div>
              )}
              <div className={`h-1 w-full ${tier.accentBar}`} />

              <CardHeader className="pb-2 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">{tier.sub}</p>
                <CardTitle className={`text-xl font-black mt-0.5 ${tier.featured ? "text-green-800" : "text-green-900"}`}>
                  {tier.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow pt-0 pb-6 px-6">
                <div className="mb-5">
                  <span className={`text-4xl font-black ${tier.featured ? "text-green-600" : "text-green-950"}`}>
                    {tier.price}
                  </span>
                  {tier.price !== "Custom" && (
                    <span className="text-green-400 text-sm font-medium ml-1">/month</span>
                  )}
                </div>

                <ul className="space-y-2.5 flex-grow mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-green-800/70 font-medium">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 shrink-0 ${tier.featured ? "text-green-500" : "text-green-400"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleBook(tier.id)}
                  className={`w-full rounded-xl font-bold h-11 ${tier.ctaClass}`}
                  variant={tier.featured ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Contact strip */}
      <motion.div variants={item}>
        <div className="rounded-2xl border border-green-100 bg-green-50/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-green-900">Not sure which plan fits?</p>
            <p className="text-sm text-green-800/60 mt-0.5">Talk to our team — we&apos;ll recommend the right setup for your property size.</p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white border border-green-200 hover:border-green-500 hover:text-green-600 text-green-700 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shadow-sm"
          >
            <Phone className="h-4 w-4" /> Talk to us
          </a>
        </div>
      </motion.div>

      {selectedTier && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedTier(null); }}
          tier={selectedTier}
        />
      )}
    </motion.div>
  );
}
