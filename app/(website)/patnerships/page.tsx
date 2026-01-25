"use client";

import Patnerships from "../patnerships"; // Make sure the path is correct
import Footer from "@/components/FooterComponent";

export default function PartnershipsPage() {
  return (
    <main className="bg-gray-50">
      <Patnerships />
      <Footer />
    </main>
  );
}
