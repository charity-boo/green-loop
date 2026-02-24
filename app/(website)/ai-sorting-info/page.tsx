"use client";

import React from 'react';
import Link from "next/link";
import {
  Scan,
  BrainCircuit,
  CheckCircle2,
  Layers,
  Zap,
  Microscope,
  Database,
  ArrowRight,
  Cpu,
  Activity,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function AISortingInfoPage() {
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
              <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold tracking-wide uppercase">
                High-Tech Innovation
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
                The Future of Recovery: <span className="text-green-600">AI-Powered</span> Sorting
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed font-bold italic">
                Scaling sustainability through computer vision and real-time material intelligence.
              </p>
              <div className="p-8 bg-green-50 border-l-8 border-green-600 rounded-r-3xl">
                <p className="text-lg text-green-900 font-medium leading-relaxed">
                  &quot;Traditional waste sorting is slow, prone to error, and costly. **Green Loop** integrates advanced AI models to bridge the gap between &apos;discarded&apos; and &apos;reusable.&apos; Our system doesn&apos;t just see waste; it understands material composition, allowing for a 95% accuracy rate in separating recyclables from landfill-bound debris.&quot;
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/register"
                  className="px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition shadow-2xl shadow-green-600/30 flex items-center gap-2 transform hover:-translate-y-1"
                >
                  Explore the Technology <Cpu className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition shadow-xl transform hover:-translate-y-1"
                >
                  View Sorting Analytics
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-white group">
                <img
                  src="/images/3d/ai-sorting.png"
                  alt="AI Sorting Robot 3D Render"
                  className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
              </div>

              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl z-20 border border-green-50 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900 leading-none">95%</div>
                    <div className="text-xs text-green-600 font-bold mt-1 uppercase tracking-widest">Sorting Accuracy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/40 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">How the Technology Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">Breaking down the industrial-grade intelligence behind every sorted item.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Real-Time Identification",
                desc: "High-speed cameras capture frames of incoming waste. Our proprietary AI, trained on thousands of material types, identifies polymers, fiber grades, and metal alloys in milliseconds.",
                icon: Scan,
                color: "green"
              },
              {
                title: "Automated Diversion",
                desc: "Once identified, the system triggers pneumatic or robotic sorters to divert materials into dedicated streams (e.g., PET, HDPE, Aluminum).",
                icon: Layers,
                color: "emerald"
              },
              {
                title: "Contamination Detection",
                desc: "The AI flags non-recyclable 'spoilers' (like food-soiled paper) before they reach the processing stage, preserving the quality of the recycled output.",
                icon: ShieldCheck,
                color: "lime"
              },
              {
                title: "Edge Analytics",
                desc: "Data from every sorted item is sent to your Green Loop Dashboard, providing live insights into your community's recycling habits.",
                icon: BarChart3,
                color: "green"
              }
            ].map((step, idx) => (
              <div key={idx} className="group p-10 bg-gray-50 rounded-[3rem] border border-gray-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:border-transparent hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl bg-${step.color}-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-10">
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Key Impact Metrics: <br /><span className="text-green-400">The Power of Choice</span></h2>
              <div className="space-y-6">
                {[
                  { label: "Instant Classification", benefit: "Reduces human labor and exposure to hazardous waste." },
                  { label: "Material Purity", benefit: "Increases the market value of recycled materials by 40%." },
                  { label: "Zero-Waste Tracking", benefit: "Provides verifiable data for ESG (Environmental, Social, and Governance) reporting." },
                  { label: "Landfill Diversion", benefit: "Directly lowers methane emissions by keeping organics and plastics out of pits." }
                ].map((row, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xl font-black text-green-400 mb-1">{row.label}</div>
                      <p className="text-gray-400 font-medium">{row.benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              <div className="p-12 bg-white rounded-[4rem] text-gray-900 shadow-2xl space-y-8 relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-600 rounded-full mix-blend-screen blur-[80px] opacity-20"></div>
                <h3 className="text-3xl font-black text-center mb-8">Computer Scientist&apos;s Corner</h3>
                <div className="p-8 bg-green-50 rounded-[2.5rem] border border-green-100 flex gap-6 items-start">
                  <div className="p-4 bg-white rounded-2xl shadow-sm">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-green-900">Advanced Tech Stack</h4>
                    <p className="text-green-800 font-medium leading-relaxed">
                      &quot;Utilizing **Convolutional Neural Networks (CNNs)** and **YOLOv8** for real-time object detection, Green Loop ensures that even the smallest scrap of plastic is accounted for.&quot;
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-gray-50 rounded-3xl text-center">
                    <div className="text-3xl font-black text-gray-900">20ms</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Latency</div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-3xl text-center">
                    <div className="text-3xl font-black text-gray-900">FP16</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Precision</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-green-600 p-20 md:p-32 rounded-[5rem] shadow-2xl relative overflow-hidden text-white">
            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-7xl font-black leading-tight">Ready to <br />close the loop?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  href="/auth/register"
                  className="px-12 py-5 bg-white text-green-900 font-black rounded-2xl hover:bg-green-50 transition shadow-2xl transform hover:scale-105"
                >
                  Explore the Technology
                </Link>
                <Link
                  href="/dashboard"
                  className="px-12 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition transform hover:scale-105"
                >
                  View Sorting Analytics
                </Link>
              </div>
            </div>
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-white/20" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}