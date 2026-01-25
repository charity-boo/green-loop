"use client";

import Link from 'next/link';
import { DollarSign, Globe, Target } from 'lucide-react';

interface PartnerCategoryProps {
    title: string;
    description: string;
}

export default function PartnershipsPage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold text-green-800 mb-2">
          🤝 Strategic Partnerships
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          We collaborate with technology providers, local governments, and NGOs to scale our impact and build a truly circular economy.
        </p>
        
        {/* --- Partner Categories --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <PartnerCategory 
                title="Technology & Innovation"
                description="Seeking firms specializing in advanced sensor technology, computer vision, and AI modeling for waste recognition."
            />
            <PartnerCategory 
                title="Logistics & Fleet Management"
                description="Partnerships with vehicle maintenance, route optimization software, and sustainable fuel suppliers."
            />
            <PartnerCategory 
                title="NGOs & Advocacy"
                description="Collaborating with environmental and community organizations to promote education and recycling policy."
            />
            <PartnerCategory 
                title="Recycling & Processing"
                description="Working with certified recycling facilities that handle specialized streams like plastics, glass, and metals efficiently."
            />
        </div>

        <div className="mt-12 p-8 bg-white rounded-xl shadow-2xl">
            <p className="text-xl font-bold text-green-700 mb-4">
                Let's Build the Future Together
            </p>
            <a 
                href="/contact" 
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-md"
            >
                Start a Partnership Inquiry
            </a>
        </div>
      </div>
    </div>
  );
}

const PartnerCategory = ({ title, description }: PartnerCategoryProps) => (
    <div className="p-6 bg-white rounded-xl shadow-md border-b-4 border-green-500">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);