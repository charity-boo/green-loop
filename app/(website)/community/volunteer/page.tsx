"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Handshake, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Star,
  Globe,
  Loader2,
  Heart,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VolunteerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-green-950 font-sans">
      
      {/* ── HEADER / HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 bg-green-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/50 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/community" className="inline-flex items-center gap-2 text-green-700 font-bold mb-8 hover:text-green-900 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Community Hub
          </Link>
          
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full text-green-700 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Heart className="w-3 h-3 fill-current" /> Human Impact
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-green-950 leading-[0.9] mb-8"
            >
              BE THE <span className="text-green-600">HANDS</span> <br />
              THAT HEAL THE EARTH.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-500 font-medium leading-relaxed"
            >
              Join our global network of eco-warriors. From neighborhood clean-ups to school workshops, your time is the most valuable resource we have.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (SPLIT LAYOUT) ────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          {/* Left: Info & Benefits */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-green-950 mb-8 flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                Why Volunteer with Us?
              </h2>
              <div className="grid gap-6">
                {[
                  {
                    title: "Direct Local Impact",
                    desc: "See the immediate transformation of your streets, parks, and waterways through hands-on action.",
                    icon: <Globe className="w-5 h-5" />
                  },
                  {
                    title: "Earn Green Rewards",
                    desc: "Volunteer hours convert into Green Points, giving you access to exclusive partner rewards and badges.",
                    icon: <Star className="w-5 h-5" />
                  },
                  {
                    title: "Skill Development",
                    desc: "Learn about waste-tech, logistics, and community leadership through our specialized training phases.",
                    icon: <Zap className="w-5 h-5 text-green-600" />
                  }
                ].map((benefit, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="p-6 bg-green-50 rounded-3xl border border-green-100/50 flex gap-5 items-start transition-all"
                  >
                    <div className="mt-1 w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 text-green-600">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-green-950 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-12 pt-8 border-t border-gray-100">
              <div>
                <div className="text-4xl font-black text-green-600">840+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">Active Volunteers</div>
              </div>
              <div>
                <div className="text-4xl font-black text-green-600">12k</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">Service Hours</div>
              </div>
              <div>
                <div className="text-4xl font-black text-green-600">150</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">Events Yearly</div>
              </div>
            </div>
          </div>

          {/* Right: Application Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-green-900/10 border border-green-50 relative overflow-hidden"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-20 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black text-green-950 mb-4">Application Received!</h3>
                  <p className="text-gray-500 font-medium mb-10 leading-relaxed">
                    Thank you for your interest in joining the Green Loop movement. Our community hub team will review your application and reach out via email within 48 hours.
                  </p>
                  <Button 
                    onClick={() => setSuccess(false)}
                    variant="outline" 
                    className="rounded-2xl px-8 py-6 font-black border-2 border-green-100"
                  >
                    Submit Another
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-green-950 mb-2">Join the Squad.</h3>
              <p className="text-gray-400 font-medium mb-10 text-sm">Fill out the form below to register your interest in our upcoming initiatives.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                    <Input 
                      id="name" 
                      required 
                      className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-green-100 transition-all font-bold"
                      placeholder="e.g. Samuel Green"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Work Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      required 
                      className="h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-green-100 transition-all font-bold"
                      placeholder="samuel@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Volunteer Type</Label>
                  <select 
                    id="type"
                    className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 focus:ring-2 focus:ring-green-100 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option>Cleanup Drives</option>
                    <option>Educational Workshops</option>
                    <option>Digital Advocacy</option>
                    <option>Event Planning</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest" className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tell us about your why</Label>
                  <Textarea 
                    id="interest" 
                    className="bg-gray-50 border-none rounded-3xl px-6 py-4 focus:ring-2 focus:ring-green-100 transition-all font-bold min-h-[140px]"
                    placeholder="What drives your passion for sustainability?"
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full h-16 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-green-900/20 text-lg group"
                  >
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>Send Application <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER CTA ────────────────────────────────────────────────── */}
      <section className="py-24 bg-green-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Not Ready to Volunteer?</h2>
          <p className="text-green-100/60 font-medium mb-12 text-lg">You can still support our mission by sponsoring a project or exploring career opportunities with our core team.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/community/sponsorship" className="px-8 py-4 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition backdrop-blur-sm border border-white/10">
              Sponsor a Project
            </Link>
            <Link href="/community/careers" className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-xl">
              View Careers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}