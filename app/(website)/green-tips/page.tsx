"use client";

import React from 'react';
import Link from 'next/link';
import { Leaf, Lightbulb, Droplets, Zap, Truck, ShoppingBag, ArrowLeft, ChevronRight, Globe, Star } from 'lucide-react';
import { motion } from "framer-motion";

const tips = [
  {
    title: "Reduce, Reuse, Recycle",
    desc: "The fundamental principle of waste management. Reduce consumption, reuse items, and properly recycle.",
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    category: "Waste"
  },
  {
    title: "Conserve Water at Home",
    desc: "Shorten showers, fix leaky faucets, and water plants efficiently to save thousands of gallons.",
    icon: <Droplets className="w-8 h-8 text-green-500" />,
    category: "Water"
  },
  {
    title: "Save Energy",
    desc: "Unplug electronics when not in use, switch to LED lighting, and use natural light whenever possible.",
    icon: <Zap className="w-8 h-8 text-green-400" />,
    category: "Energy"
  },
  {
    title: "Choose Sustainable Transport",
    desc: "Opt for walking, cycling, or public transport over driving. carpool or use electric vehicles when possible.",
    icon: <Truck className="w-8 h-8 text-green-700" />,
    category: "Mobility"
  },
  {
    title: "Support Local & Ethical",
    desc: "Buy local produce to reduce transport emissions and support ethical, sustainable companies.",
    icon: <ShoppingBag className="w-8 h-8 text-green-800" />,
    category: "Shopping"
  },
  {
    title: "Compost Food Scraps",
    desc: "Transform your food waste into rich soil. Composting reduces methane emissions from landfills.",
    icon: <Lightbulb className="w-8 h-8 text-green-300" />,
    category: "Soil"
  }
];

export default function GreenTipsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-green-50 py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Link 
            href="/learning-hub" 
            className="inline-flex items-center gap-2 text-green-600 font-bold mb-8 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-green-950 mb-6 leading-tight">
            Green Tips for <br/><span className="text-green-600">Sustainable Living</span>
          </h1>
          <p className="text-xl text-green-800 font-medium max-w-2xl mx-auto">
            Practical advice for living an eco-friendly life. Every small 
            action contributes to a healthier planet for Ndagani.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      </section>

      {/* Tips Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, i) => (
                <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-white border border-green-50 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                    <div className="mb-6 p-4 bg-green-50 rounded-3xl w-fit group-hover:scale-110 transition-transform">
                        {tip.icon}
                    </div>
                    <div className="text-green-600 font-bold text-xs mb-3 uppercase tracking-[0.2em]">{tip.category}</div>
                    <h3 className="text-2xl font-black text-green-950 mb-4">{tip.title}</h3>
                    <p className="text-green-800 font-medium leading-relaxed">
                        {tip.desc}
                    </p>
                </motion.div>
            ))}
        </div>

        {/* Highlight Section: Monthly Challenge */}
        <div className="mt-24 bg-green-950 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 to-transparent"></div>
            
            <div className="lg:w-1/2 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-800 rounded-full text-green-400 text-xs font-black mb-8 border border-green-700/50 uppercase tracking-widest">
                    <Star className="w-4 h-4 fill-current" /> Monthly Eco-Challenge
                </div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                    The No-Plastic <br/><span className="text-green-500 underline decoration-green-800">Week Challenge</span>
                </h2>
                <p className="text-xl text-green-100/80 mb-10 leading-relaxed font-medium">
                    Can you go 7 days without buying a single-use plastic bottle? 
                    Join 450+ other Ndagani residents this month and earn a 
                    bonus &quot;Eco-Warrior&quot; badge for your profile.
                </p>
                <div className="flex gap-12">
                    <div>
                        <div className="text-3xl font-black text-white mb-1">450+</div>
                        <div className="text-xs font-bold text-green-400 uppercase tracking-widest">Signed Up</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-white mb-1">2,400</div>
                        <div className="text-xs font-bold text-green-400 uppercase tracking-widest">Points Reward</div>
                    </div>
                </div>
            </div>

            <div className="lg:w-1/2 w-full relative z-10 flex items-center justify-center">
                <div className="w-full max-w-sm aspect-square bg-green-900 rounded-[3rem] p-12 border border-green-800 shadow-inner flex flex-col items-center justify-center text-center">
                    <Globe className="w-24 h-24 text-green-500 mb-8 animate-pulse" />
                    <button className="w-full py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-xl shadow-green-900/50 text-xl transform hover:-translate-y-1">
                        Accept Challenge
                    </button>
                    <p className="mt-6 text-sm font-bold text-green-400 uppercase tracking-widest">Starts in 3 Days</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-3xl font-black text-green-950 mb-8">Have a tip of your own?</h2>
            <p className="text-green-800 text-lg mb-10 font-medium">
                We&apos;re always looking for new ways to go green. Share your 
                sustainable living advice with the community.
            </p>
            <Link 
                href="/contact"
                className="inline-flex items-center gap-2 font-black text-green-950 hover:text-green-600 transition-colors group"
            >
                Submit Your Green Tip <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </section>
    </div>
  );
}
