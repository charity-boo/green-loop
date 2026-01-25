"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Handshake, Calendar, MapPin } from 'lucide-react';
// Assuming Shadcn components are available
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function VolunteerPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [interest, setInterest] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        // --- Replace with actual API submission logic (e.g., saving to Firebase Firestore) ---
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Volunteer application submitted:", { name, email, interest });
        setSuccess(true);
        setLoading(false);
        // --- End Submission Logic ---
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-green-50 p-4 sm:p-8">
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-4xl font-extrabold text-green-800 mb-2">
                    🤝 Become a Green Loop Volunteer
                </h1>
                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                    Your time and effort are invaluable. Join our movement and help organize clean-up drives, educational workshops, and community events.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 text-left">
                    {/* Benefits Section */}
                    <Card className="bg-white shadow-xl border-t-4 border-green-600">
                        <CardHeader>
                            <CardTitle className="flex items-center text-2xl text-green-700">
                                <Handshake className="w-6 h-6 mr-2"/> Why Volunteer?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-gray-700">
                            <p className="flex items-start">
                                <span className="text-green-600 mr-2">•</span> 
                                **Make a Direct Impact:** See the immediate results of your community clean-up efforts.
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-2">•</span> 
                                **Flexible Commitment:** Choose shifts and projects that fit your busy schedule.
                            </p>
                            <p className="flex items-start">
                                <span className="text-green-600 mr-2">•</span> 
                                **Earn Green Points:** Volunteer hours contribute to your Recycling Rewards status.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Volunteer Form */}
                    <Card className="shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Express Your Interest</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {success && (
                                <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg text-center">
                                    ✅ Thank you! We've received your application and will be in touch soon.
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" required onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" required onChange={(e) => setEmail(e.target.value)} placeholder="jane.doe@example.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="interest">Areas of Interest (e.g., Clean-ups, Education, Logistics)</Label>
                                    <Textarea id="interest" onChange={(e) => setInterest(e.target.value)} placeholder="I am interested in..." rows={3} />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="mt-8 text-center">
                    <Link 
                        href="/community/careers"
                        className="text-gray-600 hover:text-green-600 font-semibold hover:underline"
                    >
                        Looking for professional opportunities? View Careers →
                    </Link>
                </div>
            </div>
        </div>
    );
}