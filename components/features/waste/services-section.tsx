"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// 1. DEFINE THE INTERFACE/TYPE FOR A SERVICE ITEM
interface ServiceItem {
  title: string;
  description: string;
  imageSrc: string;
  slug: string;
}

// 2. USE THE INTERFACE FOR THE SERVICES ARRAY
const services: ServiceItem[] = [
  {
    title: "Eco-Friendly Collection",
    description:
      "A smarter way to handle waste. We provide reliable, technology-driven collection services tailored to modern community needs.",
    imageSrc: "/images/smart-waste-pickup.png",
    slug: "/eco-collection-info",
  },
  {
    title: "AI-Powered Sorting",
    description:
      "Revolutionizing recycling with AI. Our systems identify materials instantly, ensuring maximum recovery and minimum landfill waste.",
    imageSrc: "/images/ai-waste-sorting.png",
    slug: "/ai-sorting-info",
  },
  {
    title: "Circular Economy",
    description:
      "Closing the loop by turning waste into value. Join a movement that rewards sustainability and protects our local environment.",
    imageSrc: "/images/community-engagement.png",
    slug: "/circular-economy-info",
  },
];

export default function ServicesSection() {
  const router = useRouter();

  const handleServiceClick = (service: ServiceItem) => {
    router.push(service.slug);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading and Explanation */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Our Core Pillars
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Green Loop is built on the intersection of technology and sustainability. We simplify waste management so you can focus on building a cleaner future.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center"
            >
              <div className="mb-8 w-full h-64 relative rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={service.imageSrc}
                  alt={service.title}
                  fill
                  className="object-cover"
                  suppressHydrationWarning
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <button
                    onClick={() => handleServiceClick(service)}
                    className="bg-white text-green-700 px-6 py-2 rounded-full font-bold shadow-lg"
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}