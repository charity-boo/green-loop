"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation"; // 1. Import useRouter

// Define the shape for a slide item
interface Slide {
  type: "video" | "image";
  src: string;
  title: string;
  desc: string;
  cta: { label: string; link: string };
  color: string;
}

export default function HeroSlider() {
  const router = useRouter(); // 2. Initialize router
  
  // DUMMY AUTH STATE: Replace with your actual authentication context/hook
  const [isLoggedIn] = useState(false); 
  
  const slides: Slide[] = [
    // ✅ 1️⃣ Green Loop Waste Management
    {
      type: "video",
      src: "/videos/hero.mp4",
      title: "Green Loop Waste Management",
      desc: "Empowering communities with smart, eco-friendly waste solutions for a cleaner and greener Ndagani. Together, we close the loop for a sustainable future.",
      cta: { label: "Learn More", link: "/about-us" },
      color: "from-green-700 to-green-500",
    },

    // ✅ 2️⃣ Report Waste Issues (Link: /report)
    {
      type: "image",
      src: "/images/report waste.png",
      title: "Report Waste Issues",
      desc: "See illegal dumping, littering, or overflowing bins? Help us act fast — report it instantly through our online platform.",
      cta: { label: "Report Now", link: "/report" },
      color: "from-green-700 to-green-500",
    },

    // ✅ 3️⃣ Online Services
    {
      type: "image",
      src: "/images/online services.png",
      title: "Online Services",
      desc: "Access all your Green Loop services online — schedule pickups, track collections, and view sustainability reports in one place.",
      cta: { label: "Access Services", link: "/services" },
      color: "from-green-700 to-green-500",
    },

    // ✅ 4️⃣ Sustainability & Community
    {
      type: "image",
      src: "/images/sustainablity.png",
      title: "Sustainability & Community",
      desc: "We promote recycling, education, and community-driven green projects that help protect the planet for future generations.",
      cta: { label: "Join Us", link: "/community" },
      color: "from-emerald-700 to-green-500",
    },
  ];

  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  /**
   * Handles the click on a CTA button.
   * Forces redirect to login if the link is /report and the user is not logged in.
   * @param link The target URL.
   */
  const handleCtaClick = (link: string) => {
    if (link === "/report" && !isLoggedIn) {
      // 3. Logic: If user is not logged in and clicking 'Report', redirect to login
      router.push(`/auth/login?redirect=${link}`);
    } else {
      // 4. Otherwise, navigate directly
      router.push(link);
    }
  };


  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-0"
          }`}
        >
          {/* --- Background Media --- */}
          {slide.type === "video" ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover z-0"
              src={slide.src}
            />
          ) : (
            <div className="absolute inset-0">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                suppressHydrationWarning
              />
            </div>
          )}

          {/* --- Overlay --- */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>

          {/* --- Text & CTA --- */}
          <div className="absolute bottom-20 left-10 z-20 text-left text-white max-w-lg space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-base md:text-lg text-gray-200 leading-relaxed">
              {slide.desc}
            </p>
            {slide.cta && (
              // Use a button and the handler instead of the Link component for the conditional redirect
              <button
                onClick={() => handleCtaClick(slide.cta.link)}
                className="inline-block px-8 py-3 text-base md:text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-300 shadow-lg transform hover:scale-105"
              >
                {slide.cta.label}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* --- Navigation Bar --- */}
      <div className="absolute bottom-0 left-0 w-full z-40 bg-card/10 backdrop-blur-sm shadow-xl">
        <div className="flex justify-center md:justify-start overflow-x-auto whitespace-nowrap px-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative p-4 mx-2 md:mx-4 text-sm md:text-base font-semibold transition-all duration-300 ease-in-out ${
                index === current
                  ? "text-white opacity-100"
                  : "text-gray-300 opacity-70 hover:opacity-100"
              }`}
              aria-label={`Go to ${slide.title} slide`}
            >
              <span className="relative z-10">{slide.title}</span>
              {index === current && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-green-400 rounded-t-sm animate-fade-in-up" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}