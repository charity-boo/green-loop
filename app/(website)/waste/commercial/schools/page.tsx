"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AuthCTA } from '@/components/features/auth/auth-cta';
import { 
  BookOpen, Leaf, Recycle, GraduationCap,
  Users, ArrowLeft, Trees, Sprout, Award,
  Sparkles, ShieldCheck
} from 'lucide-react';

export default function SchoolsWastePage() {
  const currentPath = '/waste/commercial/schools';

  const features = [
    {
      icon: <Sprout className="w-8 h-8 text-green-600" />,
      title: "Campus-Wide Composting",
      description: "Dedicated strategies for cafeteria food waste, landscaping debris, and biodegradable materials to achieve zero-waste goals.",
    },
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: "Classroom Recycling Hubs",
      description: "Providing high-visibility, color-coded bins for every classroom to maximize paper, plastic, and cardboard recovery.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Student-Led Initiatives",
      description: "Partnering with student sustainability boards to track and report diversion metrics, gamifying campus recycling.",
    },
    {
      icon: <Award className="w-8 h-8 text-green-600" />,
      title: "Green Certifications",
      description: "Comprehensive audits and compliance reporting to help your institution qualify for national green campus accreditations.",
    }
  ];

  const spaces = [
    {
      title: "Academic Buildings",
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      description: "Specialized recovery for heavy paper usage, administrative document shredding, and breakroom recyclables.",
    },
    {
      title: "Dining Halls",
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      description: "Industrial-scale food waste segregation and eco-friendly collection management for high-volume campus dining.",
    },
    {
      title: "Dormitories & Housing",
      icon: <Trees className="w-8 h-8 text-green-600" />,
      description: "Move-in and move-out bulk collections, electronics recycling drives, and comprehensive residential sorting programs.",
    },
    {
      title: "Athletic Facilities",
      icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
      description: "High-traffic event day logistics, stadium clean-ups, and coordinated waste diversion for large campus events.",
    }
  ];

  const milestones = [
    {
      stat: "01",
      title: "Waste Audit",
      description: "We analyze your campus footprint to design custom recycling hubs that fit naturally into student routines."
    },
    {
      stat: "02",
      title: "Infrastructure",
      description: "Deployment of smart, unified green and white bins across all academic and residential buildings."
    },
    {
      stat: "03",
      title: "Education",
      description: "Hosting interactive workshops and providing clear signage to ensure maximum participation and proper sorting."
    },
    {
      stat: "04",
      title: "Impact Reports",
      description: "Monthly sustainability dashboards measuring carbon offset and diversion rates to share with the student body."
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-green-200 selection:text-green-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/#services" 
            className="flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <div className="flex items-center gap-2 text-green-900 font-bold text-xl tracking-tight">
            <GraduationCap className="w-6 h-6 text-green-600" />
            Green Loop Education
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Education Hero Section */}
        <section className="bg-green-50 py-20 lg:py-32 border-b border-green-100 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 pointer-events-none">
            <GraduationCap className="w-96 h-96 text-green-900" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
              {/* Text Content */}
              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-green-200 text-green-800 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                    <Sparkles className="w-4 h-4 text-green-600" />
                    Schools & Universities
                  </div>
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-green-950 tracking-tight leading-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Inspiring a greener <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                    campus future.
                  </span>
                </motion.h1>

                <motion.p 
                  className="text-lg md:text-xl text-green-800 leading-relaxed mb-10 max-w-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  We transform your institution into a zero-waste leader. From interactive classroom recycling to dining hall composting, our educational programs build sustainable habits for a lifetime.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="#campus-plan" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-green-600 text-white font-bold border border-green-600 hover:bg-green-700 transition-all shadow-lg shadow-green-600/20">
                    View Campus Plan
                  </Link>
                  <Link href="#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-green-800 font-bold border border-green-200 hover:bg-green-100 transition-all shadow-sm">
                    Book an Audit
                  </Link>
                </motion.div>
              </div>
              
              {/* Hero Image */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="w-full max-w-lg aspect-square lg:aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border border-green-200 bg-green-100"
                >
                  {/* Using an unsplash placeholder representing a green campus / students */}
                  <Image 
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80" 
                    alt="University Campus Sustainability" 
                    fill 
                    className="object-cover mix-blend-multiply opacity-90"
                    priority
                  />
                  {/* Green tint overlay */}
                  <div className="absolute inset-0 bg-green-900/10" />
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-white border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-950 mb-6">Designed For Education</h2>
              <p className="text-green-800 text-lg max-w-2xl mx-auto font-medium">
                Our services go beyond standard pickup. We actively engage with your student body to foster environmental stewardship and visible campus improvements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row gap-6 p-8 bg-green-50 rounded-3xl shadow-sm border border-green-100 hover:shadow-lg hover:border-green-300 transition-all group"
                >
                  <div className="shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border border-green-200 group-hover:bg-green-600 transition-colors duration-300">
                    <div className="transition-colors duration-300 group-hover:text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-950 mb-3">{feature.title}</h3>
                    <p className="text-green-800 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-24 bg-green-50 border-b border-green-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-green-950 mb-6">Every Building Covered</h2>
              <p className="text-green-800 text-lg max-w-2xl mx-auto font-medium">
                Campus environments are highly complex. We manage distinct waste profiles across all operational areas seamlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {spaces.map((space, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 bg-white rounded-3xl border border-green-200 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 bg-green-50 rounded-2xl mb-6">
                    {space.icon}
                  </div>
                  <h3 className="text-xl font-bold text-green-950 mb-4">{space.title}</h3>
                  <p className="text-green-800 text-base leading-relaxed">{space.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Plan */}
        <section id="campus-plan" className="py-24 bg-green-950 text-green-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">The Campus Blueprint</h2>
              <p className="text-green-200 text-lg max-w-2xl mx-auto font-medium">A strategic rollout methodology ensuring minimal disruption to the academic calendar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
              
              <div className="hidden lg:block absolute top-[2.5rem] left-[10%] w-[80%] h-0.5 bg-green-900" />
              
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center relative z-10"
                >
                  <div className="w-20 h-20 bg-green-900 rounded-2xl flex items-center justify-center text-3xl font-black text-green-400 mb-8 border border-green-800 shadow-xl">
                    {milestone.stat}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{milestone.title}</h3>
                  <p className="text-green-200 text-base leading-relaxed">{milestone.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA (Single Login area as requested format) */}
        <section id="contact" className="py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-green-950 mb-8 leading-tight">
              Ready to elevate your <br className="hidden md:block" />campus sustainability?
            </h2>
            <p className="text-green-800 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
              Join leading institutions tracking towards zero-waste today. Connect with our academic specialists.
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