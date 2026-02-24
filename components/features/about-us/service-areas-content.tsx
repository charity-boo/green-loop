"use client";

import { MapPin } from "lucide-react";

const serviceAreas = [
  {
    name: "Ndagani",
    description:
      "Green Loop’s central hub and pilot area. We focus on household waste collection, recycling initiatives, and awareness campaigns in partnership with Chuka University.",
  },
  {
    name: "Slaughter",
    description:
      "This zone specializes in organic waste processing and proper disposal. Our team ensures animal waste is managed responsibly to reduce health hazards.",
  },
  {
    name: "Muongoni Lowland",
    description:
      "Known for its vibrant community, we promote clean-up drives and encourage proper sorting of plastics and organic materials to protect the lowland ecosystem.",
  },
  {
    name: "Tumaini",
    description:
      "Our newest coverage area. Green Loop helps residents adopt responsible waste handling practices through scheduled pickups and education programs.",
  },
];

export default function ServiceAreas() {
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-8">
          Our Service Areas
        </h2>
        <p className="text-gray-600 mb-12">
          Green Loop currently operates across Ndagani, Slaughter, Muongoni Lowland, and Tumaini — bringing smarter, cleaner waste management to every neighborhood.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <MapPin className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {area.name}
              </h3>
              <p className="text-gray-600 text-sm">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
