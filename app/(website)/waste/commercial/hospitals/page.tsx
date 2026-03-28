"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AuthCTA } from '@/components/features/auth/auth-cta';
import { 
  Building2, ShieldAlert, FileDigit, HeartPulse, ArrowLeft,
  Stethoscope, ShieldCheck, FileCheck, Users, Activity,
  Syringe, FlaskConical, AlertTriangle, BookOpenCheck
} from 'lucide-react';

export default function HospitalsWastePage() {
  const currentPath = '/waste/commercial/hospitals';

  const benefits = [
    {
      icon: <ShieldAlert className="w-8 h-8 text-green-600" />,
      title: "Guaranteed Compliance",
      description: "Our protocols strictly adhere to national health and safety regulations for biohazardous and clinical waste.",
    },
    {
      icon: <FileDigit className="w-8 h-8 text-green-600" />,
      title: "Automated Manifests",
      description: "Digital tracking and automated reporting provide a flawless audit trail from collection to final destruction.",
    },
    {
      icon: <HeartPulse className="w-8 h-8 text-green-600" />,
      title: "Discreet & Safe",
      description: "Scheduled collections designed to minimize disruption to patient care and maintain a sterile, secure environment.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Staff Training Programs",
      description: "We provide comprehensive on-site training for your medical staff on proper segregation and containment procedures.",
    }
  ];

  const wasteStreams = [
    {
      title: "Biohazard Waste",
      icon: <AlertTriangle className="w-8 h-8 text-green-600" />,
      description: "Safe collection and incineration of infectious materials, contaminated PPE, and anatomical waste.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100"
    },
    {
      title: "Sharps Disposal",
      icon: <Syringe className="w-8 h-8 text-green-600" />,
      description: "Puncture-resistant containers and secure handling for needles, scalpels, and broken clinical glass.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100"
    },
    {
      title: "Pharmaceuticals",
      icon: <FlaskConical className="w-8 h-8 text-green-600" />,
      description: "Compliant destruction of expired medications, controlled substances, and cytotoxic waste.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100"
    },
    {
      title: "General Clinical Facility",
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      description: "Standard recycling and general waste stream management for hospital administrative areas and cafeterias.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-100"
    }
  ];

  const protocols = [
    {
      step: "01",
      title: "Facility Assessment",
      description: "Comprehensive audit of your current waste streams, segregation points, and volume requirements."
    },
    {
      step: "02",
      title: "Secure Containment",
      description: "Deployment of UN-approved, color-coded bins and sharps containers to designated clinical areas."
    },
    {
      step: "03",
      title: "Regulated Collection",
      description: "Licensed fleet arrives on a strict schedule. Waste is scanned and digitally logged at the point of transfer."
    },
    {
      step: "04",
      title: "Certified Destruction",
      description: "Waste is transported to specialized facilities for autoclaving or incineration. Certificates of destruction are issued automatically."
    }
  ];

  return (
    <div className="min-h-screen bg-green-50 selection:bg-green-200 selection:text-green-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-2 text-green-900 font-bold text-xl tracking-tight">
            <Stethoscope className="w-6 h-6 text-green-600" />
            Green Loop Clinical
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Medical Hero Section */}
        <section className="bg-white py-20 lg:py-32 border-b border-green-100 relative overflow-hidden">
          {/* Subtle medical cross pattern background */}
          <div className="absolute inset-0 bg-[url('/images/pattern-cross.svg')] opacity-[0.03] pointer-events-none filter hue-rotate-90 saturate-200" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-800 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                    <Activity className="w-4 h-4 text-green-600" />
                    Hospitals & Clinics
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-green-950 tracking-tight leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Uncompromising safety.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                    Trusted clinical disposal.
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-lg md:text-xl text-green-800 leading-relaxed mb-10 max-w-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Specialized, highly regulated waste management tailored for healthcare facilities. We prioritize regulatory compliance, patient safety, and seamless operations over all else.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="#clinical-protocols" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-green-600 text-white font-bold border border-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                    View Clinical Protocols
                  </Link>
                  <Link href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-green-800 font-bold border border-green-200 hover:bg-green-50 transition-all shadow-sm">
                    Request Consultation
                  </Link>
                </motion.div>
              </div>
              
              {/* Hero Image */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="w-full max-w-lg aspect-square lg:aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border border-green-100 bg-white"
                >
                  <Image 
                    src="/images/hospital.png" 
                    alt="Clinical Waste Management" 
                    fill 
                    className="object-cover"
                    priority
                  />
                  {/* Subtle green gradient overlay for clinical feel */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 to-transparent" />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Core Pillars / Benefits */}
        <section className="py-24 bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-950 mb-6">Built for Healthcare</h2>
              <p className="text-green-800 text-lg max-w-2xl mx-auto font-medium">
                Our clinical services are engineered from the ground up to mitigate risk and ensure total chain-of-custody compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-3xl shadow-sm border border-green-100 hover:shadow-lg hover:border-green-300 transition-all group"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    <div className="transition-colors duration-300 group-hover:text-white">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-950 mb-3">{benefit.title}</h3>
                    <p className="text-green-800 leading-relaxed text-lg">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialized Waste Streams */}
        <section className="py-24 bg-white border-b border-green-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-950 mb-6">Regulated Waste Streams</h2>
              <p className="text-green-800 text-lg max-w-2xl mx-auto font-medium">Clear classification and strict handling for every type of clinical byproduct.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wasteStreams.map((stream, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`p-8 bg-white rounded-3xl border-2 ${stream.borderColor} flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`p-4 ${stream.bgColor} rounded-2xl mb-6`}>
                    {stream.icon}
                  </div>
                  <h3 className="text-xl font-bold text-green-950 mb-4">{stream.title}</h3>
                  <p className="text-green-800 text-base leading-relaxed">{stream.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Clinical Protocols (Process) */}
        <section id="clinical-protocols" className="py-24 bg-green-950 text-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Rigorous Protocols</h2>
              <p className="text-green-200 text-lg max-w-2xl mx-auto font-medium">From initial assessment to final certification, our chain-of-custody is flawless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
              
              <div className="hidden lg:block absolute top-[2.5rem] left-[10%] w-[80%] h-0.5 bg-green-900" />
              
              {protocols.map((protocol, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <div className="w-20 h-20 bg-green-900 rounded-2xl flex items-center justify-center text-3xl font-black text-green-400 mb-8 border border-green-800 shadow-xl">
                    {protocol.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{protocol.title}</h3>
                  <p className="text-green-200 text-base leading-relaxed">{protocol.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Training Banner */}
        <section className="py-16 bg-green-600 text-white border-y border-green-700">
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl">
                <BookOpenCheck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Need Staff Training?</h3>
                <p className="text-green-100 font-medium">We offer certified on-site training for hospital staff on segregation and safety.</p>
              </div>
            </div>
            <Link href="#contact" className="px-6 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors shrink-0">
              Learn More
            </Link>
          </div>
        </section>

        {/* CTA (Single Login area as requested format) */}
        <section id="contact" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-8 leading-tight">
              Partner with the clinical <br className="hidden md:block" />waste experts.
            </h2>
            <p className="text-green-800 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Secure your operations, protect your staff, and automate your compliance reporting today.
            </p>
            
            <div className="bg-green-50 p-8 md:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-md mx-auto border border-green-200">
               <div className="w-full text-green-900">
                 <AuthCTA redirectPath={currentPath} />
               </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}