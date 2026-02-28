"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Truck,
    MapPin,
    Zap,
    Route,
    Timer,
    ShieldCheck,
    Smartphone
} from "lucide-react";
import { motion } from "framer-motion";

export default function EcoCollectionInfoPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-32 bg-gradient-to-b from-green-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-8"
                        >
                            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold tracking-wide">
                                NEXT-GEN LOGISTICS
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                Smart <span className="text-green-600">Eco-Friendly</span> Collection
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                We&apos;ve reinvented waste collection. Using AI-optimized routing and an eco-conscious fleet, we ensure every pickup is fast, reliable, and has the lowest carbon footprint possible.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/schedule-pickup"
                                    className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition shadow-2xl shadow-green-600/30 flex items-center gap-2 transform hover:-translate-y-1"
                                >
                                    Schedule Initial Pickup <Truck className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl transform hover:-translate-y-1"
                                >
                                    Join the Loop
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white group" style={{ height: '500px' }}>
                                <Image
                                    src="/images/3d/eco-collection.png"
                                    alt="Eco-Friendly Collection Truck 3D Render"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
                            </div>

                            {/* Floating feature cards */}
                            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-gray-50 hidden md:block animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                        <Zap className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-gray-900 leading-none">30% Less Fuel</div>
                                        <div className="text-xs text-green-600 font-bold mt-1 uppercase tracking-widest">AI Optimized</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* Core Technology Grid */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">How We Collect Differently</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our four-pillar approach to sustainable urban logistics.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-green-600 transition-colors duration-500">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                <Route className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Smart Routing AI</h3>
                            <p className="text-gray-600 text-lg leading-relaxed group-hover:text-green-50 transition-colors">
                                Our proprietary algorithm calculates the most fuel-efficient paths for every pickup, reducing carbon emissions and ensuring we arrive exactly on time, every time.
                            </p>
                        </div>

                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-emerald-600 transition-colors duration-500">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                <Zap className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Ultra-Low Emission Fleet</h3>
                            <p className="text-gray-600 text-lg leading-relaxed group-hover:text-emerald-50 transition-colors">
                                From electric collection bikes for narrow streets to CNG-powered trucks, our fleet is chosen for maximum efficiency and minimum environmental impact.
                            </p>
                        </div>

                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-green-700 transition-colors duration-500">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                <Timer className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">On-Demand Pickups</h3>
                            <p className="text-gray-600 text-lg leading-relaxed group-hover:text-green-50 transition-colors">
                                No more waiting for &quot;trash day&quot;. Request a pickup through the mobile app when your bin is full. Smart sensors can even trigger this automatically.
                            </p>
                        </div>

                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 group hover:bg-emerald-500 transition-colors duration-500">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">Safe & Sanitary Handling</h3>
                            <p className="text-gray-600 text-lg leading-relaxed group-hover:text-emerald-50 transition-colors">
                                Our collectors are equipped with professional safety gear and trained in hazardous material handling, ensuring a clean and safe process for your community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Interaction Section */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 text-green-600 font-bold mb-4 uppercase tracking-widest text-sm">
                                <Smartphone className="w-5 h-5" /> Experience Logic
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                                Collection at Your <span className="text-green-600">Fingertips</span>
                            </h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        title: "Instant Scheduling",
                                        desc: "Book a pickup timeframe that works for you in under 30 seconds."
                                    },
                                    {
                                        title: "Live Tracking",
                                        desc: "Watch our eco-trucks on the map as they head to your location."
                                    },
                                    {
                                        title: "Digital Proof of Deposit",
                                        desc: "Receive an instant notification and digital receipt for every kg collected."
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center font-black text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900 mb-2">{item.title}</h4>
                                            <p className="text-gray-600 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <div className="bg-white p-10 rounded-[3rem] shadow-2xl relative z-10">
                                <div className="aspect-square bg-green-50 rounded-[2rem] flex items-center justify-center p-8">
                                    <div className="w-full h-full bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center p-6 text-center">
                                        <MapPin className="w-16 h-16 text-green-600 mb-4 animate-bounce" />
                                        <div className="text-2xl font-black text-gray-900">Your Street</div>
                                        <div className="text-sm font-bold text-gray-400 mt-1">Arrival in 8 minutes</div>
                                        <div className="mt-8 w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="w-2/3 h-full bg-green-500"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-600 rounded-full blur-[80px] opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-gray-900 rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready for a <br />Cleaner Community?</h2>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link
                                    href="/schedule-pickup"
                                    className="px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition shadow-2xl shadow-green-600/20 transform hover:scale-105"
                                >
                                    Start Your First Pickup
                                </Link>
                                <Link
                                    href="/services"
                                    className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition transform hover:scale-105"
                                >
                                    View All Services
                                </Link>
                            </div>
                        </div>
                        {/* Background branding */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-white opacity-[0.02] pointer-events-none uppercase">
                            Collection
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
