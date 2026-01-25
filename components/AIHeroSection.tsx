"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AIHeroSection = () => {
  return (
    <section className="relative bg-green-700 overflow-hidden py-12 md:py-16 lg:py-20 text-white">
      
      {/* Animated Background Pattern */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="grid grid-cols-8 h-full w-full">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className={`${i % 2 === 0 ? "border-r border-b border-green-900/20" : ""} bg-green-800/20`}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 sm:px-8 lg:px-12">
        
        {/* LEFT: Text Section */}
        <motion.div
          className="lg:w-2/3 text-center lg:text-left mb-6 lg:mb-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
            Upgrade Waste Management with <span className="text-yellow-300">AI</span>
          </h1>

          <p className="text-lg md:text-xl mb-3 max-w-2xl mx-auto lg:mx-0">
            Green Loop leverages <strong>artificial intelligence</strong> to optimize waste collection,
            recycling, and sustainability. Smarter routes, faster pickups, and cleaner communities — all powered by AI.
          </p>

          <a
            href="#learn-more-ai"
            className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-md shadow-lg text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-400/40 transition-all duration-300"
          >
            Learn More
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 
                6a1 1 0 010 1.414l-6 6a1 1 0 
                01-1.414-1.414L14.586 11H3a1 1 0 
                110-2h11.586l-4.293-4.293a1 1 0 
                010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </motion.div>

        {/* RIGHT: Illustration Section */}
        <motion.div
          className="relative lg:w-1/3 flex justify-center items-center h-64 md:h-80 lg:h-96"
          initial={{ opacity: 0, rotateY: 90 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Subtle Glow */}
          <div className="absolute inset-x-0 bottom-0 h-4/5 bg-yellow-400 opacity-40 transform skew-x-12 -rotate-6 scale-x-150 blur-2xl"></div>

          {/* AI Illustration */}
          <div className="relative z-20 w-48 h-full flex items-center justify-center">
            <Image
              src="/images/AI-Recycling.png" 
              alt="AI-Recycling"
              width={300}
              height={500}
              className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIHeroSection;
