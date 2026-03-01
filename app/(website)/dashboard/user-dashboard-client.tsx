"use client";

import { motion } from "framer-motion";
import { UserDashboardData } from "@/types";
import RewardsTracker from "@/components/user/rewards-tracker";
import MaterialImpactChart from "@/components/user/material-impact-chart";
import CarbonSavingsPulse from "@/components/user/carbon-savings-pulse";
import QuickActionHub from "@/components/user/quick-action-hub";
import SocialMiniBoard from "@/components/user/social-mini-board";
import StatCards from "@/components/user/stat-cards";
import PickupTable from "@/components/user/pickup-table";
import LocationSection from "@/components/user/location-section";
import ActiveCampaigns from "@/components/user/active-campaigns";
import SortingTips from "@/components/user/sorting-tips";
import NotificationsWidget from "@/components/user/notifications-widget";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
    data: UserDashboardData;
    userName: string;
    userCounty?: string | null;
    userRegion?: string | null;
}

export default function DashboardClient({ data, userName, userCounty, userRegion }: DashboardClientProps) {
    const nextPickup = data.metrics.nextPickup && data.metrics.nextPickup !== 'N/A'
        ? new Date(data.metrics.nextPickup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="px-6 py-6 max-w-[1400px] mx-auto">

            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
            >
                <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Dashboard</p>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                        Welcome back,{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                            {userName || "Green Looper"}
                        </span>
                    </h1>
                </div>
            </motion.div>

            {/* ── Main Section: Content & Sidebar ───────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                
                {/* ── Primary Column (8/12) ── */}
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                    {nextPickup && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative overflow-hidden group bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl shadow-xl shadow-emerald-100"
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-inner">
                                        <Calendar className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-1">Upcoming Collection</p>
                                        <h3 className="text-2xl font-black text-white leading-none">
                                            {nextPickup}
                                        </h3>
                                    </div>
                                </div>
                                <Link 
                                    href="/schedule-pickup"
                                    className="px-6 py-3 bg-white text-emerald-700 rounded-xl text-sm font-black uppercase tracking-wider hover:bg-emerald-50 transition-colors shadow-lg active:scale-95"
                                >
                                    Reschedule
                                </Link>
                            </div>
                            
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-700" />
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl" />
                        </motion.div>
                    )}

                    <StatCards
                        points={data.rewards.currentPoints}
                        totalWeight={data.metrics.totalWeight}
                        rank={data.social.rank}
                        totalNeighbors={data.social.totalNeighbors}
                        tier={data.rewards.tier}
                    />
                    <RewardsTracker
                        points={data.rewards.currentPoints}
                        nextMilestone={data.rewards.nextMilestone}
                        progress={data.rewards.milestoneProgress}
                        tier={data.rewards.tier}
                    />
                    <PickupTable history={data.pickupHistory} />
                    <LocationSection
                        initialCounty={userCounty}
                        initialRegion={userRegion}
                    />
                    <SocialMiniBoard
                        rank={data.social.rank}
                        totalNeighbors={data.social.totalNeighbors}
                        percentile={data.social.percentile}
                        streak={data.social.streak}
                    />
                </div>

                {/* ── Secondary Sidebar (4/12) ── */}
                <div className="lg:col-span-4 space-y-6 flex flex-col">
                    <QuickActionHub />
                    <NotificationsWidget />
                    <CarbonSavingsPulse
                        co2Saved={data.metrics.carbonImpact.totalCo2Saved}
                        treesEquivalent={data.metrics.carbonImpact.treesEquivalent}
                    />
                    <MaterialImpactChart data={data.metrics.materialBreakdown} />
                </div>
            </div>

            {/* ── Bottom Section: Discovery & Community ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <ActiveCampaigns />
                <SortingTips />
            </div>

        </div>
    );
}
