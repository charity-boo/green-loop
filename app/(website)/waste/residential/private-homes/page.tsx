"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AuthCTA } from '@/components/features/auth/auth-cta';
import { 
  Calendar, Award, Leaf, ArrowLeft, Home, Sparkles, 
  Recycle, Trash2, BatteryWarning, CheckCircle2, XCircle, 
  TrendingDown, Users, TreePine, MapPin
} from 'lucide-react';

export default function PrivateHomesWastePage() {
  const currentPath = '/waste/residential/private-homes';

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      title: "Flexible Scheduling",
      description: "Choose weekly, bi-weekly, or on-demand pickups via our app. Tailor the schedule to your household&apos;s unique rhythm.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      title: "Real-Time Tracking",
      description: "Track your collector&apos;s arrival in real-time. Receive SMS or push notifications so you never miss a pickup.",
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: "Rewards Integration",
      description: "Automatically earn Green Points for every correct recycling action. Redeem points for community discounts and perks.",
    },
    {
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      title: "Eco-Friendly Disposal",
      description: "We guarantee that recyclables are properly sorted and sent to verified recycling partners, not landfills.",
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Sign Up & Schedule",
      description: "Create your account and tell us when you need your first pickup."
    },
    {
      step: "02",
      title: "Sort Your Waste",
      description: "Use our simple bins to separate recyclables from general waste."
    },
    {
      step: "03",
      title: "We Collect",
      description: "Our professional collectors arrive on time and handle the heavy lifting."
    },
    {
      step: "04",
      title: "Earn Rewards",
      description: "Get points for every successful eco-friendly pickup."
    }
  ];

  const wasteTypes = [
    {
      title: "Recyclables",
      icon: <Recycle className="w-8 h-8 text-blue-500" />,
      status: "approved",
      items: ["Paper & Cardboard", "Plastic Bottles (PET/HDPE)", "Glass Jars & Bottles", "Aluminum & Tin Cans"],
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Organic Waste",
      icon: <Leaf className="w-8 h-8 text-emerald-500" />,
      status: "approved",
      items: ["Food Scraps", "Yard Trimmings", "Coffee Grounds", "Tea Bags"],
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "General Waste",
      icon: <Trash2 className="w-8 h-8 text-slate-500" />,
      status: "approved",
      items: ["Non-recyclable Plastics", "Food Wrappers", "Broken Ceramics", "Hygiene Products"],
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      iconColor: "text-slate-600"
    },
    {
      title: "Hazardous (Not Allowed)",
      icon: <BatteryWarning className="w-8 h-8 text-rose-500" />,
      status: "rejected",
      items: ["Batteries & Electronics", "Chemicals & Paint", "Medical Waste", "Motor Oil"],
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      iconColor: "text-rose-600"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "5,000+", label: "Homes Enrolled" },
    { icon: <TrendingDown className="w-6 h-6" />, value: "250+", label: "Tons Diverted" },
    { icon: <TreePine className="w-6 h-6" />, value: "12,000", label: "Trees Saved" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xl tracking-tight">
            <Home className="w-6 h-6 text-emerald-500" />
            Green Loop
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-white pt-24 pb-32 overflow-hidden border-b border-slate-100">
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-50/50 blur-3xl opacity-60" />
            <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-lime-50/50 blur-3xl opacity-60" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    Residential Services
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Waste collection, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    made effortless.
                  </span>
                </motion.h1>

                <motion.p 
                className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                >
                Simple, reliable, scheduled, and on-demand waste collection for single-family residences. Elevate your household&apos;s sustainability with zero hassle.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4 text-sm font-medium text-slate-500"
                >
                  <div className="flex -space-x-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-slate-200 z-${10-i}`} />
                    ))}
                  </div>
                  <p>Join 5,000+ happy households</p>
                </motion.div>
              </div>
              
              <div className="w-full lg:w-1/2 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative aspect-square md:aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-white"
                >
                  <Image
                    src="/images/private-homes.png"
                    alt="Private Home Waste Collection"
                    fill
                    className="object-cover"
                    priority
                  />                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent" />
                </motion.div>
                
                {/* Floating Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-emerald-50"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Eco Impact</p>
                    <p className="text-lg font-bold text-slate-900">100% Sorted</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-12 bg-emerald-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-emerald-800">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center pt-6 md:pt-0 first:pt-0">
                  <div className="w-12 h-12 bg-emerald-800/50 rounded-full flex items-center justify-center text-emerald-300 mb-4">
                    {stat.icon}
                  </div>
                  <h4 className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</h4>
                  <p className="text-emerald-200 font-medium uppercase tracking-wide text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Collect Section */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What goes in your bin?</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Proper sorting helps us maximize recycling efforts and keep our community clean.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wasteTypes.map((type, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-6 rounded-3xl border ${type.borderColor} ${type.bgColor} transition-transform hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3 bg-white rounded-xl shadow-sm ${type.iconColor}`}>
                      {type.icon}
                    </div>
                    {type.status === "approved" ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{type.title}</h3>
                  <ul className="space-y-3">
                    {type.items.map((item, i) => (
                      <li key={i} className="flex items-start text-slate-700 text-sm">
                        <span className="mr-2 opacity-50">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50 relative border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:flex justify-between items-end">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Service Features</h2>
                <p className="text-slate-600 text-lg">Designed for modern households that prioritize convenience and sustainability.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-lg transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How it works</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">Four simple steps to a cleaner, more sustainable household.</p>
            </div>

            <div className="relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-100 via-emerald-300 to-emerald-100" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                {steps.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative text-center"
                  >
                    <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-emerald-50 shadow-xl flex items-center justify-center text-3xl font-black text-emerald-600 mb-6 relative z-10 transition-transform hover:scale-110">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-emerald-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute top-0 -right-1/4 w-1/2 h-full bg-gradient-to-l from-emerald-500/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-teal-500/30 to-transparent blur-3xl" />
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to simplify your waste collection?
            </h2>
            <p className="text-emerald-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Join thousands of private homes making a difference. Schedule your first pickup today and start earning rewards.
            </p>
            
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
              <AuthCTA redirectPath={currentPath} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
