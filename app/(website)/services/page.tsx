"use client";

import { motion } from "framer-motion";
import {
  Truck,
  Leaf,
  Recycle,
  BarChart3,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronRight,
  Info,
  CheckCircle2,
  Building2,
  Calendar,
  Phone,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ServiceCardProps {
  icon: any;
  title: string;
  description: string;
  features: string[];
  link: string;
  stats?: string;
  target?: string;
  delay: number;
  className?: string;
}

const ServiceCard = ({ icon: Icon, title, description, features, link, stats, target, delay, className }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    className={`bg-white rounded-[2rem] p-8 md:p-10 border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col group relative overflow-hidden ${className || ''}`}
  >
    {/* Subtle Glow */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
    
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      {target && (
        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest rounded-full border border-emerald-100">
          {target}
        </span>
      )}
    </div>
    
    <div className="relative z-10 flex-1 flex flex-col">
      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 mb-10 leading-relaxed text-lg max-w-lg">{description}</p>
      
      <div className="mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10 pb-8 border-b border-slate-100">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {stats && (
             <div className="flex items-center gap-2.5">
               <div className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </div>
               <span className="text-sm font-bold text-slate-600">{stats}</span>
             </div>
          )}
          <Link 
            href={link}
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 group/btn w-full sm:w-auto"
          >
            Explore Solution
            <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProcessStep = ({ icon: Icon, step, title, description, isLast }: any) => (
  <div className="relative flex gap-6 md:gap-10">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white border border-emerald-100 shadow-md shadow-emerald-900/5 flex items-center justify-center text-emerald-600 z-10 shrink-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Icon className="w-8 h-8 md:w-10 md:h-10 relative z-10" />
      </div>
      {!isLast && <div className="w-0.5 h-full bg-gradient-to-b from-emerald-100 to-transparent my-3" />}
    </div>
    <div className="pt-2 pb-16">
      <div className="text-sm font-bold text-emerald-500 mb-2 uppercase tracking-widest">Phase {step}</div>
      <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">{title}</h4>
      <p className="text-slate-500 leading-relaxed text-lg max-w-lg">{description}</p>
    </div>
  </div>
);

export default function ServicesPage() {
  const services = [
    {
      id: "pickup",
      icon: Truck,
      title: "Smart Collection",
      target: "Residential & SME",
      description: "On-demand and seamlessly scheduled waste collection powered by our AI-optimized routing engine for flawless reliability.",
      features: [
        "Predictive routing",
        "Live GPS tracking",
        "Dynamic scheduling",
        "Photo verified completion"
      ],
      link: "/schedule-pickup",
      stats: "Operating at 98% Efficiency",
      delay: 0.1,
      className: "md:col-span-2"
    },
    {
      id: "commercial",
      icon: Building2,
      title: "Enterprise Solutions",
      target: "Hospitals & Institutions",
      description: "Rigorous, regulation-compliant waste protocols for large facilities and medical centers.",
      features: [
        "Hazardous compliance",
        "Dedicated accounts",
        "High-capacity bins",
        "Certified destruction"
      ],
      link: "/waste/commercial/hospitals",
      stats: "NEMA Certified",
      delay: 0.2,
      className: "md:col-span-1 border-emerald-600 border-2 shadow-emerald-600/10" // highlight card
    },
    {
      id: "hub",
      icon: Recycle,
      title: "Circular Economy Hub",
      target: "Community",
      description: "Digital tools and educational resources to participate actively in material recovery and upcycling ecosystems.",
      features: [
        "AI waste classifier",
        "Recovery guidelines",
        "Lifecycle mapping",
        "Local workshops"
      ],
      link: "/learning-hub",
      stats: "15,000+ educated",
      delay: 0.3,
      className: "md:col-span-1"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Impact Analytics",
      target: "Data Portal",
      description: "Quantifiable, transparent ESG data reporting. Track your precise carbon footprint offset and waste diversion metrics in real-time.",
      features: [
        "Live diversion rates",
        "Carbon offsets",
        "Exportable ESG reports",
        "Automated auditing"
      ],
      link: "/auth/login",
      stats: "Real-time Telemetry Enabled",
      delay: 0.4,
      className: "md:col-span-2"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Modern Split Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        {/* Dynamic background artifacts */}
        <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-white to-transparent -z-10" />
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-[85rem] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-widest mb-8 shadow-sm">
                <Leaf className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                Comprehensive Solutions
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                Smart waste services for a <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-500 to-teal-600">cleaner tomorrow.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-10 max-w-xl">
                We blend intelligent logistics, real-time data, and deep sustainability practices to solve your toughest waste challenges seamlessly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <a href="#services-grid" className="w-full sm:w-auto px-8 py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 text-lg">
                    View Solutions
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a href="#how-it-works" className="w-full sm:w-auto px-8 py-5 bg-white border-2 border-slate-200 hover:borderColor-emerald-200 text-slate-700 rounded-xl font-bold transition-all flex items-center justify-center text-lg">
                    Discover our Process
                  </a>
              </div>
            </motion.div>

            {/* Right side floating feature graphics to make layout appealing */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative lg:h-[600px] hidden md:flex items-center justify-center lg:justify-end"
            >
               {/* Decorative Abstract UI Blocks */}
               <div className="relative w-full max-w-lg aspect-square">
                  <div className="absolute inset-0 bg-emerald-50 rounded-[3rem] rotate-3 opacity-60"></div>
                  <div className="absolute inset-0 bg-white rounded-[3rem] border border-emerald-100 shadow-2xl p-8 flex flex-col justify-between">
                     <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><Truck className="w-6 h-6" /></div>
                           <div>
                              <p className="font-bold text-slate-900">Active Routing</p>
                              <p className="text-sm text-slate-500">Fleet ID: GL-922</p>
                           </div>
                        </div>
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">In Transit</div>
                     </div>
                     <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative mb-6">
                        {/* Fake map/grid lines */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md animate-pulse"></div>
                        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-md z-1"></div>
                        <div className="absolute top-[45%] left-[30%] w-32 h-1 bg-emerald-200 -rotate-12 origin-left"></div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-sm text-slate-500 mb-1">Diverted Today</p>
                           <p className="text-2xl font-black text-emerald-600">4.2<span className="text-sm text-slate-400 ml-1">Tons</span></p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-sm text-slate-500 mb-1">Efficiency Ratio</p>
                           <p className="text-2xl font-black text-slate-900">98.5%</p>
                        </div>
                     </div>
                  </div>
                  
                  {/* Floating smaller card */}
                  <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute -right-12 top-1/4 bg-white p-5 py-6 rounded-2xl shadow-xl border border-slate-100 w-64"
                  >
                     <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                           <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">Pickup Confirmed</p>
                           <p className="text-xs text-slate-500">10 mins ago</p>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section id="services-grid" className="py-24 md:py-32 relative z-10 border-t border-slate-200/60">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="max-w-3xl mb-16 lg:mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Our Core Ecosystem</h2>
            <p className="text-slate-500 text-xl leading-relaxed">Whether you manage a single household or a multi-facility enterprise, we provide specific tools designed entirely for your scale.</p>
          </div>
          
          {/* Bento layout using CSS grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Modern Process Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="max-w-[85rem] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
               <div className="sticky top-32">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">An elegant, frictionless process.</h2>
                  <p className="text-slate-500 text-xl leading-relaxed mb-12">We handle the heavy lifting while giving you complete transparency. Experience entirely effortless waste management.</p>
                  
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-sm">
                     <p className="text-slate-800 font-bold text-xl mb-4">"It was incredibly easy."</p>
                     <p className="text-slate-600 mb-6 italic">Integration with Green Loop took literally zero effort. Their team assessed our bins and we instantly saw carbon reductions on the portal.</p>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-200 rounded-full border-2 border-white shadow-sm overflow-hidden"><Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" width={40} height={40}/></div>
                        <div>
                           <p className="font-bold text-sm text-slate-900">David M.</p>
                           <p className="text-xs text-slate-500">Facility Manager</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-8">
               <ProcessStep 
                 icon={MapPin}
                 step="1"
                 title="Enroll & Assess"
                 description="Sign up through our portal. For enterprise, we deploy an expert team to audit your current system and recommend precise deployment bins."
                 isLast={false}
               />
               <ProcessStep 
                 icon={Truck}
                 step="2"
                 title="Intelligent Collection"
                 description="Our digitally connected fleet is dispatched precisely when your bins hit capacity, minimizing traffic and carbon footprint per pickup."
                 isLast={false}
               />
               <ProcessStep 
                 icon={Recycle}
                 step="3"
                 title="Recovery & Sort"
                 description="Materials enter our specialized logistics centers where recyclables are rigorously segregated to guarantee zero cross-contamination."
                 isLast={false}
               />
               <ProcessStep 
                 icon={BarChart3}
                 step="4"
                 title="Data & Reporting"
                 description="Real-time compliance certificates, carbon offsets, and detailed ESG data are pushed straight to your dashboard for verified sustainability."
                 isLast={true}
               />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dark CTA Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 lg:p-24 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            {/* Dark mode glowing background artifacts */}
            <div className="absolute top-0 right-1/4 w-full h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-60 blur-2xl -z-10" />
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-emerald-500/30 blur-[100px] rounded-full" />
            
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6 border border-emerald-800/60 bg-emerald-950/50 px-4 py-2 rounded-full">
                <Building2 className="w-4 h-4" />
                Specialized Enterprise Programs
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                Scale your impact.<br /> Automate compliance.
              </h2>
              <p className="text-slate-400 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
                Discover custom corporate waste programs crafted to boost your facilities ESG rating while guaranteeing total peace of mind.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Link
                href="/contact-us"
                className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20 text-lg"
              >
                Let's Talk Numbers
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Refined Footer Info Strip */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 border border-slate-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-0.5">Operating Hours</p>
                <p className="text-sm text-slate-500">08:00 AM - 18:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0 md:pl-8 lg:pl-16">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 border border-slate-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-0.5">Standard Pickups</p>
                <p className="text-sm text-slate-500">Monday - Saturday</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-1/3 pt-4 md:pt-0 md:pl-8 lg:pl-16">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-600 border border-slate-100">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 mb-0.5">Commercial Hotline</p>
                <p className="text-sm text-slate-500">24/7 Priority Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
