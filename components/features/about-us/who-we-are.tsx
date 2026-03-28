"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// ── Animated counter hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ── Intersection observer hook ─────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ value, suffix, label, started }: { value: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, 2200, started);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-green-200 text-sm font-medium uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ── Core values data ───────────────────────────────────────────────────────
const VALUES = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Community First",
    description: "Every decision we make puts the people of Ndagani and neighbouring regions at the centre.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Integrity",
    description: "We operate transparently and deliver on every promise made to our clients and the environment.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Innovation",
    description: "We harness AI, IoT, and data science to build smarter, faster, and greener waste solutions.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Sustainability",
    description: "Every tonne diverted from landfill is a step towards a circular economy that benefits future generations.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Accountability",
    description: "We track, report, and improve — holding ourselves to the highest standards at every stage.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: "Excellence",
    description: "We strive to exceed expectations in every collection, every sort, and every community interaction.",
  },
];

// ── Methodology steps ──────────────────────────────────────────────────────
const STEPS = [
  { number: "01", title: "Collection", description: "Waste collected from households, businesses, hostels, hospitals, and SMEs across Ndagani, Slaughter, Muongoni, Lowland, and Tumaini." },
  { number: "02", title: "Smart Sorting", description: "AI-guided sorting classifies waste into recyclables, organics, and hazardous materials for optimal downstream processing." },
  { number: "03", title: "Processing", description: "Organic waste is composted into fertiliser, recyclables are prepared for reuse, and hazardous materials are safely contained." },
  { number: "04", title: "Community Education", description: "Workshops and campaigns equip residents with knowledge and habits for sustainable waste management." },
  { number: "05", title: "Reporting", description: "Users receive real-time notifications, environmental impact reports, and green-score tips through our platform." },
];

// ── Tech innovations ───────────────────────────────────────────────────────
const TECH = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Waste Sorting",
    description: "Computer-vision models identify and classify waste in real time, reducing sorting errors by up to 80%.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart Collection Tracking",
    description: "GPS-enabled collection vehicles and route optimisation reduce fuel use and ensure timely pickups.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Data-Driven Insights",
    description: "Live dashboards surface recycling rates, collection trends, and environmental impact for every zone.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Circular Economy Platform",
    description: "A marketplace that connects recyclable material suppliers with buyers, closing the loop locally.",
  },
];

// ── Partners ───────────────────────────────────────────────────────────────
const PARTNERS = [
  { name: "County Government", icon: "🏛️" },
  { name: "Local Schools & NGOs", icon: "🏫" },
  { name: "Local Businesses", icon: "🏢" },
  { name: "Tech Providers", icon: "💻" },
  { name: "Environmental NGOs", icon: "🌍" },
  { name: "Research Institutions", icon: "🔬" },
];

