"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AuthCTA } from '@/components/features/auth/auth-cta';
import { 
  Building2, ShieldCheck, Clock, BarChart3, ArrowLeft,
  Briefcase, FileText, Monitor, Coffee, Target, CheckCircle2
} from 'lucide-react';

export default function SmeWastePage() {
  const currentPath = '/waste/commercial/sme';

  const benefits = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      title: "Regulatory Compliance",
      description: "Stay fully compliant with local waste disposal regulations. We handle the paperwork and provide necessary certificates of destruction.",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Flexible Scheduling",
      description: "Schedule pickups that align with your business hours, ensuring zero disruption to your daily operations.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Impact Reporting",
      description: "Receive detailed monthly sustainability reports. Track your diversion rates and showcase your CSR commitments.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
      title: "Cost Efficiency",
      description: "Transparent, volume-based pricing. Maximize recycling to reduce landfill fees and lower your overall operational costs.",
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Assess Needs",
      description: "We evaluate your waste volume and streams to recommend the optimal bin setup."
    },
    {
      step: "02",
      title: "Tailored Setup",
      description: "Delivery of clean, labeled bins designed for office and retail environments."
    },
    {
      step: "03",
      title: "Routine Collection",
      description: "Reliable, discrete collection by our professional team on your preferred schedule."
    },
    {
      step: "04",
      title: "Impact Reports",
      description: "Monthly data on your waste diversion to share with stakeholders and customers."
    }
  ];

  const wasteStreams = [
    {
      title: "Office Paper & Cardboard",
      icon: <FileText className="w-8 h-8 text-green-600" />,
      description: "Secure recycling for documents, mail, and delivery packaging.",
    },
    {
      title: "E-Waste & Toners",
      icon: <Monitor className="w-8 h-8 text-green-600" />,
      description: "Safe disposal of old computers, printers, batteries, and empty ink cartridges.",
    },
    {
      title: "Breakroom Organics",
      icon: <Coffee className="w-8 h-8 text-green-600" />,
      description: "Composting solutions for coffee grounds, food scraps, and compostable tableware.",
    },
    {
      title: "General Retail & Office",
      icon: <Briefcase className="w-8 h-8 text-green-600" />,
      description: "Management of non-recyclable plastics and general daily operational waste.",
    }
  ];

  const metrics = [
    { value: "500+", label: "SMEs Partnered" },
    { value: "40%", label: "Average Cost Reduction" },
    { value: "99%", label: "Compliance Rate" },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-2 text-green-800 font-bold text-xl tracking-tight">
            <Building2 className="w-6 h-6 text-green-600" />
            Green Loop Commercial
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Simple & Clean Hero Section */}
        <section className="bg-green-50 py-20 lg:py-32 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-800 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                    <Target className="w-4 h-4 text-green-600" />
                    For Small & Medium Enterprises
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-green-900 tracking-tight leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Smarter waste management for modern businesses.
                </motion.h1>

                <motion.p 
                  className="text-lg md:text-xl text-green-800/80 leading-relaxed mb-10 max-w-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Reliable, compliant, and cost-effective recycling and waste solutions tailored for local shops, offices, and growing enterprises.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="#how-it-works" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-green-800 font-bold border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm">
                    View Process
                  </Link>
                </motion.div>
              </div>
              
              {/* Hero Image (No Overlapping Elements) */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="w-full max-w-lg aspect-square lg:aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
                >
                  <Image 
                    src="/images/commercial.png" 
                    alt="Commercial Waste Management Office" 
                    fill 
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Business Metrics (Green Background) */}
        <section className="py-16 bg-green-800 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-green-700">
              {metrics.map((metric, i) => (
                <div key={i} className="flex flex-col items-center pt-8 sm:pt-0 first:pt-0 text-center">
                  <h4 className="text-5xl font-black mb-3 text-white">
                    {metric.value}
                  </h4>
                  <p className="text-green-200 font-semibold tracking-wide uppercase text-sm">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Benefits (White Background) */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">Why businesses choose us</h2>
              <p className="text-green-800/70 text-lg max-w-2xl mx-auto font-medium">
                Purpose-built tools and services designed to minimize compliance risks while driving operational efficiency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-3xl border border-green-100 shadow-lg shadow-green-100/50 hover:shadow-xl hover:border-green-300 transition-all"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-900 mb-3">{benefit.title}</h3>
                    <p className="text-green-800/80 leading-relaxed text-lg">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tailored Waste Streams (Green-50 Background) */}
        <section className="py-24 bg-green-50 border-y border-green-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">Comprehensive Waste Streams</h2>
              <p className="text-green-800/80 text-lg max-w-2xl mx-auto font-medium">We provide specialized bins and collection methods for everything a modern office or retail space generates.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 hover:cursor-default">
              {wasteStreams.map((stream, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 bg-white rounded-3xl border border-green-100 shadow-md shadow-green-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                >
                  <div className="p-4 bg-green-50 rounded-2xl mb-6">
                    {stream.icon}
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-4">{stream.title}</h3>
                  <p className="text-green-800/70 text-base leading-relaxed">{stream.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (White Background) */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">A simple B2B process</h2>
              <p className="text-green-800/70 text-lg max-w-2xl mx-auto font-medium">From rapid deployment to monthly reporting, here is how we integrate with your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center relative"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl font-black text-green-700 mb-8 border-4 border-white shadow-xl z-10">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-4">{step.title}</h3>
                  <p className="text-green-800/80 text-lg leading-relaxed">{step.description}</p>
                  
                  {/* Subtle connector for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-full h-1 bg-green-50" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA (Green-900 Background) */}
        <section className="py-24 bg-green-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Upgrade your commercial waste strategy.
            </h2>
            <p className="text-green-100 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Join hundreds of compliant, cost-effective, and sustainable businesses. Get your custom quote today.
            </p>
            
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center max-w-md mx-auto relative overflow-hidden">
               {/* Decorative subtle element inside CTA */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full opacity-50 pointer-events-none" />
               <div className="w-full relative z-10 text-green-800">
                 <AuthCTA redirectPath={currentPath} />
               </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}