import {
  Truck,
  Leaf,
  Recycle,
  BarChart3,
  MapPin,
  Clock,
  Building2,
  Calendar,
  Phone,
  ArrowUpRight,
  Shield,
  Zap,
  Globe,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  link: string;
  stats?: string;
  target?: string;
  className?: string;
  accentColor?: string;
}

const accentColorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600",
    hoverText: "group-hover:text-emerald-600",
    dot: "bg-emerald-500",
    glow: "bg-emerald-50 dark:bg-emerald-950/20"
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600",
    hoverText: "group-hover:text-blue-600",
    dot: "bg-blue-500",
    glow: "bg-blue-50 dark:bg-blue-950/20"
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-600",
    hoverText: "group-hover:text-teal-600",
    dot: "bg-teal-500",
    glow: "bg-teal-50 dark:bg-teal-950/20"
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-600",
    hoverText: "group-hover:text-indigo-600",
    dot: "bg-indigo-500",
    glow: "bg-indigo-50 dark:bg-indigo-950/20"
  }
};

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  link, 
  stats, 
  target, 
  className,
  accentColor = "emerald"
}: ServiceCardProps) => {
  const colors = accentColorMap[accentColor as keyof typeof accentColorMap];

  return (
    <div
      className={`group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-12 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden ${className || ''}`}
    >
      {/* Decorative Background Element */}
      <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${colors.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div className={`w-16 h-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
          <Icon className="w-8 h-8" />
        </div>
        {target && (
          <span className="px-4 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-zinc-100 dark:border-zinc-700">
            {target}
          </span>
        )}
      </div>
      
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className={`text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-tight ${colors.hoverText} transition-colors`}>{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed text-lg">{description}</p>
        
        <div className="mt-auto">
          <div className="space-y-4 mb-10">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 font-medium text-sm">
                <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            {stats && (
               <div className="flex items-center gap-2.5">
                 <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{stats}</span>
               </div>
            )}
            <Link 
              href={link}
              className="inline-flex items-center justify-center gap-2 text-zinc-900 dark:text-zinc-50 font-bold group/link transition-all"
            >
              <span className="relative">
                Explore Solution
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover/link:w-full" />
              </span>
              <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProcessStepProps {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
  isLast: boolean;
}

const ProcessStep = ({ icon: Icon, step, title, description, isLast }: ProcessStepProps) => (
  <div className="relative flex gap-8 md:gap-12">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-900 dark:bg-emerald-600 text-white flex items-center justify-center z-10 shrink-0 shadow-xl shadow-zinc-900/20">
        <Icon className="w-5 h-5 md:w-7 md:h-7" />
      </div>
      {!isLast && <div className="w-px h-full bg-zinc-200 dark:bg-zinc-800 my-4" />}
    </div>
    <div className="pt-1 pb-16">
      <div className="text-xs font-bold text-emerald-600 dark:text-emerald-500 mb-3 uppercase tracking-[0.3em]">Step {step}</div>
      <h4 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{title}</h4>
      <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg max-w-xl">{description}</p>
    </div>
  </div>
);

export default function ServicesPage() {
  const services = [
    {
      id: "pickup",
      icon: Truck,
      title: "Smart Logistics",
      target: "Residential",
      description: "AI-optimized waste collection that adapts to your neighborhood's rhythm, ensuring zero missed pickups and maximum efficiency.",
      features: [
        "Real-time Fleet Tracking",
        "Dynamic Path Optimization",
        "Verified Pickup Confirmation",
        "Community Waste Heatmaps"
      ],
      link: "/schedule-pickup",
      stats: "99.2% Reliability Rate",
      accentColor: "emerald"
    },
    {
      id: "commercial",
      icon: Building2,
      title: "Enterprise Ecosystems",
      target: "Commercial",
      description: "Professional-grade waste infrastructure for hospitals, schools, and corporate campuses with full regulatory compliance.",
      features: [
        "Hazardous Waste Handling",
        "Regulatory Compliance Reporting",
        "Dedicated Logistics Support",
        "High-Volume Infrastructure"
      ],
      link: "/waste/commercial/hospitals",
      stats: "NEMA & ISO Certified",
      accentColor: "blue",
      className: "md:translate-y-12"
    },
    {
      id: "hub",
      icon: Recycle,
      title: "Circular Economy",
      target: "Community",
      description: "Empowering communities with tools for material recovery, upcycling, and sustainable lifecycle management.",
      features: [
        "Digital Resource Hub",
        "Material Lifecycle Mapping",
        "Upcycling Workshops",
        "Community Rewards Program"
      ],
      link: "/learning-hub",
      stats: "20k+ Active Participants",
      accentColor: "teal"
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Precision Analytics",
      target: "Data Portal",
      description: "Transform your waste data into actionable insights with our comprehensive ESG reporting and carbon footprint tracking.",
      features: [
        "Live ESG Dashboards",
        "Carbon Offset Verification",
        "Automated Compliance Logs",
        "Predictive Waste Modeling"
      ],
      link: "/auth/login",
      stats: "Real-time Telemetry",
      accentColor: "indigo",
      className: "md:translate-y-12"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Editorial Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-56 md:pb-40 overflow-hidden border-b border-zinc-100 dark:border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.05),transparent_50%)]" />
        <div className="absolute -left-24 top-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full" />
        
        <div className="max-w-[85rem] mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Service Portfolio 2024
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-zinc-900 dark:text-zinc-50 mb-10 tracking-tighter leading-[0.9]">
              Engineering a <span className="text-emerald-600">Zero-Waste</span> Future.
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12 max-w-2xl">
              We provide the digital and physical infrastructure required to transition society towards a truly circular economy.
            </p>

            <div className="flex flex-wrap gap-6">
                <Link href="#services" className="px-10 py-5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full font-bold transition-all hover:scale-105 hover:shadow-2xl active:scale-95 text-lg">
                  Explore Services
                </Link>
                <Link href="/contact-us" className="px-10 py-5 bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-full font-bold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 text-lg">
                  Request Consultation
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-12 opacity-40 grayscale">
            <div className="flex items-center gap-2 font-bold text-xl"><Globe className="w-6 h-6"/> Global Standards</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Shield className="w-6 h-6"/> ISO Certified</div>
            <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6"/> AI Powered</div>
            <div className="flex items-center gap-2 font-bold text-xl text-emerald-600"><Leaf className="w-6 h-6"/> Eco-First</div>
          </div>
        </div>
      </section>

      {/* Services Grid with Staggered Layout */}
      <section id="services" className="py-32 md:py-48">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end mb-32">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 tracking-tighter">Scalable solutions for every scale.</h2>
            </div>
            <div className="lg:pb-4">
              <p className="text-zinc-500 dark:text-zinc-400 text-xl leading-relaxed max-w-lg">From residential pickups to complex industrial waste ecosystems, our services are built on a foundation of technology and transparency.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Dark Mode Focus */}
      <section className="py-32 md:py-48 bg-zinc-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>

        <div className="max-w-[85rem] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
               <div className="lg:sticky lg:top-40">
                  <div className="w-20 h-1 bg-emerald-500 mb-10" />
                  <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter leading-tight">The Lifecycle of Impact.</h2>
                  <p className="text-zinc-400 text-xl leading-relaxed mb-16 max-w-lg">We&apos;ve distilled complex waste management into a four-step digital process that guarantees results and provides peace of mind.</p>
                  
                  <div className="flex items-center gap-12 border-t border-zinc-800 pt-12">
                    <div>
                      <p className="text-4xl font-bold text-emerald-500 mb-2">98%</p>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Diversion Rate</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-emerald-500 mb-2">24/7</p>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Monitoring</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="pt-12 lg:pt-0">
               <ProcessStep 
                 icon={MapPin}
                 step="01"
                 title="Intelligent Enrollment"
                 description="Our AI assesses your waste profile and location to create a custom logistics plan tailored to your specific needs."
                 isLast={false}
               />
               <ProcessStep 
                 icon={Truck}
                 step="02"
                 title="Precision Collection"
                 description="Fleet dispatch is triggered by data-driven demand, minimizing emissions and maximizing reliability."
                 isLast={false}
               />
               <ProcessStep 
                 icon={Recycle}
                 step="03"
                 title="Advanced Recovery"
                 description="Materials are processed in our specialized facilities where sorting accuracy exceeds industry standards."
                 isLast={false}
               />
               <ProcessStep 
                 icon={BarChart3}
                 step="04"
                 title="Impact Verification"
                 description="Every gram is tracked. Receive verified ESG reports and carbon credits directly to your dashboard."
                 isLast={true}
               />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist CTA */}
      <section className="py-32 md:py-56 bg-white dark:bg-black">
        <div className="max-w-[85rem] mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-8xl font-bold text-zinc-900 dark:text-zinc-50 mb-12 tracking-tighter leading-none">
            Ready to close <br className="hidden md:block"/> the loop?
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xl md:text-2xl mb-16 max-w-2xl mx-auto">
            Join 500+ enterprises and thousands of households building a cleaner future with Green Loop.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register"
              className="px-12 py-6 bg-emerald-600 text-white rounded-full font-bold text-xl hover:bg-emerald-500 transition-all hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
            >
              Get Started Now
            </Link>
            <Link
              href="/contact-us"
              className="px-12 py-6 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-full font-bold text-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Refined Info Strip */}
      <footer className="py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="max-w-[85rem] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Availability</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Standard pickups operate Monday through Saturday, 08:00 AM to 18:00 PM. Emergency services 24/7.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Scheduling</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Managed via our digital portal. Residential pickups are bi-weekly; commercial is on-demand or daily.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-50">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Support</h4>
              <p className="text-zinc-500 dark:text-zinc-400">Priority support line available for enterprise clients. Residential support via in-app chat.</p>
            </div>
          </div>
          <div className="mt-32 pt-12 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-zinc-400 text-sm">© 2024 Green Loop Technologies. All rights reserved.</p>
            <div className="flex gap-8 text-sm font-bold text-zinc-400">
              <Link href="/privacy" className="hover:text-emerald-500 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-emerald-500 transition-colors">Terms</Link>
              <Link href="/cookies" className="hover:text-emerald-500 transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
