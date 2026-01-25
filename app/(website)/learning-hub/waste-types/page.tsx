"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Package, Leaf, Zap } from 'lucide-react';

interface WasteCategory {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    examples: string[];
    color: string;
}

const categories: WasteCategory[] = [
    {
        id: 'recyclables',
        name: 'Recyclables (Blue Bin)',
        icon: <Package className="w-8 h-8" />,
        description: "Items that can be processed and reused to create new products. These must be clean and empty.",
        examples: [
            "Plastic bottles (PET/HDPE)", 
            "Aluminum/Tin Cans", 
            "Cardboard & Paper", 
            "Glass bottles & Jars"
        ],
        color: 'border-blue-500 text-blue-700 bg-blue-50'
    },
    {
        id: 'organics',
        name: 'Organic Waste (Green Bin)',
        icon: <Leaf className="w-8 h-8" />,
        description: "Materials derived from plants or animals, intended for composting and turning into soil amendments.",
        examples: [
            "Food scraps & Peels", 
            "Coffee grounds & Filters", 
            "Yard trimmings & Grass", 
            "Compostable paper towels"
        ],
        color: 'border-green-500 text-green-700 bg-green-50'
    },
    {
        id: 'landfill',
        name: 'General Waste (Black Bin)',
        icon: <Trash2 className="w-8 h-8" />,
        description: "Items that cannot be recycled or composted and must be safely disposed of in a landfill.",
        examples: [
            "Diapers & Hygiene products", 
            "Plastic bags & Film (Non-recyclable)", 
            "Contaminated paper/cardboard", 
            "Broken ceramics & Non-recyclable glass"
        ],
        color: 'border-gray-500 text-gray-700 bg-gray-50'
    },
    {
        id: 'hazardous',
        name: 'Special/Hazardous Waste',
        icon: <Zap className="w-8 h-8" />,
        description: "Items that require special handling due to hazardous or toxic properties, and cannot go in regular bins.",
        examples: [
            "Batteries (All types)", 
            "Electronics (E-waste)", 
            "Fluorescent bulbs", 
            "Paints, chemicals, or oils"
        ],
        color: 'border-yellow-600 text-yellow-800 bg-yellow-50'
    },
];

export default function WasteClassificationPage() {
    const [activeCategory, setActiveCategory] = useState('recyclables');
    const selectedCategory = categories.find(cat => cat.id === activeCategory) || categories[0];

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">
                    🔬 Waste Classification Guide
                </h1>
                <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                    Know your bins! Correct sorting is the first step to achieving zero waste. Select a category below to view detailed guidelines.
                </p>

                {/* --- Category Tabs --- */}
                <div className="flex flex-wrap justify-center gap-4 border-b border-gray-200 pb-4 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
                                activeCategory === cat.id
                                    ? `bg-${cat.id === 'recyclables' ? 'blue' : cat.id === 'organics' ? 'green' : cat.id === 'landfill' ? 'gray' : 'yellow'}-600 text-white shadow-lg`
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {cat.icon}
                            <span>{cat.name.split(' (')[0]}</span>
                        </button>
                    ))}
                </div>

                {/* --- Detailed Content Area --- */}
                <div className={`p-8 rounded-xl shadow-2xl border-l-8 ${selectedCategory.color}`}>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="p-3 rounded-full bg-white shadow-md">
                            {selectedCategory.icon}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">
                            {selectedCategory.name}
                        </h2>
                    </div>

                    <p className="text-lg text-gray-700 mb-6 border-b pb-4">
                        {selectedCategory.description}
                    </p>

                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Key Examples:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-600">
                        {selectedCategory.examples.map((example, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <span className="text-green-500 font-bold text-lg">•</span>
                                <span>{example}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link 
                        href="/learning-hub/guides"
                        className="text-gray-600 hover:text-green-600 font-semibold hover:underline"
                    >
                        ← View Recycling Guides
                    </Link>
                </div>
            </div>
        </div>
    );
}