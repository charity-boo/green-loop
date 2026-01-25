"use client";

import Image from "next/image";

const partnerships = [
  {
    title: "Government & Local Authorities",
    description:
      "We collaborate with Ndagani County and municipal authorities to ensure organized waste collection, safe disposal, and regulatory compliance.",
  },
  {
    title: "Community Organizations",
    description:
      "We partner with schools, NGOs, and local groups to run awareness campaigns, environmental education, and community clean-up drives.",
  },
  {
    title: "Corporate & Businesses",
    description:
      "Local companies collaborate with Green Loop to implement sustainable waste management practices and sponsor eco-friendly initiatives.",
  },
  {
    title: "Technology & Innovation",
    description:
      "We work with tech providers and research institutions to enhance smart tracking, AI-powered waste sorting, and recycling methods.",
  },
  {
    title: "International & Environmental NGOs",
    description:
      "We engage with global organizations to bring knowledge, support, and sustainable practices to our community projects.",
  },
];

export default function PatnershipsPage() {
  return (
    <main className="bg-gray-50">
      {/* 1️⃣ Hero Section */}
      <div className="relative bg-green-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Partnerships
          </h1>
          <p className="text-lg md:text-xl">
            Collaborating for a cleaner, greener Ndagani
          </p>
          <div className="mt-10">
            <Image
              src="/images/partnerships-hero.jpg" // replace with your hero image path
              alt="Patnerships"
              width={900}
              height={400}
              className="mx-auto rounded-2xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2️⃣ Partnership Types (Left heading, Right description) */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
        {partnerships.map((item, index) => (
          <div
            key={index}
            className={`grid md:grid-cols-2 gap-10 items-center ${
              index % 2 === 0 ? "" : "md:flex-row-reverse"
            }`}
          >
            {/* Left or Right Title */}
            <div className="text-left">
              <h2 className="text-3xl font-bold text-green-800 mb-4">
                {item.title}
              </h2>
            </div>
            {/* Opposite Side Description */}
            <div>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3️⃣ Impact Highlights */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
          Our Partnership Impact
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="text-green-700 font-semibold mb-2">Community Engagement</h3>
            <p className="text-gray-600 text-sm">
              Conducting regular clean-up drives, environmental workshops, and educational campaigns.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="text-green-700 font-semibold mb-2">Recycling Efficiency</h3>
            <p className="text-gray-600 text-sm">
              Improving recycling rates and reducing landfill waste through innovative programs.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 text-center">
            <h3 className="text-green-700 font-semibold mb-2">Technology Integration</h3>
            <p className="text-gray-600 text-sm">
              Implementing smart tracking, AI sorting, and other tech-driven waste management solutions.
            </p>
          </div>
        </div>
      </div>

      {/* 4️⃣ Call to Action */}
      <div className="bg-green-800 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Become a Green Loop Partner</h2>
        <p className="mb-8">
          Join us in transforming waste management and making Ndagani a cleaner, healthier community.
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-green-900 font-bold py-3 px-6 rounded-full transition">
          Join Us
        </button>
      </div>
    </main>
  );
}
