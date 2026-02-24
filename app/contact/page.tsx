"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';
// Assuming Shadcn components are available
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.name || !formData.email || !formData.message) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // --- Replace with actual form submission logic (e.g., API endpoint or Firebase Firestore) ---
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log("Contact form submitted:", formData);
        
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        setLoading(false);
        // --- End Submission Logic ---
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="w-full max-w-6xl mx-auto py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
                        Get In Touch with Green Loop
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Whether you have a general inquiry, need service support, or are interested in a partnership, we&apos;re here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* --- Contact Details (Left Column) --- */}
                    <div className="lg:col-span-1 space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-2">Our Details</h2>
                        
                        <div className="flex items-start space-x-4">
                            <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Office Location</h3>
                                <p className="text-gray-600">
                                    Green Loop HQ, 123 Eco Blvd, Ndagani, NA 4000
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Support Hotline</h3>
                                <p className="text-gray-600">
                                    General Inquiries: (0800) 123 456
                                </p>
                                <p className="text-gray-600">
                                    Emergency: (0800) 999 000
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg text-gray-800">Email Us</h3>
                                <p className="text-gray-600">
                                    Support: support@greenloop.co
                                </p>
                                <p className="text-gray-600">
                                    Partnerships: partnerships@greenloop.co
                                </p>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100">
                             <Link href="/about-us" className="text-sm text-green-600 hover:underline flex items-center">
                                Learn more about our mission →
                            </Link>
                        </div>

                    </div>

                    {/* --- Contact Form (Right Column) --- */}
                    <div className="lg:col-span-2 p-8 bg-white rounded-xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>

                        {success && (
                            <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg text-center">
                                Your message has been sent successfully! We will respond within 48 hours.
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Name */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name*</Label>
                                    <Input id="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                                </div>
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address*</Label>
                                    <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                                </div>
                            </div>
                            
                            {/* Subject */}
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" type="text" value={formData.subject} onChange={handleChange} placeholder="Regarding service inquiry" />
                            </div>

                            {/* Message */}
                            <div className="grid gap-2">
                                <Label htmlFor="message">Your Message*</Label>
                                <Textarea id="message" required value={formData.message} onChange={handleChange} placeholder="I am writing about..." rows={5} />
                            </div>

                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 mt-4"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <Send className="w-4 h-4 mr-2 animate-pulse" /> Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Send className="w-4 h-4 mr-2" /> Send Message
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}