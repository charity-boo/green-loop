"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        id: 1,
        question: "How do I schedule my first Smart Waste Pickup?",
        answer: "To schedule a pickup, you must first register or log in to your account. Navigate to the 'Schedule Pickup' section in your dashboard, select your waste type and desired date, and confirm your request. Residential services require a logged-in account for verification.",
    },
    {
        id: 2,
        question: "What items are considered 'Hazardous Waste'?",
        answer: "Hazardous waste includes batteries, electronics (e-waste), fluorescent light bulbs, and certain paints or chemicals. These items should NEVER be placed in standard recycling or general waste bins. Please check our Waste Classification Guide for local drop-off points.",
    },
    {
        id: 3,
        question: "How can I earn Green Points through the Rewards Program?",
        answer: "Green Points are primarily earned by scheduling and successfully completing Smart Pickups. You earn bonus points for accurate sorting (verified by our AI system) and participating in community challenges or drives.",
    },
    {
        id: 4,
        question: "What is the difference between Commercial and Industrial services?",
        answer: "Commercial services (SMEs, Schools, Hospitals) generally handle moderate volumes of municipal and non-hazardous specialized waste. Industrial services handle high-volume, complex waste streams (e.g., manufacturing byproducts, construction debris, heavy metals) requiring strict environmental compliance.",
    },
    {
        id: 5,
        question: "Why did I get a notification about sorting contamination?",
        answer: "Our AI sorting technology flagged an item in your bin that did not belong in that waste stream (e.g., food waste in a recycling bin). This notification is educational. Repeated contamination may affect your eligibility for bonus Green Points.",
    },
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className="border-b border-gray-200">
        <button
            className="flex justify-between items-center w-full py-4 text-left font-semibold text-lg text-gray-800 hover:text-green-700 transition"
            onClick={onClick}
            // FIX: Convert boolean 'isOpen' to string 'true'/'false' for ARIA compliance
            aria-expanded={isOpen ? 'true' : 'false'} 
        >
            {question}
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : 'rotate-0'}`} />
        </button>
        {isOpen && (
            <div className="pb-4 text-gray-600 leading-relaxed animate-in slide-in-from-top-1 fade-in duration-300">
                <p>{answer}</p>
            </div>
        )}
    </div>
);


export default function FAQsPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-green-800 mb-2 text-center">
                    ❓ Frequently Asked Questions
                </h1>
                <p className="text-lg text-gray-600 mb-10 text-center max-w-2xl mx-auto">
                    Find quick answers to the most common questions about our services, technology, and compliance standards.
                </p>

                {/* --- Accordion List --- */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
                    {faqs.map((faq) => (
                        <AccordionItem
                            key={faq.id}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openId === faq.id}
                            onClick={() => handleToggle(faq.id)}
                        />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-md text-gray-700 mb-4">
                        Can't find your answer? 
                    </p>
                    <Link 
                        href="/contact"
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition shadow-lg"
                    >
                        Contact Our Support Team
                    </Link>
                </div>
            </div>
        </div>
    );
}