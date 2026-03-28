"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronRight, Sparkles, History } from "lucide-react";

interface PersonalizedTip {
    id: string;
    wasteType: string;
    tips: string;
    date: string;
}

interface SortingTipsProps {
    recentAiTips?: PersonalizedTip[];
}

const STATIC_TIPS = [
    { icon: "♻️", title: "Rinse before recycling", body: "Empty and rinse all PET and HDPE containers. Food residue contaminates entire batches, making them unrecyclable in Ndagani." },
    { icon: "🧴", title: "Flatten plastic bottles", body: "Squash plastic bottles and replace the cap to save space and keep recycling clean — this doubles our collection efficiency." },
    { icon: "🌿", title: "Master the Magic Ratio", body: "For perfect compost, use 2 parts Carbon-rich 'Browns' (dry leaves) to 1 part Nitrogen-rich 'Greens' (kitchen scraps)." },
    { icon: "📦", title: "Break down cardboard", body: "Always flatten cardboard boxes. Bulky items slow down our transport routes across Chuka and reduce overall impact." },
    { icon: "💡", title: "E-Waste Dangers", body: "Batteries and old phones contain toxic mercury and lead. Never put them in regular bins — use our specialized e-waste collection." },
];

export default function SortingTips({ recentAiTips = [] }: SortingTipsProps) {
    const [index, setIndex] = useState(0);

    const tips = useMemo(() => {
        const personalized = recentAiTips.map(t => ({
            icon: <Sparkles className="h-4 w-4 text-indigo-500" />,
            title: `Your Recent ${t.wasteType} Scan`,
            body: t.tips,
            isPersonalized: true
        }));
        
        const staticOnes = STATIC_TIPS.map(t => ({
            icon: t.icon,
            title: t.title,
            body: t.body,
            isPersonalized: false
        }));

        return [...personalized, ...staticOnes];
    }, [recentAiTips]);

    const tip = tips[index];

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-white/50">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">AI Sorting Tips</h4>
                <span className="ml-auto text-[10px] text-slate-400 font-bold uppercase tracking-widest">{index + 1} / {tips.length}</span>
            </div>

            <div className="px-5 py-5">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`rounded-2xl p-4 border transition-colors ${
                            tip.isPersonalized 
                                ? "bg-indigo-50/50 border-indigo-100" 
                                : "bg-amber-50/50 border-amber-100"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${
                                tip.isPersonalized ? "bg-indigo-100" : "bg-amber-100"
                            }`}>
                                {typeof tip.icon === 'string' ? <span className="text-sm">{tip.icon}</span> : tip.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className={`text-[11px] font-black uppercase tracking-wider ${
                                        tip.isPersonalized ? "text-indigo-800" : "text-amber-800"
                                    }`}>
                                        {tip.title}
                                    </p>
                                    {tip.isPersonalized && (
                                        <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest">Recent</span>
                                    )}
                                </div>
                                <p className={`text-xs font-medium leading-relaxed ${
                                    tip.isPersonalized ? "text-indigo-700" : "text-amber-700"
                                }`}>
                                    {tip.body}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        onClick={() => setIndex((i) => (i + 1) % tips.length)}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-all group"
                    >
                        Next tip 
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    
                    {tip.isPersonalized && (
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                            <History className="h-3 w-3" /> Based on your activity
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
