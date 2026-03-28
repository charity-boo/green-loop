import type { Metadata } from "next";
import AboutUsHero from "@/components/features/about-us/hero";
import WhoWeAre from "@/components/features/about-us/who-we-are";
import ServiceAreas from "@/components/features/about-us/service-areas-content";
import SafetyAndCompliance from "@/components/features/about-us/safety-compliance";

export const metadata: Metadata = {
  title: "About Us | Green Loop — Sustainable Waste Management in Ndagani",
  description:
    "Learn about Green Loop's mission, vision, core values, and methodology for transforming waste into value across Ndagani, Kenya.",
};

export default function AboutUsPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <AboutUsHero />

      {/* 
          1. Core Story (Who We Are, Impact, Mission/Vision, Methodology, Values, Tech, Quality, Partners)
          This component is comprehensive and serves as the backbone of the About Us narrative.
      */}
      <div id="who-we-are" className="scroll-mt-20">
        <div id="our-story">
          <WhoWeAre />
        </div>
      </div>

      {/* 2. Service Areas (Interactive Map - not covered in WhoWeAre) */}
      <div id="service-areas" className="scroll-mt-20">
        <ServiceAreas />
      </div>

      {/* 3. Detailed Safety & Compliance (Expanding on the Quality Policy) */}
      <div id="safety" className="bg-muted/30 pb-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Detailed Safety & Compliance</h2>
          <p className="text-gray-700 text-lg max-w-3xl mx-auto">
            Our commitment to the highest standards of safety for our team and your community.
          </p>
        </div>
        <SafetyAndCompliance />
      </div>
    </main>
  );
}
