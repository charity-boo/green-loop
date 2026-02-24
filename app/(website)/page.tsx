import Hero from "@/components/features/hero/slider";
import ServicesSection from "@/components/features/waste/services-section";
import CombinedWastePage from "@/components/features/waste/combined-page";
import SustainabilitySection from "@/components/features/waste/sustainability-section";

export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Hero />
      <ServicesSection />
      <CombinedWastePage />
      <SustainabilitySection />
    </main>
  );
}
