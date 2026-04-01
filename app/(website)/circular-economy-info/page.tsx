"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from "next/link";
import {
    RefreshCcw,
    Coins,
    Users,
    Sprout,
    ArrowRight,
    ShoppingBag,
    Globe,
    Heart,
    Zap,
    Leaf,
    ShieldCheck,
    Truck
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const GrainyBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0">
        <svg className="h-full w-full opacity-[0.03] filter brightness-100 contrast-150">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    </div>
);

const DecorativeCircle = ({ className }: { className?: string }) => (
    <div className={`absolute rounded-full blur-[120px] opacity-20 bg-emerald-500 ${className}`} />
);

export default function CircularEconomyPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-[#050a09] text-white selection:bg-emerald-500/30 overflow-x-hidden">
            <GrainyBackground />
            
            {/* ── 1. IMMERSIVE HERO ────────────────────────────────────────── */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <DecorativeCircle className="w-[600px] h-[600px] -top-40 -left-40" />
                <DecorativeCircle className="w-[800px] h-[800px] -bottom-60 -right-60 bg-emerald-400" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <motion.div 
                            className="lg:col-span-7 space-y-10"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">The Future of Ndagani</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase">
                                <span className="block overflow-hidden">
                                    <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="block">Close</motion.span>
                                </span>
                                <span className="block text-emerald-500 italic overflow-hidden">
                                    <motion.span initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="block">The Loop</motion.span>
                                </span>
                            </h1>

                            <p className="max-w-xl text-xl text-emerald-100/60 leading-relaxed font-medium">
                                Rethinking how we produce, consume, and recover. We&apos;re building a zero-waste ecosystem where every material has a second life and every action regenerates our neighborhood.
                            </p>

                            <div className="flex flex-wrap gap-6 pt-4">
                                <Link
                                    href="/auth/register"
                                    className="group relative px-10 py-5 bg-emerald-500 text-black font-black rounded-full overflow-hidden transition-transform hover:scale-105"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-3">Join the Movement <ArrowRight className="w-5 h-5" /></span>
                                </Link>
                                <Link
                                    href="/rewards-program"
                                    className="px-10 py-5 border border-emerald-500/30 text-emerald-500 font-black rounded-full hover:bg-emerald-500/10 transition-colors"
                                >
                                    Explore Rewards
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="lg:col-span-5 relative hidden lg:block"
                            style={{ scale, opacity }}
                        >
                            <div className="relative aspect-square">
                                <motion.div 
                                    className="absolute inset-0 rounded-full border-[1px] border-emerald-500/20"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div 
                                    className="absolute inset-[15%] rounded-full border-[1px] border-emerald-500/40 border-dashed"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src="/images/3d/circular-economy.png"
                                        alt="Circular Economy Symbol"
                                        width={400}
                                        height={400}
                                        className="relative z-10 filter drop-shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                                    />
                                </div>
                                
                                {/* Floating Tech Tags */}
                                <div className="absolute top-0 right-0 p-6 bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl">
                                    <div className="text-3xl font-black text-emerald-400 leading-none">85%</div>
                                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Recovery Rate</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div 
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500 to-transparent" />
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Scroll</span>
                </motion.div>
            </section>

            {/* ── 2. THE THREE PILLARS (BENTO) ────────────────────────────── */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 space-y-4">
                        <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.4em]">The Strategy</h2>
                        <h3 className="text-5xl md:text-7xl font-black tracking-tighter">Three Pillars of <br /><span className="text-emerald-500 italic">Circularity.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Pillar 1 */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="md:col-span-2 group relative p-10 bg-emerald-950/20 border border-emerald-500/10 rounded-[3rem] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sprout className="w-64 h-64 text-emerald-500" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-between min-h-[300px]">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 flex items-center justify-center">
                                    <Sprout className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-4xl font-black uppercase tracking-tight">Regenerate Nature</h4>
                                    <p className="max-w-md text-emerald-100/60 text-lg font-medium">
                                        We return nutrients to the soil through compost and organic waste recovery, moving beyond &quot;doing less harm&quot; to active environmental improvement.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pillar 2 */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="group relative p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[3rem] overflow-hidden"
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-400/20 flex items-center justify-center">
                                    <RefreshCcw className="w-8 h-8 text-emerald-400" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-3xl font-black uppercase tracking-tight leading-none">Design Out <br />Waste</h4>
                                    <p className="text-emerald-100/60 font-medium">
                                        Using AI data to help brands rethink packaging before it becomes trash.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pillar 3 */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="group relative p-10 bg-emerald-950/40 border border-white/5 rounded-[3rem] overflow-hidden"
                        >
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-300/20 flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-emerald-300" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-3xl font-black uppercase tracking-tight leading-none">Keep Items <br />In Use</h4>
                                    <p className="text-emerald-100/60 font-medium">
                                        Materials are assets. We give plastics, metals, and glass a second life in manufacturing.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Pillar Extra - Tech */}
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="md:col-span-2 group relative p-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[3rem] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                            <div className="relative z-10 h-full flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Powered by AI</div>
                                    <h4 className="text-4xl md:text-5xl font-black text-black leading-none tracking-tighter">Real-time Recovery Intelligence</h4>
                                    <p className="text-black/70 text-lg font-medium">
                                        Our neural network doesn&apos;t just sort; it tracks material purity and identifies systemic leakage in the local loop.
                                    </p>
                                </div>
                                <div className="w-48 h-48 bg-black/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center shrink-0">
                                    <RefreshCcw className="w-24 h-24 text-white animate-spin-slow" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 3. INTERACTIVE REWARD DASHBOARD ─────────────────────────── */}
            <section className="py-32 bg-white text-black relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2 space-y-10">
                            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest">Economic Loop</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Sustainability <br /><span className="text-emerald-500">Pays Dividends</span></h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg">
                                We&apos;ve built a reward system that mirrors the circular cycle. Every kg you recover earns you Green Points, creating a localized green currency.
                            </p>
                            
                            <div className="grid gap-8">
                                {[
                                    { title: "Earn Points", icon: Coins, color: "bg-emerald-100 text-emerald-600" },
                                    { title: "Empower Locals", icon: Heart, color: "bg-pink-100 text-pink-600" },
                                    { title: "Track Growth", icon: Globe, color: "bg-blue-100 text-blue-600" }
                                ].map((step, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-6 group cursor-default"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${step.color}`}>
                                            <step.icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h5 className="text-xl font-black tracking-tight">{step.title}</h5>
                                            <p className="text-gray-400 font-medium">Neighborhood circular incentives.</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-1/2 w-full">
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="relative bg-[#f8faf9] rounded-[4rem] p-12 shadow-2xl border border-gray-100 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
                                    <RefreshCcw className="w-64 h-64 animate-spin-slow" />
                                </div>
                                
                                <div className="relative z-10 space-y-12">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Impact Balance</div>
                                            <div className="text-6xl font-black text-gray-900 tracking-tighter">4,820 <span className="text-xl font-bold text-emerald-500 uppercase tracking-widest ml-2">GP</span></div>
                                        </div>
                                        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                            <Zap className="w-8 h-8 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                            <span className="text-gray-400">Monthly Target</span>
                                            <span className="text-emerald-600">82% Completed</span>
                                        </div>
                                        <div className="h-4 w-full bg-emerald-100 rounded-full p-1">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "82%" }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-emerald-500 rounded-full" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                            <div className="text-3xl font-black text-gray-900 tracking-tighter">24.5t</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Recovered</div>
                                        </div>
                                        <div className="p-8 bg-emerald-600 rounded-3xl shadow-lg shadow-emerald-600/20 text-white">
                                            <div className="text-3xl font-black tracking-tighter">548</div>
                                            <div className="text-[10px] font-bold text-emerald-100/70 uppercase tracking-widest mt-1">Vouchers</div>
                                        </div>
                                    </div>

                                    <button className="w-full py-6 bg-black text-white font-black rounded-3xl hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-500/20 uppercase tracking-[0.2em] text-sm">
                                        Withdraw to Wallet
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. COMMUNITY IMPACT (PARALLAX IMAGES) ──────────────────── */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="relative order-2 lg:order-1 h-[600px]">
                            <motion.div 
                                style={{ y: useTransform(scrollYProgress, [0.6, 1], [0, -100]) }}
                                className="absolute top-0 left-0 w-3/4 h-[400px] rounded-[4rem] overflow-hidden border-[12px] border-[#050a09] shadow-2xl z-20"
                            >
                                <Image 
                                    src="https://images.unsplash.com/photo-1544333346-64e393c3c72e?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Cleanup" 
                                    fill 
                                    className="object-cover" 
                                />
                            </motion.div>
                            <motion.div 
                                style={{ y: useTransform(scrollYProgress, [0.6, 1], [0, 100]) }}
                                className="absolute bottom-0 right-0 w-3/4 h-[400px] rounded-[4rem] overflow-hidden shadow-2xl z-10"
                            >
                                <Image 
                                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=1000" 
                                    alt="Workshop" 
                                    fill 
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                />
                            </motion.div>
                        </div>
                        
                        <div className="space-y-10 order-1 lg:order-2">
                            <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">The Soul of the Loop</span>
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Powered by <br /><span className="text-emerald-500 italic">People.</span></h2>
                            <p className="text-xl text-emerald-100/60 font-medium leading-relaxed">
                                Circularity isn&apos;t just about things; it&apos;s about us. We organize neighborhood recovery drives, leadership programs, and educational workshops.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { title: "Recovery Drives", icon: Truck },
                                    { title: "Youth Leadership", icon: Users },
                                    { title: "Eco-Incubation", icon: Leaf },
                                    { title: "School Kits", icon: ShieldCheck }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
                                        <item.icon className="w-6 h-6 text-emerald-400" />
                                        <span className="font-bold tracking-tight">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. FINAL CALL TO ACTION ───────────────────────────────── */}
            <section className="py-32 px-6 bg-[#050a09]">
                <div className="max-w-7xl mx-auto">
                    <div className="relative p-12 md:p-24 rounded-[5rem] overflow-hidden text-center space-y-12">
                        {/* Background for CTA */}
                        <div className="absolute inset-0 bg-emerald-600 z-0">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                            <motion.div 
                                className="absolute -top-1/2 -left-1/4 w-full h-full bg-emerald-400 blur-[120px] opacity-40 rounded-full"
                                animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
                                transition={{ duration: 8, repeat: Infinity }}
                            />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-black">Start Your <br />Loop Now.</h2>
                            <p className="text-black/70 text-xl font-bold">Join 500+ Ndagani pioneers already closing the loop on waste and opening the door to the future.</p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Link
                                    href="/auth/register"
                                    className="px-12 py-6 bg-black text-white font-black rounded-full hover:scale-105 transition shadow-2xl"
                                >
                                    Create My Account
                                </Link>
                                <Link
                                    href="/schedule-pickup"
                                    className="px-12 py-6 bg-white/20 backdrop-blur-xl text-black border border-black/10 font-black rounded-full hover:bg-white/30 transition scale-100 hover:scale-105"
                                >
                                    Schedule Pickup
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Styles */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                
                :root {
                    --font-space: 'Space Grotesk', sans-serif;
                }
                
                body {
                    font-family: var(--font-space);
                }

                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
