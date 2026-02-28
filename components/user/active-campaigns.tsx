"use client";

import { motion } from "framer-motion";
import { Megaphone, ArrowRight } from "lucide-react";

// Future: wire to Firestore `campaigns` collection with onSnapshot
const MOCK_CAMPAIGNS = [
    {
        id: "c1",
        title: "Plastic-Free February",
        description: "Reduce single-use plastic this month and earn double points.",
        cta: "Join Now",
        accent: "bg-blue-50 border-blue-100 text-blue-700",
    },
    {
        id: "c2",
        title: "Community Clean-Up Drive",
        description: "Join your neighbours this Saturday for a local park cleanup.",
        cta: "RSVP",
        accent: "bg-lime-50 border-lime-100 text-lime-700",
    },
    {
        id: "c3",
        title: "E-Waste Amnesty Week",
        description: "Drop off old electronics at any collection point for free.",
        cta: "Learn More",
        accent: "bg-amber-50 border-amber-100 text-amber-700",
    },
];

export default function ActiveCampaigns() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <Megaphone className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">Active Campaigns</h4>
            </div>
            <div className="divide-y divide-slate-50">
                {MOCK_CAMPAIGNS.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        className={`px-5 py-4 ${c.accent} border-l-4 m-3 rounded-xl`}
                    >
                        <p className="text-xs font-black mb-0.5">{c.title}</p>
                        <p className="text-[11px] opacity-80 mb-2 leading-snug">{c.description}</p>
                        <button className="flex items-center gap-1 text-[11px] font-bold hover:underline">
                            {c.cta} <ArrowRight className="h-3 w-3" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
