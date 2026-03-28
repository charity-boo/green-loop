"use client";

import { UserDashboardData } from "@/types";
import ImpactHero from "@/components/user/impact-hero";
import PickupTable from "@/components/user/pickup-table";
import RewardsTracker from "@/components/user/rewards-tracker";
import Link from "next/link";
import { AlertCircle, UserPlus, BookOpen } from "lucide-react";

interface DashboardClientProps {
    data: UserDashboardData;
    userName: string;
}

export default function DashboardClient({ data, userName }: DashboardClientProps) {
    const nextPickup = data.metrics.nextPickup && data.metrics.nextPickup !== 'N/A'
        ? new Date(data.metrics.nextPickup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="min-h-screen bg-white">
            <div className="px-6 py-8 max-w-[1400px] mx-auto space-y-12">

                <ImpactHero 
                    userName={userName}
                    totalWeight={data.metrics.totalWeight}
                    co2Saved={data.metrics.carbonImpact.totalCo2Saved}
                    currentPoints={data.rewards.currentPoints}
                />

                {/* ── Tier 2: Next Collection Card ───── */}
                {nextPickup ? (
                    <div className="bg-emerald-600 p-8 rounded-2xl text-white shadow-lg shadow-emerald-200">
                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-2">Next Collection</p>
                        <h2 className="text-4xl font-bold tracking-tight mb-6">{nextPickup}</h2>
                        <div className="flex items-center gap-4">
                            <Link href="/schedule-pickup" className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
                                Reschedule
                            </Link>
                            <button className="text-emerald-100 text-sm font-semibold hover:text-white transition-colors">
                                Cancel Pickup
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border-2 border-emerald-100 p-10 rounded-2xl text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Collection Scheduled</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Ready to clear some waste? Schedule your next collection in seconds.</p>
                        <Link href="/schedule-pickup" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors inline-block shadow-lg shadow-emerald-200">
                            Schedule Now
                        </Link>
                    </div>
                )}

                {/* ── Main Content: Two-Column Layout ─────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
                    <div className="lg:col-span-8">
                        <PickupTable history={data.pickupHistory} />
                    </div>
                    
                    <div className="lg:col-span-4 space-y-8">
                        {/* Green Points Card */}
                        <RewardsTracker 
                            points={data.rewards.currentPoints}
                            nextMilestone={data.rewards.nextMilestone}
                            progress={data.rewards.milestoneProgress}
                            canRedeem={data.rewards.canRedeem}
                        />

                        {/* Quick Actions List */}
                        <div className="pt-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Actions</h3>
                            <div className="space-y-4">
                                <Link href="/contact" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors group">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                                        <AlertCircle className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold">Report a Problem</span>
                                </Link>
                                
                                <Link href="/referral" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors group">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                                        <UserPlus className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold">Refer a Neighbor</span>
                                </Link>

                                <Link href="/learning-hub" className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors group">
                                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-semibold">View Sorting Tips</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
