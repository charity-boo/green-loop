"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  Trophy, 
  Calendar, 
  Heart, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  TreePine,
  Droplets,
  Globe,
  Quote,
  Star,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const communityMetrics = [
  { label: "Community Members", value: "2,500+", icon: <Users className="w-6 h-6 text-blue-500" /> },
  { label: "Total Kg Recycled", value: "45,000", icon: <TrendingUp className="w-6 h-6 text-green-500" /> },
  { label: "Trees Equivalent Saved", value: "850", icon: <TreePine className="w-6 h-6 text-emerald-500" /> },
  { label: "Water Saved (Liters)", value: "1.2M", icon: <Droplets className="w-6 h-6 text-cyan-500" /> }
];

const projects = [
  {
    title: "School Education Programs",
    desc: "Interactive workshops at Ndagani Primary to teach students the value of a circular economy.",
    date: "Ongoing",
    image: "/images/school.png",
    category: "Education"
  },
  {
    title: "Monthly Ndagani Cleanup",
    desc: "Join 50+ volunteers every last Saturday to keep our streets and waterways litter-free.",
    date: "Feb 28, 2026",
    image: "/images/community-engagement.png",
    category: "Cleanup"
  },
  {
    title: "Collector Safety Initiative",
    desc: "Providing high-viz gear and digital training to local independent waste collectors.",
    date: "March 2026",
    image: "/images/collector.png",
    category: "Empowerment"
  }
];

