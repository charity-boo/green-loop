"use client";

import React from "react";
import Image from "next/image";

const MethodologyHero = () => {
  return (
    <section className="relative bg-green-800 text-white h-[400px] md:h-[500px] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/methodology-hero.jpg" // Replace with a relevant hero image
          alt="Waste Management Methodology"
          fill
          className="object-cover object-center opacity-70"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Our Methodology
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Structured steps to transform waste into value — from collection to community engagement.  
          We focus on innovation, efficiency, and environmental impact.
        </p>
      </div>
    </section>
  );
};

export default MethodologyHero;
