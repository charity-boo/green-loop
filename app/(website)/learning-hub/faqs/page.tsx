"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowLeft, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

const faqs: FAQItem[] = [
    {
        id: 1,
        category: "Account",
        question: "How do I schedule my first Smart Waste Pickup?",
        answer: "To schedule a pickup, you must first register or log in to your account. Navigate to the 'Schedule Pickup' section in your dashboard, select your waste type and desired date, and confirm your request. Residential services require a logged-in account for verification.",
    },
    {
        id: 2,
        category: "Recycling",
        question: "What items are considered 'Hazardous Waste'?",
        answer: "Hazardous waste includes batteries, electronics (e-waste), fluorescent light bulbs, and certain paints or chemicals. These items should NEVER be placed in standard recycling or general waste bins. Please check our Waste Classification Guide for local drop-off points.",
    },
    {
        id: 3,
        category: "Rewards",
        question: "How can I earn Green Points through the Rewards Program?",
        answer: "Green Points are primarily earned by scheduling and successfully completing Smart Pickups. You earn bonus points for accurate sorting (verified by our AI system) and participating in community challenges or drives.",
    },
    {
        id: 4,
        category: "Services",
        question: "What is the difference between Commercial and Industrial services?",
        answer: "Commercial services (SMEs, Schools, Hospitals) generally handle moderate volumes of municipal and non-hazardous specialized waste. Industrial services handle high-volume, complex waste streams (e.g., manufacturing byproducts, construction debris, heavy metals) requiring strict environmental compliance.",
    },
    {
        id: 5,
        category: "AI Sorting",
        question: "Why did I get a notification about sorting contamination?",
        answer: "Our AI sorting technology flagged an item in your bin that did not belong in that waste stream (e.g., food waste in a recycling bin). This notification is educational. Repeated contamination may affect your eligibility for bonus Green Points.",
    },
    {
        id: 6,
        category: "Account",
        question: "Can I manage multiple addresses from one account?",
        answer: "Yes! In your dashboard settings, you can add multiple service locations (e.g., home and office). Each location can have its own scheduled pickups and waste stream tracking.",
    },
];

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
    <div className={`mb-4 overflow-hidden rounded-3xl border transition-all duration-300 ${isOpen ? 'bg-green-50 border-green-200' : 'bg-white border-green-50 hover:border-green-100'}`}>
        <button
            className="flex justify-between items-center w-full p-8 text-left font-black text-xl text-green-950 transition group"
            onClick={onClick}
            aria-expanded={isOpen ? 'true' : 'false'} 
        >
            <span className="group-hover:text-green-600 transition-colors">{question}</span>
            <div className={`p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-green-600 text-white rotate-180' : 'bg-green-100 text-green-600 group-hover:bg-green-200'}`}>
                <ChevronDown className="w-5 h-5" />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <div className="px-8 pb-8 text-green-800 leading-relaxed font-medium text-lg border-t border-green-100/50 pt-6">
                        <p>{answer}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);


export default function FAQsPage() {
    const [openId, setOpenId] = useState<number | null>(null);

    const handleToggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <section className="bg-green-50 py-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <Link 
                        href="/learning-hub" 
                        className="inline-flex items-center gap-2 text-green-600 font-bold mb-8 hover:text-green-800 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-green-950 mb-6 leading-tight">
                        ❓ Frequently Asked <br/><span className="text-green-600">Questions</span>
                    </h1>
                    <p className="text-xl text-green-800 font-medium max-w-2xl mx-auto">
                        Quick answers to everything you need to know about 
                        Green Loop&apos;s services and technology.
                    </p>
                </div>
                
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <HelpCircle className="w-96 h-96 text-green-600 -translate-x-1/2 -translate-y-1/2" />
                    <MessageCircle className="w-64 h-64 text-green-600 absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4" />
                </div>
            </section>

            <section className="py-24 max-w-5xl mx-auto px-6">
                {/* --- Accordion List --- */}
                <div className="space-y-4">
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

                {/* --- CTA / Support Area --- */}
                <div className="mt-24 p-12 bg-green-950 rounded-[3.5rem] shadow-2xl text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-6">Still have a question?</h2>
                        <p className="text-green-200 text-lg mb-10 font-medium">
                            Our support team is available from 8am to 6pm for Ndagani residents.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link 
                                href="/contact"
                                className="px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-500 transition shadow-xl transform hover:-translate-y-1 flex items-center gap-2 justify-center"
                            >
                                Contact Support <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link 
                                href="/learning-hub/guides"
                                className="px-10 py-5 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition flex items-center gap-2 justify-center"
                            >
                                Read Sorting Guides
                            </Link>
                        </div>
                    </div>
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-800/20 to-transparent"></div>
                </div>
            </section>
        </div>
    );
}
