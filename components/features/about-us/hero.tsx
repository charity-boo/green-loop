"use client";

import React from "react";
import Image from "next/image";

const AboutUsHero = () => {
  return (
    <section className="relative h-[5000px] md:h-[600px] w-full flex items-center justify-start">
      {/* Background Image */}
      <Image
        src="/images/abouthero.png" // Replace with your image path
        alt="About Us Hero"
        fill
        className="object-cover object-center"
      />

      {/* Overlay for slight dimming */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero Text (Left Aligned) */}
      <div className="relative z-10 text-white px-6 md:px-16 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          About Us
        </h1>
        <p className="text-lg md:text-2xl font-medium leading-relaxed">
          Discover our mission, vision, and commitment to transforming waste into valuable
          resources for a cleaner, greener Ndagani.
        </p>
      </div>
    </section>
  );
};

export default AboutUsHero;