const leaderboard = [
  { name: "John M.", points: "12,450", rank: 1, avatar: "JM" },
  { name: "Sarah W.", points: "10,200", rank: 2, avatar: "SW" },
  { name: "Chuka Uni. Hostel B", points: "9,850", rank: 3, avatar: "CH" },
  { name: "David K.", points: "8,900", rank: 4, avatar: "DK" },
  { name: "Grace L.", points: "7,600", rank: 5, avatar: "GL" }
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-indigo-900 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-green-400 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-3/5 text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-indigo-300 text-sm font-bold mb-6 backdrop-blur-md border border-white/10">
                <Globe className="w-4 h-4 animate-pulse" /> JOIN THE MOVEMENT
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                Ndagani&apos;s <span className="text-green-400 font-serif italic font-normal">Green</span> <br/>Community Hub
              </h1>
              <p className="text-xl text-indigo-100/80 mb-10 leading-relaxed max-w-2xl">
                We believe that small actions, when multiplied by thousands, can transform Ndagani. 
                Join our network of eco-warriors and start making a measurable impact today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/community/volunteer"
                  className="px-10 py-5 bg-green-500 text-indigo-950 font-black rounded-2xl hover:bg-green-400 transition shadow-2xl shadow-green-500/20 transform hover:-translate-y-1"
                >
                  Become a Volunteer
                </Link>
                <Link 
                  href="/community-stories"
                  className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition backdrop-blur-sm"
                >
                  Read Success Stories
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:w-2/5 w-full"
            >
                <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-2xl">
                    <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <Trophy className="text-yellow-400 w-8 h-8" /> Top Contributors
                    </h3>
                    <div className="space-y-4">
                        {leaderboard.map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/5 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                                        i === 0 ? "bg-yellow-400 text-yellow-950" : 
                                        i === 1 ? "bg-slate-300 text-slate-900" :
                                        i === 2 ? "bg-orange-400 text-orange-950" : "bg-white/10 text-white"
                                    }`}>
                                        {user.avatar}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-green-400 transition-colors">{user.name}</div>
                                        <div className="text-xs text-indigo-200 font-medium">Rank #{user.rank}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black text-white">{user.points}</div>
                                    <div className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">Points</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/rewards-program" className="mt-8 flex items-center justify-center gap-2 text-indigo-200 font-bold hover:text-white transition group">
                        View Full Leaderboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {communityMetrics.map((stat, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-indigo-50 flex flex-col items-center text-center"
                    >
                        <div className="mb-4 p-3 bg-indigo-50 rounded-2xl">
                            {stat.icon}
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-green-600 font-bold mb-4 uppercase tracking-widest text-sm">
                    <Calendar className="w-5 h-5" /> Ongoing Initiatives
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                    Projects Making <br/><span className="text-green-600">Real Impact</span>
                </h2>
            </div>
            <Link 
                href="/community-projects"
                className="px-8 py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition flex items-center gap-2"
            >
                View All Projects <ArrowRight className="w-5 h-5" />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                >
                    <div className="h-56 relative overflow-hidden">
                        <Image 
                            src={project.image} 
                            alt={project.title} 
                            fill
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black text-gray-900 shadow-lg">
                            {project.category}
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="text-green-600 font-bold text-xs mb-3 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-3 h-3 fill-current" /> {project.date}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                            {project.title}
                        </h3>
                        <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                            {project.desc}
                        </p>
                        <Link 
                            href="/auth/register"
                            className="inline-flex items-center gap-2 font-black text-gray-900 hover:text-green-600 transition-colors"
                        >
                            Sign Up to Help <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Testimonial / Story Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 -translate-y-1/2 translate-x-1/2">
            <Quote className="w-96 h-96 text-indigo-900" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl relative">
                        <Quote className="text-green-500 w-12 h-12 mb-8" />
                        <p className="text-2xl md:text-3xl font-medium text-gray-800 italic leading-relaxed mb-10">
                            &quot;Green Loop didn&apos;t just give us a way to dispose of waste; they gave Ndagani a sense of shared responsibility. My kids now compete to see who sorts the most plastic!&quot;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl">
                                MM
                            </div>
                            <div>
                                <div className="font-black text-gray-900 text-lg">Mama Mike</div>
                                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Ndagani Resident & Eco-Warrior</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
                        Stories of <span className="text-indigo-600">Transformation</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
                        Our community is built on thousands of individual stories. From students launching campus-wide recycling drives to businesses achieving zero-waste status.
                    </p>
                    <div className="space-y-6 mb-12">
                        {[
                            "70% waste reduction in pilot residential blocks",
                            "Over 500 students trained in waste-tech",
                            "15 local collectors fully integrated and insured"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <span className="font-bold text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                    <Link 
                        href="/community-stories"
                        className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-xl"
                    >
                        Read More Stories
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Get Involved Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">How You Can Join</h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto font-medium">There are many ways to support the Green Loop mission.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { title: "Volunteer", link: "/community/volunteer", icon: <Users className="w-8 h-8" />, desc: "Join our hands-on events and cleanup drives.", color: "bg-blue-500" },
                { title: "Sponsor", link: "/community/sponsorship", icon: <Heart className="w-8 h-8" />, desc: "Fund a specific school project or community bin.", color: "bg-rose-500" },
                { title: "Partner", link: "/community/partnerships", icon: <Globe className="w-8 h-8" />, desc: "For businesses looking for circular solutions.", color: "bg-emerald-500" },
                { title: "Careers", link: "/community/careers", icon: <MessageSquare className="w-8 h-8" />, desc: "Join our team and build the future of waste.", color: "bg-amber-500" }
            ].map((item, i) => (
                <Link 
                    key={i}
                    href={item.link}
                    className="group p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center hover:-translate-y-2"
                >
                    <div className={`mb-6 p-4 ${item.color} text-white rounded-3xl group-hover:scale-110 transition-transform`}>
                        {item.icon}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-8 flex-grow">{item.desc}</p>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </Link>
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
            <div className="bg-indigo-950 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                {/* Decorative particles */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                            key={i} 
                            className="absolute bg-white rounded-full"
                            style={{
                                width: Math.random() * 8 + 2 + 'px',
                                height: Math.random() * 8 + 2 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                opacity: Math.random()
                            }}
                        ></div>
                    ))}
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        The Movement <br/>Needs You.
                    </h2>
                    <p className="text-indigo-200 text-lg mb-12 max-w-2xl mx-auto font-medium">
                        Whether you&apos;re a student, a parent, or a business owner, your participation 
                        accelerates Ndagani&apos;s journey towards sustainability.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link 
                            href="/auth/register"
                            className="px-12 py-5 bg-green-500 text-indigo-950 font-black rounded-2xl hover:bg-green-400 transition shadow-2xl transform hover:scale-105"
                        >
                            Sign Up Today
                        </Link>
                        <Link 
                            href="/contact"
                            className="px-12 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/10 transition transform hover:scale-105"
                        >
                            Contact the Hub
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
