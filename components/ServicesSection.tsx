"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    title: "Smart Waste Pickup",
    description:
      "Easily schedule waste collection from your home or business using our digital platform — no more missed pickups.",
    imageSrc: "/images/smart-waste-pickup.png",
    slug: "/schedule-pickup", 
  },
  {
    title: "AI Waste Sorting",
    description:
      "Our system uses smart technology to classify waste into recyclables, organics, and non-recyclables efficiently.",
    imageSrc: "/images/ai-waste-sorting.png",
    slug: "/ai-sorting-info",
  },
  {
    title: "Community Engagement",
    description:
      "We empower students, collectors, and communities to take part in local clean-up and recycling initiatives.",
    imageSrc: "/images/community-engagement.png",
    slug: "/community-projects",
  },
  {
    title: "Recycling Rewards Program",
    description:
      "Earn Green Points each time you recycle correctly and redeem them for discounts or community benefits.",
    imageSrc: "/images/reward program.png",
    slug: "/rewards-program",
  },
];

export default function ServicesSection() {
  const router = useRouter();
  // DUMMY STATE: Replace with your actual authentication context/hook
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Handles the click on any service card.
   * Redirects to Login/Register if the user is not logged in.
   * @param {ServiceItem} service - The service object that was clicked.
   */
  // 3. APPLY THE INTERFACE TO THE FUNCTION PARAMETER
  const handleServiceClick = (service: ServiceItem) => {
    if (service.title === "Smart Waste Pickup") {
      if (isLoggedIn) {
        // User is logged in, navigate to the service page
        router.push(service.slug); 
      } else {
        // User is NOT logged in, redirect to the login/register page
        router.push(`/auth/login?redirect=${service.slug}`);
      }
    } else {
      // For other services, you might navigate directly or handle them differently
      router.push(service.slug); 
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading and Explanation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What We Do
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            At Green Loop, we provide innovative waste management solutions that make recycling simple, efficient, and rewarding for homes, businesses, and communities. Our goal is to empower everyone to take part in a cleaner, greener world.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => handleServiceClick(service)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 flex flex-col items-center text-center cursor-pointer border-none"
            >
              <div className="mb-4 w-full h-48 relative rounded-xl overflow-hidden">
                <Image
                  src={service.imageSrc}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}