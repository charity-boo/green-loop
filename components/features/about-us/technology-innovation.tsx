"use client";

import Image from "next/image";

const TechnologyInnovationPage = () => {
  return (
    <main className="space-y-24 p-8 bg-gray-50">

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative">
          <Image
            src="/images/technology-hero.jpg" // Replace with your image
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

      {/* Key Innovations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "AI-Powered Waste Sorting", icon: "/icons/ai.png" },
          { title: "Smart Collection Systems", icon: "/icons/smart-collection.png" },
          { title: "Data-Driven Insights", icon: "/icons/data.png" },
          { title: "Recycling Innovation", icon: "/icons/recycle.png" },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition-transform">
            <Image src={item.icon} alt={item.title} width={60} height={60} className="mx-auto mb-3" />
            <h3 className="text-green-800 font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-sm mt-2">
              Short description explaining the innovation and its impact.
            </p>
          </div>
        ))}
      </div>

      {/* Innovation Approach / Corporate Strategy */}
      <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto border-t border-gray-200 pt-12 space-y-8 lg:space-y-0 lg:space-x-12">
        <div className="lg:w-1/3 text-green-800 font-bold text-2xl text-left">
          Our Innovation Approach
        </div>
        <div className="lg:w-2/3 text-gray-700 leading-relaxed text-left">
          Innovation is at the core of Green Loop&apos;s strategy. We continuously integrate AI, IoT, and smart logistics to optimize waste management and promote sustainability. By leveraging technology, we enhance efficiency, reduce environmental impact, and empower communities with actionable insights.
        </div>
      </div>

      {/* Footer */}

    </main>
  );
};

export default TechnologyInnovationPage;
