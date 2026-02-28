"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight } from "lucide-react";

// Future: personalize based on user's recent scan history from Firestore
const TIPS = [
    { icon: "♻️", title: "Rinse before recycling", body: "Empty and rinse containers before placing them in recycling — food residue contaminates entire loads." },
    { icon: "🧴", title: "Flatten plastic bottles", body: "Squash plastic bottles and replace the cap to save space and keep recycling clean." },
    { icon: "🌿", title: "Composting organics", body: "Fruit peels, coffee grounds and vegetable scraps belong in organics, not general waste." },
    { icon: "📦", title: "Break down cardboard", body: "Always flatten cardboard boxes before putting them out — it doubles collection efficiency." },
    { icon: "💡", title: "Batteries go to e-waste", body: "Never put batteries in regular bins. Bring them to a Green Loop drop-off point." },
];

export default function SortingTips() {
    const [index, setIndex] = useState(0);
    const tip = TIPS[index];

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-black text-slate-900">AI Sorting Tips</h4>
                <span className="ml-auto text-[10px] text-slate-400 font-semibold">{index + 1}/{TIPS.length}</span>
            </div>

            <div className="px-5 py-5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.18 }}
                        className="bg-amber-50 border border-amber-100 rounded-xl p-4"
                    >
                        <p className="text-lg mb-2">{tip.icon}</p>
                        <p className="text-xs font-black text-amber-800 mb-1">{tip.title}</p>
                        <p className="text-[11px] text-amber-700 leading-snug">{tip.body}</p>
                    </motion.div>
                </AnimatePresence>

                <button
                    onClick={() => setIndex((i) => (i + 1) % TIPS.length)}
                    className="mt-3 flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                    Next tip <ChevronRight className="h-3 w-3" />
                </button>
            </div>
        </motion.div>
    );
}
