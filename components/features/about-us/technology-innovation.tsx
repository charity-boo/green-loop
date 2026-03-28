"use client";

import Image from "next/image";

import { BrainCircuit, Truck, BarChart3, RefreshCw } from "lucide-react";

export const TechnologyInnovationContent = () => {
  return (
    <>
      {/* Key Innovations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16">
        {[
          { title: "AI-Powered Waste Sorting", icon: <BrainCircuit className="w-12 h-12 text-green-600" /> },
          { title: "Smart Collection Systems", icon: <Truck className="w-12 h-12 text-green-600" /> },
          { title: "Data-Driven Insights", icon: <BarChart3 className="w-12 h-12 text-green-600" /> },
          { title: "Recycling Innovation", icon: <RefreshCw className="w-12 h-12 text-green-600" /> },
        ].map((item, index) => (
          <div key={index} className="bg-card shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <div className="flex justify-center mb-3">
              {item.icon}
            </div>
            <h3 className="text-green-800 font-semibold">{item.title}</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Advanced systems designed to enhance efficiency and environmental impact.
            </p>
          </div>
        ))}
      </div>

      {/* Innovation Approach / Corporate Strategy */}
      <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-0 lg:space-x-12">
        <div className="lg:w-1/3 text-green-800 font-bold text-2xl text-left">
          Our Innovation Approach
        </div>
        <div className="lg:w-2/3 text-gray-700 leading-relaxed text-left">
          Innovation is at the core of Green Loop&apos;s strategy. We continuously integrate AI, IoT, and smart logistics to optimize waste management and promote sustainability. By leveraging technology, we enhance efficiency, reduce environmental impact, and empower communities with actionable insights.
        </div>
      </div>
    </>
  );
};

const TechnologyInnovationPage = () => {
  return (
    <main className="space-y-24 p-8 bg-muted/50">

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <Image
            src="/images/technology-hero.jpg"
            alt="Technology & Innovation"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold text-green-800 mb-4">Technology & Innovation</h2>
          <p className="text-gray-700 leading-relaxed">
            Green Loop leverages modern technologies and innovative approaches to make waste management smarter and more sustainable. Our solutions include AI-powered waste sorting, smart collection tracking, and data-driven environmental insights to serve communities efficiently.
          </p>
        </div>
      </div>

      <TechnologyInnovationContent />

      {/* Footer */}

    </main>
  );
};

export default TechnologyInnovationPage;
