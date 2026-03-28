"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Package, Leaf, Zap, ArrowLeft, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface WasteCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    examples: string[];
    color: string;
    accent: string;
}

const categories: WasteCategory[] = [
    {
        id: 'recyclables',
        name: 'Recyclables (Blue Bin)',
        icon: <Package className="w-8 h-8" />,
        description: "Clean recyclables are processed into new products. In Ndagani, ensuring these items are empty and rinsed is critical to prevent contamination that ruins entire batches.",
        examples: [
            "PET/HDPE Plastic bottles (Rinsed)", 
            "Aluminum & Tin Cans", 
            "Clean Cardboard & Paper", 
            "Rinsed Glass bottles & Jars"
        ],
        color: 'bg-green-100 text-green-900 border-green-200',
        accent: 'bg-green-600'
    },
    {
        id: 'organics',
        name: 'Organic Waste (Green Bin)',
        icon: <Leaf className="w-8 h-8" />,
        description: "Organic waste accounts for nearly 60% of household waste in Chuka. When properly collected, it becomes high-quality compost for our local agricultural partners.",
        examples: [
            "Fruit & Vegetable Scraps", 
            "Coffee grounds & filters", 
            "Yard trimmings & Grass", 
            "Eggshells & Leftover food"
        ],
        color: 'bg-green-50 text-green-800 border-green-100',
        accent: 'bg-green-500'
    },
    {
        id: 'landfill',
        name: 'General Waste (Black Bin)',
        icon: <Trash2 className="w-8 h-8" />,
        description: "Items that cannot currently be recycled or composted in our Ndagani facility. We aim to minimize this bin as much as possible through better sorting.",
        examples: [
            "Sanitary & Hygiene products", 
            "Heavily soiled food wrappers", 
            "Greasy pizza boxes", 
            "Broken ceramics & mirrors"
        ],
        color: 'bg-green-900 text-green-50 border-green-800',
        accent: 'bg-green-700'
    },
    {
        id: 'hazardous',
        name: 'Special/Hazardous Waste',
        icon: <Zap className="w-8 h-8" />,
        description: "Items containing toxic heavy metals or chemicals that leach into soil and water if disposed of incorrectly. These require specialized Green Loop handling.",
        examples: [
            "Batteries (All types)", 
            "Electronics (E-waste)", 
            "Fluorescent bulbs & Sharps", 
            "Paints, chemicals, or oils"
        ],
        color: 'bg-green-800 text-green-100 border-green-700',
        accent: 'bg-green-400'
    },
];

export default function WasteClassificationPage() {
    const [activeCategory, setActiveCategory] = useState('recyclables');
    const selectedCategory = categories.find(cat => cat.id === activeCategory) || categories[0];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <section className="bg-green-950 py-20 px-6 text-white text-center overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-400 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2"></div>
                </div>
                
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link 
                        href="/learning-hub" 
                        className="inline-flex items-center gap-2 text-green-400 font-bold mb-8 hover:text-green-300 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        🔬 Waste <span className="text-green-500">Classification</span>
                    </h1>
                    <p className="text-xl text-green-100 font-medium max-w-2xl mx-auto">
                        Know your bins! Correct sorting is the first step to achieving zero waste. 
                        Select a category below to view detailed guidelines.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-24">
                {/* --- Category Tabs --- */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-black transition-all duration-300 ${
                                activeCategory === cat.id
                                    ? `bg-green-950 text-white shadow-xl shadow-green-900/20 scale-105`
                                    : 'bg-green-50 text-green-800 hover:bg-green-100'
                            }`}
                        >
                            <span className={activeCategory === cat.id ? 'text-green-400' : 'text-green-600'}>
                                {cat.icon}
                            </span>
                            <span>{cat.name.split(' (')[0]}</span>
                        </button>
                    ))}
                </div>

                {/* --- Detailed Content Area --- */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeCategory}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`p-10 md:p-16 rounded-[3.5rem] border shadow-2xl overflow-hidden relative ${selectedCategory.id === 'landfill' ? 'bg-green-950 text-green-50 border-green-900' : 'bg-white border-green-50 shadow-green-900/5'}`}
                    >
                        <div className="flex flex-col lg:flex-row gap-16 relative z-10">
                            <div className="lg:w-3/5">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className={`p-4 rounded-3xl ${selectedCategory.accent} text-white shadow-lg`}>
                                        {selectedCategory.icon}
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black">
                                        {selectedCategory.name}
                                    </h2>
                                </div>

                                <p className="text-xl leading-relaxed mb-10 font-medium">
                                    {selectedCategory.description}
                                </p>

                                <div className="bg-green-500/10 p-8 rounded-3xl border border-green-500/20">
                                    <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-green-500" /> Key Examples:
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                        {selectedCategory.examples.map((example, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                                                <span className="font-bold">{example}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="lg:w-2/5 flex items-center justify-center">
                                <div className="w-full aspect-square bg-green-50 rounded-[3rem] flex items-center justify-center border-4 border-dashed border-green-200">
                                    <div className="text-center p-8">
                                        <div className={`w-32 h-48 mx-auto rounded-xl border-4 ${selectedCategory.id === 'landfill' ? 'border-white bg-white/10' : 'border-green-900 bg-green-50'} mb-6 relative overflow-hidden`}>
                                            <div className="absolute top-4 left-0 w-full text-center font-black text-[10px] uppercase tracking-tighter opacity-20 leading-none">
                                                {selectedCategory.id}
                                            </div>
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-widest opacity-50">Bin Visual Representation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-24 text-center">
                    <Link 
                        href="/learning-hub/guides"
                        className="inline-flex items-center gap-2 font-black text-green-950 hover:text-green-600 transition-colors group"
                    >
                        ← View Recycling Guides <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
