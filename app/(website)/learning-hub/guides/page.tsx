"use client";

import Link from "next/link";
// Ensure all necessary Lucide icons are imported
import { BookOpen, Recycle, Lightbulb, Building } from "lucide-react"; 

interface GuideCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
}

const GuideCard = ({ title, description, icon, link }: GuideCardProps) => (
    <Link href={link} className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-green-500 hover:border-green-700">
        <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full text-green-700">
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    </Link>
);


export default function RecyclingGuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-green-800 mb-2">
                📚 Essential Recycling Guides
            </h1>
            <p className="text-lg text-gray-600 mb-10">
                Download comprehensive guides to master sorting, minimizing contamination, and maximizing your Green Points.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GuideCard 
                    title="Residential Sorting Manual"
                    description="Step-by-step instructions for separating household waste for curb-side pickup."
                    icon={<Recycle className="w-6 h-6" />}
                    link="#manual-pdf"
                />
                <GuideCard 
                    title="Commercial Best Practices"
                    description="Guidelines for businesses on high-volume cardboard, packaging, and food waste management."
                    icon={<Building className="w-6 h-6" />}
                    link="#commercial-guide"
                />
                <GuideCard 
                    title="Composting at Home"
                    description="A beginner's guide to organic waste diversion and creating healthy soil."
                    icon={<Lightbulb className="w-6 h-6" />}
                    link="#compost-guide"
                />
                <GuideCard 
                    title="E-Waste & Hazardous Items"
                    description="Safe disposal points and handling instructions for electronics and batteries."
                    icon={<BookOpen className="w-6 h-6" />}
                    link="#ewaste-guide"
                />
            </div>

            <div className="mt-12 text-center">
                <Link 
                    href="/learning-hub/videos"
                    className="text-green-600 font-semibold hover:underline"
                >
                    Prefer video tutorials? View our Video Library →
                </Link>
            </div>
        </div>
    </div>
  );
}