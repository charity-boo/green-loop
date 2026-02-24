import Hero from "@/components/features/hero/slider";
import ServicesSection from "@/components/features/waste/services-section";
import CombinedWastePage from "@/components/features/waste/combined-page";
import FooterComponent from "@/components/layout/footer"




export default function Home() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Hero />
      <ServicesSection />
      <CombinedWastePage />
      <FooterComponent />

    </main>
  );
}
