import Hero from "@/components/Heroslider";
import ServicesSection from "@/components/ServicesSection";
import CombinedWastePage from "@/components/CombinedWastePage";
import AIHeroSection from "@/components/AIHeroSection"




export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Hero />
      <ServicesSection />
      <CombinedWastePage />
      <AIHeroSection />

    </main>
  );
}