// ══════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════
const WhoWeAre = () => {
  const statsRef = useInView(0.3);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    if (statsRef.inView) setStatsStarted(true);
  }, [statsRef.inView]);

  return (
    <>
      {/* ── 1. WHO WE ARE ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <Image
              src="/images/whoweare.png"
              alt="Green Loop community cleanup"
              width={700}
              height={500}
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Floating badge */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Based in</div>
                <div className="text-sm font-bold text-green-800">Ndagani, Kenya</div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              Who We Are
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Turning Waste Into <span className="text-green-600">Value</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              We are <strong className="text-green-700">Green Loop</strong> — an environmental solutions organisation committed to transforming
              waste into value. Our focus is creating a cleaner, greener future for Ndagani and its
              neighbouring regions by managing waste from collection all the way to safe, sustainable disposal.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Through innovation and community involvement, we turn waste into resources, promote circular
              economy practices, and contribute to environmental conservation and public health.
            </p>

            {/* Quick belief pills */}
            <div className="flex flex-wrap gap-3">
              {["Sustainability", "Innovation", "Community", "Accountability"].map((b) => (
                <span key={b} className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. IMPACT STATS ───────────────────────────────────────────── */}
      <section ref={statsRef.ref} className="py-20 px-6 bg-gradient-to-br from-green-700 via-green-600 to-emerald-700">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-200 text-center text-sm font-semibold tracking-[0.2em] uppercase mb-12">
            Our Impact So Far
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            <StatCard value={5000} suffix="+" label="Households Served" started={statsStarted} />
            <StatCard value={3} suffix=" T+" label="Recycled Monthly" started={statsStarted} />
            <StatCard value={5} suffix="" label="Service Zones" started={statsStarted} />
            <StatCard value={98} suffix="%" label="Client Satisfaction" started={statsStarted} />
          </div>
        </div>
      </section>

      {/* ── 3. MISSION & VISION ───────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              Our Purpose
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Mission &amp; Vision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg group border border-green-100">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/ourmission.png"
                  alt="Our Mission"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="text-xs font-bold tracking-widest text-green-200 uppercase">Mission</span>
                  <h3 className="text-2xl font-extrabold text-white">Our Mission</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-base">
                  To provide reliable and sustainable waste management solutions that reduce environmental impact,
                  enhance recycling rates, and foster healthier communities across Ndagani and beyond.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg group border border-green-100">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src="/images/vision.png"
                  alt="Our Vision"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
                <div className="absolute bottom-5 left-6">
                  <span className="text-xs font-bold tracking-widest text-emerald-200 uppercase">Vision</span>
                  <h3 className="text-2xl font-extrabold text-white">Our Vision</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 leading-relaxed text-base">
                  To lead in circular economy innovation, inspiring sustainable cities through eco-smart technology,
                  responsible recycling, and community-driven environmental action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. METHODOLOGY ────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              How We Work
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Our Methodology</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">A proven 5-step process that turns waste into value — every time.</p>
          </div>

          <div className="relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-[2.75rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-emerald-300" />

            <div className="grid md:grid-cols-5 gap-8">
              {STEPS.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center group">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-black shadow-lg group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 mb-5">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-green-800 text-base mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CORE VALUES ────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-16 items-start">
            {/* Heading column */}
            <div className="lg:sticky lg:top-32">
              <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
                Core Values
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                What We <span className="text-green-600">Stand For</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                These values aren't just words on a page — they guide every collection run, every community event, and every line of code we write.
              </p>
            </div>

            {/* Values grid */}
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. TECHNOLOGY & INNOVATION ────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Powered by Innovation
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We harness AI, IoT, and smart logistics to make waste management smarter, faster, and greener.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TECH.map((t) => (
              <div
                key={t.title}
                className="group bg-gray-50 hover:bg-green-600 rounded-2xl p-7 border border-gray-100 hover:border-green-600 transition-all duration-300 cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-green-100 group-hover:bg-white/20 text-green-700 group-hover:text-white flex items-center justify-center mb-5 transition-all duration-300">
                  {t.icon}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-white text-base mb-2 transition-colors">{t.title}</h3>
                <p className="text-gray-500 group-hover:text-green-100 text-sm leading-relaxed transition-colors">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. COMMITMENT & QUALITY POLICY ───────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              Quality Policy
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Our Commitment
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              We are committed to providing{" "}
              <strong className="text-green-700">cost-effective, reliable, and high-quality environmental solutions</strong>{" "}
              that improve the cleanliness, health, and sustainability of our communities.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Our quality objectives are aligned with our corporate strategy and implemented across all operations,
              teams, and processes — with continuous improvement at the core.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Sustainability", desc: "Landfill diversion & circular economy first" },
                { label: "Safety", desc: "Rigorous health & safety standards" },
                { label: "Community", desc: "Education, clean-ups & engagement" },
              ].map((c) => (
                <div key={c.label} className="bg-white rounded-2xl p-4 border border-green-100 shadow-sm text-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="font-bold text-green-800 text-sm mb-1">{c.label}</div>
                  <div className="text-gray-500 text-xs leading-snug">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/policy.png"
              alt="Green Loop quality commitment"
              width={700}
              height={500}
              className="w-full h-[460px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 8. PARTNERSHIPS ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-green-600 uppercase mb-4 border border-green-200 bg-green-50 rounded-full px-4 py-1.5">
              Partners
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">We Collaborate With</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              A strong network of public, private, and civil society partners amplifies our environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center justify-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:border-green-200 hover:bg-green-50 transition-all duration-300 text-center group"
              >
                <span className="text-3xl">{p.icon}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-green-700 transition-colors leading-tight">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. CTA BANNER ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-white/10" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Join Us in Building a<br />
            <span className="text-green-300">Greener Ndagani</span>
          </h2>
          <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you're a resident, business, school, hospital, or potential partner — there's a place for you in the Green Loop family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/waste"
              className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-full hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-transparent text-white font-bold px-8 py-4 rounded-full border-2 border-white/40 hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhoWeAre;
