"use client";

import Image from "next/image";

import { Truck, Layers, Factory, Users, BarChart3 } from "lucide-react";

const Methodology = () => {
  const steps = [
    {
      title: "Collection",
      description:
        "Waste is collected from households, businesses, and community points across Ndagani, Slaughter, Muongoni, Lowland, and Tumaini.",
      icon: <Truck className="w-10 h-10 text-green-600" />,
    },
    {
      title: "Sorting",
      description:
        "Waste is sorted using smart AI guidance into recyclables, organic, and hazardous materials for effective processing.",
      icon: <Layers className="w-10 h-10 text-green-600" />,
    },
    {
      title: "Processing",
      description:
        "Organic waste is composted, recyclables are prepared for reuse, and hazardous materials are safely handled.",
      icon: <Factory className="w-10 h-10 text-green-600" />,
    },
    {
      title: "Community Awareness",
      description:
        "We conduct campaigns and workshops to educate communities about sustainable waste practices.",
      icon: <Users className="w-10 h-10 text-green-600" />,
    },
    {
      title: "Reporting & Feedback",
      description:
        "Users receive notifications, reports, and tips to track their contribution and environmental impact.",
      icon: <BarChart3 className="w-10 h-10 text-green-600" />,
    },
  ];

  return (
    <section className="py-16 px-8 bg-muted/50 space-y-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-green-800 mb-2">Methodology</h2>
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Turning Waste into Value — Step by Step
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-card shadow-lg rounded-2xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 bg-green-50 rounded-full">
              {step.icon}
            </div>
            <h3 className="text-2xl font-semibold text-green-800 mb-2">{step.title}</h3>
            <p className="text-gray-700 text-base leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Methodology;
