'use client';

import { StaticStudentHub } from "@/components/features/waste/hostels/static-student-hub";
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
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900 font-sans">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
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
        <section className="relative bg-white pt-24 pb-36 overflow-hidden border-b border-green-50">
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-green-50/40 blur-[120px] opacity-70" />
            <div className="absolute top-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-green-50/40 blur-[120px] opacity-70" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              <div className="w-full lg:w-3/5 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100/60 border border-green-200 text-green-700 text-xs font-black uppercase tracking-[0.2em] mb-8">
                    <Sparkles className="w-3.5 h-3.5" />
                    Green Campus Initiative
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-6xl md:text-7xl lg:text-8xl font-black text-green-950 tracking-tighter leading-[0.95] mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Smarter Waste for{" "}
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                    Hostels & Students.
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-xl md:text-2xl text-green-800/80 leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Stay informed about collection schedules, track campus rankings, and discover how Ndagani is becoming East Africa&apos;s greenest student hub.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
                >
                   <button
                    onClick={() => scrollToSection("student-hub")}
                    className="w-full sm:w-auto px-12 py-5 bg-green-600 hover:bg-green-700 text-white font-black text-lg rounded-2xl shadow-[0_20px_40px_-15px_rgba(22,163,74,0.3)] transition-all hover:-translate-y-1 active:scale-95"
                  >
                    View Schedule
                  </button>
                   <button
                    onClick={() => scrollToSection("manager-portal")}
                    className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-green-200 hover:border-green-600 hover:text-green-600 text-green-800 font-black text-lg rounded-2xl transition-all hover:-translate-y-1 shadow-sm active:scale-95"
                  >
                    Manager Portal
                  </button>
                </motion.div>
              </div>
              
              <div className="w-full lg:w-2/5 relative">
                 <div className="relative aspect-square w-full max-w-md mx-auto flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: 12 }}
                      animate={{ opacity: 1, scale: 1, rotate: 12 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute w-full h-full bg-gradient-to-br from-green-500 to-green-700 rounded-[4rem] shadow-2xl opacity-10 blur-2xl"
                    />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      className="absolute w-4/5 h-4/5 bg-gradient-to-br from-green-500 to-green-600 rounded-[3.5rem] shadow-2xl rotate-6 flex items-center justify-center p-8 group overflow-hidden"
                    >
                        <Recycle className="h-4/5 w-4/5 text-white opacity-20 group-hover:rotate-45 transition-transform duration-1000" />
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                      animate={{ opacity: 1, scale: 1, rotate: -6 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="absolute w-4/5 h-4/5 bg-white border border-green-50 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-10 text-center z-10"
                    >
                        <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center mb-8 border border-green-100 shadow-inner">
                            <GraduationCap className="h-12 w-12 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-black text-green-900 mb-3 tracking-tight">Eco-Warrior</h3>
                        <p className="text-green-500 font-black uppercase tracking-[0.3em] text-[10px]">Level 04 Student</p>
                        
                        <div className="mt-8 flex gap-1">
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className={`w-8 h-1.5 rounded-full ${i < 5 ? 'bg-green-500' : 'bg-green-100'}`} />
                           ))}
                        </div>
                    </motion.div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-16 bg-green-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] border border-white/10 flex items-center justify-center text-green-300 mb-6 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                    {stat.icon}
                  </div>
                  <h4 className="text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h4>
                  <p className="text-green-200 font-black uppercase tracking-[0.2em] text-[10px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Student Hub */}
        <section id="student-hub" className="py-24 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-green-950 mb-4 tracking-tight">The Student Hub</h2>
               <p className="text-green-800/60 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                  Track your hostel rank, earn points for every bag sorted, and win campus competitions.
               </p>
            </div>
            
            <StaticStudentHub />
          </div>
        </section>

        {/* Section: How it works (Student) */}
        <section className="py-32 bg-green-50/30 border-y border-green-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent" />
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 text-green-950">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">The Student Path</h2>
              <p className="text-green-800/70 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                Four simple steps to transform your campus residency into a sustainability powerhouse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-green-200 border-t border-dashed border-green-300 -z-0" />
              
              {[
                { step: "01", title: "Check Schedule", desc: "View the collection days for your campus zone to stay prepared." },
                { step: "02", title: "Sort & Bag", desc: "Use our color-coded bin sets to properly sort your recyclables." },
                { step: "03", title: "Track Impact", desc: "See your hostel climb the ranks as you hit collection targets." },
                { step: "04", title: "Win Big!", desc: "Hostels with the highest recycling rates win campus rewards." },
              ].map((step, index) => (
                <div key={index} className="relative text-center group">
                  <div className="w-24 h-24 mx-auto bg-white rounded-[2.5rem] border-4 border-green-50 shadow-2xl flex items-center justify-center text-4xl font-black text-green-600 mb-8 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-500">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-black text-green-950 mb-4 tracking-tight">{step.title}</h3>
                  <p className="text-green-800/60 font-medium leading-relaxed px-4 opacity-80">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Waste Guide */}
        <section id="waste-guide" className="py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-green-950 mb-6 tracking-tighter">Campus Sorting Guide</h2>
              <p className="text-green-800/60 text-xl max-w-2xl mx-auto font-medium">
                Accurate sorting is the backbone of our recycling ecosystem. Here&apos;s your quick reference.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                      title: "Plastic & Metal", 
                      icon: <Recycle className="h-10 w-10" />, 
                      color: "bg-green-600", 
                      lightColor: "bg-green-50 text-green-700 border-green-100",
                      items: ["PET Bottles", "Soda Cans", "Cleaning Jars", "Cosmetic Tubes"] 
                    },
                    { 
                      title: "Organic Waste", 
                      icon: <Leaf className="h-10 w-10" />, 
                      color: "bg-green-500", 
                      lightColor: "bg-green-50 text-green-700 border-green-100",
                      items: ["Leftover Food", "Fruit Peels", "Coffee Grounds", "Veggie Scraps"] 
                    },
                    { 
                      title: "Paper & General", 
                      icon: <Recycle className="h-10 w-10" />, 
                      color: "bg-green-800", 
                      lightColor: "bg-green-50 text-green-800 border-green-100",
                      items: ["Assignments", "Cardboard", "Old Tissues", "Snack Wrappers"] 
                    },
                ].map((type, i) => (
                    <div key={i} className={`p-10 rounded-[3rem] border-2 ${type.lightColor} transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-100 group`}>
                        <div className={`p-5 ${type.color} text-white rounded-[2rem] shadow-xl inline-flex mb-10 group-hover:scale-110 transition-transform`}>
                            {type.icon}
                        </div>
                        <h3 className="text-3xl font-black mb-6 tracking-tight">{type.title}</h3>
                        <ul className="space-y-4">
                            {type.items.map((item, j) => (
                                <li key={j} className="text-base font-bold opacity-80 flex items-center gap-3">
                                    <span className={`w-2 h-2 ${type.color} rounded-full`} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* Section: Manager Portal */}
        <section id="manager-portal" className="py-24 bg-green-950 text-white relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-10 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-6">
                  <Building2 className="w-3.5 h-3.5" /> Property Management
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">The Manager Portal</h2>
               <p className="text-green-100/60 text-lg max-w-2xl mx-auto font-medium">
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
