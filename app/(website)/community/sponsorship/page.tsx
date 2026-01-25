"use client";

import Link from 'next/link';
import { DollarSign, Globe, Target } from 'lucide-react';

export default function SponsorshipPage() {
  const projects = [
    { icon: <Globe className="w-6 h-6 text-green-600" />, title: "Local Clean-Up Drives", description: "Sponsor tools, logistics, and refreshments for monthly community clean-up events." },
    { icon: <Target className="w-6 h-6 text-green-600" />, title: "School Education Kits", description: "Fund educational materials used to teach local students about recycling and circular economy." },
    { icon: <DollarSign className="w-6 h-6 text-green-600" />, title: "Collector Empowerment Fund", description: "Provide safety gear and training for informal waste collectors in the Ndagani area." },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          🤝 Sponsor a Green Loop Project
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Invest directly in tangible community and environmental projects. Your support helps fund local initiatives with measurable impact.
        </p>

        {/* --- Project Options Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {projects.map((project, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
              <div className="flex justify-center mb-4">{project.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>
        
        {/* --- CTA --- */}
        <div className="p-8 bg-white rounded-xl shadow-2xl border-t-4 border-green-600">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
                Ready to Partner?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
                Contact our partnership team for a detailed proposal tailored to your corporate social responsibility goals.
            </p>
            <Link 
                href="/contact"
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
            >
                Contact Sponsorship Team
            </Link>
        </div>
      </div>
    </div>
  );
}