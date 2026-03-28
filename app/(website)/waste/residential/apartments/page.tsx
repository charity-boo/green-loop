'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResidentView } from "@/components/features/waste/apartments/resident-view";
import { ManagementView } from "@/components/features/waste/apartments/management-view";
import { Home, Building, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ApartmentsWastePage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Back Button */}
      <div className="max-w-5xl mx-auto px-4 pt-8 sm:px-8">
        <Link href="/services">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Services
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1 text-xs uppercase tracking-widest font-bold">
            Apartment Solutions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Smart Waste Logistics for <span className="text-emerald-600">Multi-Unit Living</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Centralized collection, real-time fill monitoring, and seamless property management for apartment complexes and staff housing.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 shadow-lg shadow-emerald-200">
              Check Schedule
            </Button>
            <Button size="lg" variant="outline" className="bg-white border-slate-200 font-semibold px-8">
              Property Onboarding
            </Button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Content Portal */}
      <main className="max-w-5xl mx-auto pb-24 px-4 sm:px-8">
        <Tabs defaultValue="residents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 h-16 p-1.5 bg-white shadow-sm border border-slate-100 rounded-2xl">
            <TabsTrigger value="residents" className="rounded-xl gap-2.5 text-base font-semibold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Home className="h-4 w-4" /> For Residents
            </TabsTrigger>
            <TabsTrigger value="managers" className="rounded-xl gap-2.5 text-base font-semibold transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white">
              <Building className="h-4 w-4" /> For Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="residents" className="animate-in fade-in slide-in-from-bottom-3 duration-700 outline-none">
            <ResidentView />
          </TabsContent>
          
          <TabsContent value="managers" className="animate-in fade-in slide-in-from-bottom-3 duration-700 outline-none">
            <ManagementView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Helper for the hero badge
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
