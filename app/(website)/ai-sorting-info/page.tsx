"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {
    BrainCircuit,
    Cpu,
    Eye,
    Scan,
    CloudLightning,
    BarChart3,
    Search,
    History
} from "lucide-react";
import { motion } from "framer-motion";

export default function AISortingInfoPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative py-32 bg-emerald-950 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="lg:w-1/2 space-y-8"
                        >
                            <span className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-sm font-bold tracking-widest uppercase">
                                Computer Vision Core
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                                Smarter Sorting <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Powered by AI</span>
                            </h1>
                            <p className="text-xl text-emerald-100/80 leading-relaxed font-medium">
                                We utilize advanced AI models to classify waste in real-time. Simply snap a photo, and our neural network identifies materials with over 90% accuracy, providing instant disposal guidance.
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/waste"
                                    className="px-10 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition shadow-2xl shadow-emerald-500/30 flex items-center gap-3 transform hover:-translate-y-1"
                                >
                                    Try Classifier Now <Scan className="w-5 h-5" />
                                </Link>
                                <button className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl border border-white/20 hover:bg-white/20 transition flex items-center gap-3 transform hover:-translate-y-1 backdrop-blur-sm">
                                    Watch Demo <CloudLightning className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-emerald-800 shadow-[0_0_100px_-20px_rgba(16,185,129,0.3)] bg-emerald-900 group" style={{ height: '550px' }}>
                                <Image
                                    src="/images/3d/ai-brain.png"
                                    alt="AI Neural Network 3D Visualization"
                                    fill
                                    className="object-cover mix-blend-screen opacity-80 transition-transform duration-700 group-hover:scale-105 filter hue-rotate-180 brightness-150"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
                                
                                {/* AI Scanning Overlay UI */}
                                <div className="absolute top-10 left-10 p-4 bg-emerald-950/80 backdrop-blur-md rounded-2xl border border-emerald-500/30 space-y-3 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Processing Scan...</span>
                                    </div>
                                    <div className="h-1.5 w-32 bg-emerald-900 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-emerald-400 animate-[loading_2s_ease-in-out_infinite]"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Tech Badges */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-emerald-100 text-emerald-950 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                        <BrainCircuit className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black leading-none">MobileNet V2</div>
                                        <div className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">Proprietary Training</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Animated Background Gradients */}
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-400/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            </section>

            {/* How the AI Works - Process */}
            <section className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-6">Four Layers of Logic</h2>
                        <p className="text-xl text-emerald-800/70 max-w-2xl mx-auto font-medium">Our classification engine works through a multi-stage validation process to ensure data integrity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Eye,
                                title: "Visual Capture",
                                desc: "High-resolution image processing with automated lighting and shadow correction for Ndagani's outdoor environments."
                            },
                            {
                                icon: Cpu,
                                title: "Tensor Inference",
                                desc: "Our neural network analyzes 1,000+ distinct visual features to determine material composition and degradation levels."
                            },
                            {
                                icon: Search,
                                title: "Cross-Reference",
                                desc: "Classification results are verified against a localized dataset of Ndagani's common consumer packaging."
                            },
                            {
                                icon: CloudLightning,
                                title: "Instant Result",
                                desc: "Categorization into Organic, Plastic, Recyclable, or Hazardous streams with 500ms total latency."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-10 rounded-[3rem] bg-emerald-50/50 border border-emerald-100 hover:bg-emerald-600 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 group-hover:bg-emerald-50 transition-transform">
                                    <item.icon className="w-8 h-8 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                                </div>
                                <h3 className="relative z-10 text-2xl font-black text-emerald-950 mb-4 group-hover:text-white transition-colors">{item.title}</h3>
                                <p className="relative z-10 text-emerald-800/70 leading-relaxed font-medium group-hover:text-emerald-50 transition-colors">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Training and Data */}
            <section className="py-32 bg-emerald-50/30 border-t border-emerald-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="lg:w-1/2">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 transform hover:-rotate-2 transition-transform">
                                        <BarChart3 className="w-10 h-10 text-emerald-500 mb-4" />
                                        <div className="text-3xl font-black text-emerald-950">1.2M+</div>
                                        <p className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Images Processed</p>
                                    </div>
                                    <div className="bg-emerald-600 p-8 rounded-3xl shadow-xl text-white transform hover:rotate-2 transition-transform">
                                        <History className="w-10 h-10 text-emerald-200 mb-4" />
                                        <div className="text-3xl font-black">94.8%</div>
                                        <p className="text-sm font-bold text-emerald-200 uppercase tracking-widest mt-1">Accuracy Rate</p>
                                    </div>
                                </div>
                                <div className="space-y-6 pt-12">
                                    <div className="bg-emerald-950 p-8 rounded-3xl shadow-xl text-white transform hover:rotate-2 transition-transform">
                                        <Scan className="w-10 h-10 text-emerald-400 mb-4" />
                                        <div className="text-3xl font-black">0.5s</div>
                                        <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mt-1">Avg. Latency</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 transform hover:-rotate-2 transition-transform">
                                        <Cpu className="w-10 h-10 text-emerald-600 mb-4" />
                                        <div className="text-3xl font-black text-emerald-950">Edge</div>
                                        <p className="text-sm font-bold text-emerald-600/70 uppercase tracking-widest mt-1">Computing Optimized</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-emerald-950 leading-tight">
                                Continuous <span className="text-emerald-600">Learning</span> for a Better Planet
                            </h2>
                            <p className="text-xl text-emerald-800/70 leading-relaxed font-medium">
                                Every scan you perform helps Green Loop improve. Our models are retrained weekly using anonymized community data, ensuring the system adapts to new types of packaging and waste trends in real-time.
                            </p>
                            <div className="space-y-4 pt-4">
                                {[
                                    "Dataset includes 5,000+ localized product images",
                                    "Edge-optimized for low-bandwidth mobile use",
                                    "Automated stream redirection for hazardous waste",
                                    "Exportable data for community waste audits"
                                ].map((text, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                                            <CloudLightning className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="font-bold text-emerald-900">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-32 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-emerald-950 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl border border-emerald-900">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[80px]" />
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-6xl font-black italic">Test the Intelligence.</h2>
                            <p className="text-emerald-100/80 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                                Don&apos;t just take our word for it. Open the classifier and see the neural network identify your materials in real-time.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                                <Link
                                    href="/waste"
                                    className="px-12 py-5 bg-white text-emerald-950 font-black rounded-2xl hover:bg-emerald-50 transition transform hover:scale-105 shadow-2xl shadow-emerald-500/20"
                                >
                                    Open Classifier
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-12 py-5 border-2 border-emerald-500/30 text-white font-black rounded-2xl hover:bg-emerald-900/50 transition transform hover:scale-105 backdrop-blur-sm"
                                >
                                    Join Development
                                </Link>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14rem] md:text-[20rem] font-black text-emerald-500/5 pointer-events-none uppercase tracking-tighter">
                            Neural
                        </div>
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex justify-center items-center gap-2 text-emerald-500/50 font-bold text-xs uppercase tracking-widest z-10">
                            <span>Powered by Transformers.js</span>
                            <div className="w-1 h-1 bg-emerald-500/30 rounded-full"></div>
                            <span>Green Loop Engine V4.2</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
