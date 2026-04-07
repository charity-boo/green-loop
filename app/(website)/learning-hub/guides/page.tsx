"use client";

import Link from "next/link";
import { BookOpen, Recycle, Lightbulb, Building, ArrowLeft, Download, ChevronRight } from "lucide-react"; 
import { motion } from "framer-motion";

interface GuideCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
}

const GuideCard = ({ title, description, icon, link }: GuideCardProps) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50 flex flex-col"
    >
        <div className="mb-6 p-4 bg-green-50 rounded-2xl w-fit text-green-600">
            {icon}
        </div>
        <h3 className="text-2xl font-black text-green-950 mb-3">{title}</h3>
        <p className="text-green-800 font-medium leading-relaxed mb-8 flex-grow">{description}</p>
        <Link 
            href={link} 
            className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-600 hover:text-white rounded-2xl text-green-700 font-black transition-all group"
        >
            <span>Download PDF</span>
            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Link>
    </motion.div>
);

export default function RecyclingGuidesPage() {
  return (
    <div className="min-h-screen bg-white">
        {/* Header Section */}
        <section className="bg-green-50 py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <Link 
                    href="/learning-hub" 
                    className="inline-flex items-center gap-2 text-green-600 font-bold mb-8 hover:text-green-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
                </Link>
                <h1 className="text-4xl md:text-6xl font-black text-green-950 mb-6 leading-tight">
                    Essential <br/><span className="text-green-600 underline decoration-green-200">Recycling Guides</span>
                </h1>
                <p className="text-xl text-green-800 font-medium max-w-2xl mx-auto">
                    Download comprehensive, easy-to-read manuals to master sorting, 
                    minimizing contamination, and maximizing your Green Points.
                </p>
            </div>
        </section>

        {/* Guides Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <GuideCard 
                    title="Household Waste Separation Guide"
                    description="Our core manual for households in Ndagani. Learn exactly how to separate organic waste, plastics, glass, and general waste to maximize your Green Points."
                    icon={<Recycle className="w-8 h-8" />}
                    link="/docs/household-separation-guide.pdf"
                />
                <GuideCard 
                    title="Enterprise Waste Management Protocol"
                    description="High-volume waste strategies tailored for Ndagani businesses, hostels, and restaurants. Ensure compliance and build a sustainable green brand."
                    icon={<Building className="w-8 h-8" />}
                    link="/docs/enterprise-waste-protocol.pdf"
                />
                <GuideCard 
                    title="Organic Composting & Agriculture"
                    description="Turn your kitchen scraps into gold. A step-by-step guide for rural and semi-urban households on creating organic compost for farming."
                    icon={<Lightbulb className="w-8 h-8" />}
                    link="/docs/organic-composting-agriculture.pdf"
                />
                <GuideCard 
                    title="Hazardous & E-Waste Safety Manual"
                    description="Crucial instructions for the safe handling and hand-over of old batteries, broken electronics, and medical waste before Green Loop collection."
                    icon={<BookOpen className="w-8 h-8" />}
                    link="/docs/hazardous-ewaste-manual.pdf"
                />
            </div>

            <div className="mt-24 p-12 bg-green-950 rounded-[3rem] text-center text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-6">Need a physical copy?</h2>
                    <p className="text-green-200 text-lg mb-10 font-medium">
                        Visit our Ndagani collection center to pick up printed waterproof
                        guides to stick on your recycling bins.
                    </p>
                </div>
            </div>
        </section>
    </div>
  );
}
