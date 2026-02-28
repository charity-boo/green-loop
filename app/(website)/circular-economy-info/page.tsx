"use client";

import Image from 'next/image';
import Link from "next/link";
import {
    RefreshCcw,
    Coins,
    Users,
    Sprout,
    ArrowRight,
    CheckCircle2,
    ShoppingBag,
    Globe,
    TrendingUp,
    Heart
} from "lucide-react";
import { motion } from "framer-motion";

export default function CircularEconomyPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-32 bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-8 text-center lg:text-left"
                        >
                            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold tracking-wide">
                                MODEL OF TOMORROW
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                Closing the <span className="text-emerald-600">Loop</span> for Good
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                The circular economy is a model of production and consumption that involves sharing, leasing, reusing, repairing, refurbishing, and recycling existing materials. At Green Loop, we turn this concept into a neighborhood reality.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Link
                                    href="/auth/register"
                                    className="px-10 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-600/30 flex items-center gap-3 transform hover:-translate-y-1"
                                >
                                    Join the Movement <RefreshCcw className="w-5 h-5" />
                                </Link>
                                <Link
                                    href="/rewards-program"
                                    className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl transform hover:-translate-y-1"
                                >
                                    Explore Rewards
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white group" style={{ height: '600px' }}>
                                <Image
                                    src="/images/3d/circular-economy.png"
                                    alt="Circular Economy 3D Symbol"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent"></div>
                            </div>

                            {/* Floating metrics */}
                            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-emerald-50 hidden md:block animate-bounce-slow">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-7 h-7 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-gray-900 leading-none">85%</div>
                                        <div className="text-xs text-emerald-600 font-bold mt-1 uppercase tracking-widest">Resource Recovery</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
            </section>

            {/* The 3 Pillars of Circularity */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6 group">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-500">
                                <Sprout className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">Regenerate Nature</h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                Move beyond &quot;doing less harm&quot; to actually improving the environment. We return nutrients to the soil through compost and organic waste recovery.
                            </p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center group-hover:bg-green-500 transition-colors duration-500">
                                <RefreshCcw className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">Design Out Waste</h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                Through our AI sorting and collection data, we help brands rethink their packaging to ensure it never becomes trash in the first place.
                            </p>
                        </div>

                        <div className="space-y-6 group">
                            <div className="w-20 h-20 bg-lime-50 rounded-3xl flex items-center justify-center group-hover:bg-lime-600 transition-colors duration-500">
                                <ShoppingBag className="w-10 h-10 text-lime-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900">Keep Products in Use</h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                Materials aren&apos;t just waste; they are assets. We ensure plastics, metals, and glass find a second life in manufacturing and construction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reward System Integration */}
            <section className="py-32 bg-emerald-900 text-white overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-emerald-300 text-sm font-bold">
                                <Coins className="w-4 h-4" /> THE GREEN ECONOMY
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black leading-tight">
                                Where Sustainability <br /><span className="text-emerald-400">Pays Off</span>
                            </h2>
                            <p className="text-emerald-100/70 text-xl leading-relaxed font-medium">
                                We&apos;ve built a reward system that mirrors the circular cycle. Every kg you recover earns you **Green Points**, which can be spent at local partner businesses, closing the economic loop.
                            </p>

                            <div className="space-y-6 pt-4">
                                {[
                                    { title: "Earn Points", desc: "Recycle verified materials to build your digital wallet.", icon: Coins },
                                    { title: "Empower Locals", desc: "Redeem points at neighborhood shops & services.", icon: Heart },
                                    { title: "Track Growth", desc: "See your community impact score rise in real-time.", icon: Globe }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <item.icon className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black">{item.title}</h4>
                                            <p className="text-emerald-100/50 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="bg-white rounded-[3rem] p-10 md:p-16 text-gray-900 shadow-2xl space-y-10">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-8">
                                    <div>
                                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Circulation</div>
                                        <div className="text-4xl font-black text-gray-900 mt-1">24.5 tons</div>
                                    </div>
                                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                        <RefreshCcw className="w-8 h-8 text-emerald-600 animate-spin-slow" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-gray-500">Recycling Target</span>
                                        <span className="text-emerald-600">82% Achieved</span>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="w-[82%] h-full bg-emerald-500 rounded-full" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                                        <div className="text-2xl font-black text-emerald-700">12,400</div>
                                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Points Issued</div>
                                    </div>
                                    <div className="p-6 bg-green-50 rounded-3xl border border-green-100 text-center">
                                        <div className="text-2xl font-black text-green-700">548</div>
                                        <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Vouchers Used</div>
                                    </div>
                                </div>

                                <button className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl transform hover:scale-[1.02]">
                                    Start Earning Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/5 rounded-full animate-pulse-slow" />
            </section>

            {/* Community Engagement */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl border-4 border-white transform -rotate-3">
                                    <Image src="https://images.unsplash.com/photo-1544333346-64e393c3c72e?auto=format&fit=crop&q=80&w=1000" alt="Community cleanup" fill className="object-cover" />
                                </div>
                                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-xl border-4 border-white transform rotate-3 translate-y-8">
                                    <Image src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000" alt="Sustainability workshop" fill className="object-cover" />
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 order-1 lg:order-2 space-y-8">
                            <div className="inline-flex items-center gap-2 text-green-600 font-bold mb-4 uppercase tracking-widest text-sm">
                                <Users className="w-5 h-5" /> NDAGANI IMPACT
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                                Powering a <span className="text-emerald-600">Unified</span> Neighborhood
                            </h2>
                            <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                Circular economy isn&apos;t just about things; it&apos;s about people. We organize workshops, community drives, and school programs to ensure everyone in Ndagani has the tools to build a sustainable future.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    "Monthly Community Recovery Drives",
                                    "Youth Sustainability Leadership Program",
                                    "Local Entrepreneur Incubation for Recycled Goods",
                                    "Zero-Waste Education Kits for Schools"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="font-bold text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="flex items-center gap-2 font-black text-emerald-600 hover:text-emerald-800 transition group pt-4">
                                View Community Calendar <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-emerald-600 rounded-[4rem] p-16 md:p-24 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-6xl font-black">Ready to Start <br />Your Loop?</h2>
                            <p className="text-emerald-100 text-xl max-w-2xl mx-auto font-medium">Be the reason your neighborhood becomes a beacon of modern sustainability. Join 500+ residents already closing the loop.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link
                                    href="/auth/register"
                                    className="px-12 py-5 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition shadow-2xl transform hover:scale-105"
                                >
                                    Create Your Loop Account
                                </Link>
                                <Link
                                    href="/schedule-pickup"
                                    className="px-12 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition transform hover:scale-105"
                                >
                                    Schedule First Pickup
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18rem] font-black text-white/5 pointer-events-none uppercase tracking-tighter">
                            Circular
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
