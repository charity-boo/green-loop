"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const AboutUsHero = () => {
  return (
    <section className="relative h-[620px] md:h-[680px] w-full flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/abouthero.png"
        alt="Green Loop About Us — community and environment"
        fill
        priority
        className="object-cover object-center scale-105"
      />

      {/* Gradient overlay — left-heavy for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/60 to-transparent" />
      {/* Bottom fade to white for smooth section transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 text-white px-8 md:px-16 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-green-300 text-sm font-medium mb-6 opacity-0 animate-[fadeInUp_0.6s_ease_0.1s_forwards]">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white/80">About Us</span>
        </nav>

        {/* Tag pill */}
        <div className="opacity-0 animate-[fadeInUp_0.6s_ease_0.2s_forwards]">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-green-300 uppercase bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Since 2022 — Ndagani, Kenya
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 opacity-0 animate-[fadeInUp_0.6s_ease_0.35s_forwards]">
          Our Story,<br />
          <span className="text-green-400">Our Mission</span>
        </h1>

        {/* Sub-heading */}
        <p className="text-lg md:text-xl font-medium leading-relaxed text-white/80 max-w-xl mb-10 opacity-0 animate-[fadeInUp_0.6s_ease_0.5s_forwards]">
          Discover how Green Loop is transforming waste into value and building a cleaner, healthier Ndagani — one collection at a time.
        </p>

        {/* CTA */}
        <div className="opacity-0 animate-[fadeInUp_0.6s_ease_0.65s_forwards]">
          <Link
            href="#our-story"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5"
          >
            Explore Our Story
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-2 opacity-0 animate-[fadeInUp_0.6s_ease_0.9s_forwards]">
        <span className="text-xs font-medium text-white/50 tracking-widest uppercase rotate-90 origin-center">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default AboutUsHero;
