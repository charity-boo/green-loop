"use client";

import MethodologyHero from "@/components/methodologyhero";
import Methodology from "../methodology";
import Footer from "@/components/FooterComponent";

export default function MethodologyPage() {
  return (
    <main className="bg-gray-50">
      <MethodologyHero />
      <Methodology />
      <Footer />
    </main>
  );
}
