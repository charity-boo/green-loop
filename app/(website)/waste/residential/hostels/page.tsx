'use client';

import { StudentView } from "@/components/features/waste/hostels/student-view";
import { ManagerView } from "@/components/features/waste/hostels/manager-view";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Sparkles, GraduationCap, Building2, Recycle, Leaf, Users, TrendingDown, TreePine } from "lucide-react";
import Link from 'next/link';

export default function HostelsWastePage() {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "15,000+", label: "Active Students" },
    { icon: <TrendingDown className="w-6 h-6" />, value: "850+", label: "Tons Diverted" },
    { icon: <TreePine className="w-6 h-6" />, value: "24,000", label: "Trees Saved" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-green-100 selection:text-green-900 font-sans">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-2 text-green-800 font-bold text-xl tracking-tight">
            <Home className="w-6 h-6 text-green-500" />
            Green Loop
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-32 overflow-hidden border-b border-slate-100">
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-green-50/50 blur-3xl opacity-60" />
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-50/50 blur-3xl opacity-60" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-3/5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100/50 border border-green-200 text-green-700 text-xs font-semibold uppercase tracking-wider mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    Campus Sustainability Services
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Smarter Waste for{" "}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    Hostels & Students.
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Students track impact and compete on leaderboards. Managers get
                  analytics, bin sets, and scheduled pickups — all in one platform. Clean, modern, and effortless.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center gap-4"
                >
                   <button
                    onClick={() => scrollToSection("student-hub")}
                    className="w-full sm:w-auto px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-100 transition-all hover:-translate-y-0.5"
                  >
                    Student Hub
                  </button>
                   <button
                    onClick={() => scrollToSection("manager-portal")}
                    className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-200 hover:border-green-600 hover:text-green-600 text-slate-700 font-bold text-lg rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm"
                  >
                    Manager Portal
                  </button>
                </motion.div>
              </div>
              
              <div className="w-full lg:w-2/5 relative">
                 {/* Visual decoration: Layered cards or icon clusters */}
                 <div className="relative aspect-square w-full flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7 }}
                      className="absolute w-4/5 h-4/5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[3rem] shadow-2xl rotate-3 flex items-center justify-center p-8"
                    >
                        <Recycle className="h-4/5 w-4/5 text-green-100 opacity-20" />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                      animate={{ opacity: 1, scale: 1, rotate: -6 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="absolute w-4/5 h-4/5 bg-white border border-green-50 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                            <GraduationCap className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Campus Ready</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Join the movement</p>
                    </motion.div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-12 bg-green-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-green-800">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center pt-6 md:pt-0 first:pt-0">
                  <div className="w-12 h-12 bg-green-800/50 rounded-full flex items-center justify-center text-green-300 mb-4">
                    {stat.icon}
                  </div>
                  <h4 className="text-4xl font-black text-white mb-1 tracking-tight">{stat.value}</h4>
                  <p className="text-green-200 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Student Hub */}
        <section id="student-hub" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">The Student Hub</h2>
               <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                  Track your hostel rank, earn points for every bag sorted, and win campus competitions.
               </p>
            </div>
            
            <StudentView onManagerTabRequested={() => scrollToSection("manager-portal")} />
          </div>
        </section>

        {/* Section: How it works (Student) */}
        <section className="py-24 bg-slate-50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 text-slate-900">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">How it works</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">The student path to campus eco-warrior status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
              {[
                { step: "01", title: "Find your Hostel", desc: "Select your campus residence to join its sustainability hub." },
                { step: "02", title: "Sort & Bag", desc: "Use our color-coded bin sets to properly sort your recyclables." },
                { step: "03", title: "Track Impact", desc: "See your hostel climb the ranks as you hit collection targets." },
                { step: "04", title: "Win Big!", desc: "Hostels with the highest recycling rates win campus rewards." },
              ].map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="w-20 h-20 mx-auto bg-white rounded-[2rem] border-4 border-green-50 shadow-xl flex items-center justify-center text-3xl font-black text-green-600 mb-6 relative z-10 transition-transform hover:scale-110">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-500 font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Waste Guide */}
        <section id="waste-guide" className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">What goes in which bin?</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                Proper campus sorting is the foundation of Green Loop. Let&apos;s get it right together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { title: "Plastic & Metal", icon: <Recycle className="h-8 w-8" />, color: "bg-blue-50 text-blue-600 border-blue-100", items: ["PET Bottles", "Soda Cans", "Cleaning Jars", "Cosmetic Tubes"] },
                    { title: "Organic Waste", icon: <Leaf className="h-8 w-8" />, color: "bg-green-50 text-green-600 border-green-100", items: ["Leftover Food", "Fruit Peels", "Coffee Grounds", "Veggie Scraps"] },
                    { title: "Paper & General", icon: <Recycle className="h-8 w-8" />, color: "bg-slate-100 text-slate-600 border-slate-200", items: ["Assignments", "Cardboard", "Old Tissues", "Snack Wrappers"] },
                ].map((type, i) => (
                    <div key={i} className={`p-8 rounded-[2.5rem] border-2 ${type.color} transition-all hover:-translate-y-1`}>
                        <div className="p-4 bg-white rounded-2xl shadow-sm inline-flex mb-6">
                            {type.icon}
                        </div>
                        <h3 className="text-xl font-black mb-4">{type.title}</h3>
                        <ul className="space-y-3">
                            {type.items.map((item, j) => (
                                <li key={j} className="text-sm font-semibold opacity-80 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-current rounded-full" /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* Section: Manager Portal */}
        <section id="manager-portal" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                  <Building2 className="w-3.5 h-3.5" /> Property Management
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">The Manager Portal</h2>
               <p className="text-emerald-100/60 text-lg max-w-2xl mx-auto font-medium">
                  Professional waste infrastructure for student housing. Analytics, tracking, and compliance.
               </p>
            </div>
            
            <ManagerView />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-green-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500 rounded-l-full opacity-20 transition-transform hover:scale-110 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              Ready to transform your campus?
            </h2>
            <p className="text-green-50 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium opacity-90">
                Join the largest student-led sustainability network in East Africa. Zero hassle. Maximum impact.
            </p>
            <Link
               href="/contact"
               className="inline-flex items-center justify-center h-16 px-12 bg-white text-green-700 hover:bg-green-50 font-black text-xl rounded-2xl transition-all shadow-2xl hover:scale-105"
            >
               Partner with Green Loop
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
