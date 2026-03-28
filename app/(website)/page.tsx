import Hero from "@/components/features/hero/slider";
import ServicesSection from "@/components/features/waste/services-section";
import CombinedWastePage from "@/components/features/waste/combined-page";
import SustainabilitySection from "@/components/features/waste/sustainability-section";

export default function Home() {
  return (
    <main className="bg-background min-h-screen transition-colors">
      <Hero />
      <ServicesSection />
      <CombinedWastePage />
      <SustainabilitySection />
    </main>
  );
}
