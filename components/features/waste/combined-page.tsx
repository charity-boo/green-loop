"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Building2, Factory } from "lucide-react";
 
import Image from "next/image"; 
import { useRouter } from "next/navigation"; 

// --- TYPE DEFINITIONS ---
type CardType = {
  title: string;
  description: string;
  learnMoreLink: string;
  imageSrc: string;
};

// --- DATA ARRAYS (FINAL) ---
const serviceSegments = [
  { id: "residential", name: "Residential", icon: <Home className="w-5 h-5 mr-2" suppressHydrationWarning /> },
  { id: "commercial", name: "Commercial & SME", icon: <Building2 className="w-5 h-5 mr-2" suppressHydrationWarning /> },
  { id: "industrial", name: "Industrial", icon: <Factory className="w-5 h-5 mr-2" suppressHydrationWarning /> },
];

const residentialCards: CardType[] = [
  {
    title: "Hostels / Student Housing",
    imageSrc: "/images/hostels.png",
    description:
      "Specialized collection service for hostels, dormitories, or shared student accommodation. Ensures consistent pickup and eco-friendly disposal.",
    learnMoreLink: "/waste/residential/hostels",
  },
  {
    title: "Apartments / Staff Housing",
    imageSrc: "/images/apartment.png",
    description:
      "Dedicated service for apartment complexes and staff housing units. Flexible pickup schedules to handle mixed residential volumes.",
    learnMoreLink: "/waste/residential/apartments",
  },
  {
    title: "Private Homes",
    imageSrc: "/images/private-homes.png",
    description:
    "Standard residential service for single-family homes. Includes scheduled and on-demand options tailored to your household's needs.",
    learnMoreLink: "/waste/residential/private-homes",
  },
];

const commercialSmeCards: CardType[] = [
  {
    title: "Small & Medium Enterprises",
    imageSrc: "/images/commercial.png", 
    description:
      "Tailored solutions for SMEs producing moderate waste volumes. Supports offices, institutions, and restaurants with scheduled pickups.",
    learnMoreLink: "/waste/commercial/sme",
  },
  {
    title: "Hospitals & Clinics",
    imageSrc: "/images/hospital.png", 
    description:
      "Specialized collection and disposal for clinical and non-clinical medical waste, ensuring strict regulatory compliance.",
    learnMoreLink: "/waste/commercial/hospitals",
  },
  {
    title: "Schools & Universities", 
    imageSrc: "/images/school.png", 
    description:
      "Dedicated programs for educational campuses, focusing on paper recycling, composting, and student engagement initiatives.",
    learnMoreLink: "/waste/commercial/schools",
  },
];

const industrialCards: CardType[] = [
  {
    title: "Heavy Manufacturing Plants",
    imageSrc: "/images/industrial.png", 
    description:
      "High-volume, complex waste solutions tailored for large-scale production facilities, including scrap metal and chemical waste compliance.",
    learnMoreLink: "/waste/industrial/heavy-manufacturing",
  },
  {
    title: "Construction & Demolition",
    imageSrc: "/images/construction.png", 
    description:
      "Management of concrete, timber, metals, and debris from construction and demolition sites, focusing on material recovery.",
    learnMoreLink: "/waste/industrial/construction-waste",
  },
  {
    title: "Industrial Parks & Warehouses",
    imageSrc: "/images/warehouse.png", 
    description:
      "Comprehensive waste stream management for large parks, warehouses, and logistics centers, optimizing packaging and pallet recycling.",
    learnMoreLink: "/waste/industrial/warehouses",
  },
];


// --- HeaderComponent ---
const HeaderComponent = () => {
  return (
    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-emerald-950 dark:to-green-900 p-6 md:p-12 lg:p-16 overflow-hidden transition-colors">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 400 400"
          suppressHydrationWarning
        >
          <defs>
            <pattern
              id="ecoPattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M40 10 C25 30, 55 50, 40 70 M10 40 C30 25, 50 55, 70 40"
                stroke="currentColor"
                className="text-green-600 dark:text-green-400"
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecoPattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-6 lg:mb-0">
          <h1 className="text-4xl md:text-6xl font-extrabold text-green-900 dark:text-green-400 leading-tight drop-shadow-sm transition-colors">
            Apply for Waste Management
          </h1>
        </div>

        <div className="lg:w-1/2 lg:pl-12">
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-xl transition-colors">
            Applying for waste management services has never been easier. 
            Green Loop connects residents, businesses, and institutions with 
            efficient waste collection and recycling programs. Register today 
            to join our mission for a cleaner, greener, and more sustainable Ndagani.
          </p>

          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 max-w-xl mt-3 transition-colors">
            For each category, you can specify your requirements, schedule routine or on-demand pickups, 
            and access tailored waste management solutions.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- WasteCardsGrid Component ---
const WasteCardsGrid = ({ cards }: { cards: CardType[] }) => {
  const router = useRouter();

  const handleLearnMore = (link: string) => {
    router.push(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition duration-300 border border-transparent dark:border-border"
        >
          <div className="relative h-40 md:h-44 bg-green-50 dark:bg-green-900/20 flex items-center justify-center transition-colors">
            <Image
              src={card.imageSrc}
              alt={card.title}
              fill
              className="object-cover"
              suppressHydrationWarning
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-700/40 to-transparent"></div>
            <span className="relative z-10 text-green-900 dark:text-green-100 text-sm font-medium bg-white/70 dark:bg-black/50 px-3 py-1 rounded backdrop-blur-sm transition-colors">
              {card.title}
            </span>
          </div>
          <div className="p-4 md:p-6 flex flex-col flex-grow">
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow transition-colors">{card.description}</p>
            
            <button
              onClick={() => handleLearnMore(card.learnMoreLink)}
              className="flex items-center justify-center px-3 py-2 mt-auto border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 transition shadow-md"
            >
              Learn More
              <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" suppressHydrationWarning>
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};


// --- WasteManagementSection Component ---
const WasteManagementSection = () => {
  const [activeSegment, setActiveSegment] = useState("residential");

  // Helper function to determine which cards to display
  const renderCards = () => {
    switch (activeSegment) {
      case "residential":
        return <WasteCardsGrid cards={residentialCards} />;
      case "commercial":
        return <WasteCardsGrid cards={commercialSmeCards} />;
      case "industrial":
        return <WasteCardsGrid cards={industrialCards} />;
      default:
        return null;
    }
  };


  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20 transition-colors">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-border mb-8 md:mb-10 transition-colors">
        <nav className="-mb-px flex flex-wrap gap-4 sm:space-x-6 justify-center" aria-label="Segments">
          {serviceSegments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => setActiveSegment(segment.id)}
              className={`flex items-center whitespace-nowrap py-2 md:py-3 px-3 md:px-4 border-b-2 text-lg font-semibold transition duration-200 ${
                activeSegment === segment.id
                  ? "border-green-700 text-green-800 dark:text-green-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-slate-700 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {segment.icon} {segment.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {renderCards()}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

// --- Combined Component ---
const CombinedWastePage = () => {
  return (
    <>
      <HeaderComponent />
      <WasteManagementSection />
    </>
  );
};

export default CombinedWastePage;