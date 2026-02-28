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
import ActiveCampaigns from "@/components/user/active-campaigns";
import SortingTips from "@/components/user/sorting-tips";
import NotificationsWidget from "@/components/user/notifications-widget";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
    data: UserDashboardData;
    userName: string;
}

export default function DashboardClient({ data, userName }: DashboardClientProps) {
    const nextPickup = data.metrics.nextPickup && data.metrics.nextPickup !== 'N/A'
        ? new Date(data.metrics.nextPickup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    return (
        <div className="px-6 py-8 max-w-[1400px] mx-auto">

            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
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

                {nextPickup && (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Next Pickup</p>
                            <p className="text-base font-black text-emerald-900">{nextPickup}</p>
                        </div>
                        <Link href="/schedule-pickup" className="text-emerald-600 hover:text-emerald-800 transition-colors">
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* ── Zone 1: Stat Cards ─────────────────────────────────── */}
            <StatCards
                points={data.rewards.currentPoints}
                totalWeight={data.metrics.totalWeight}
                rank={data.social.rank}
                totalNeighbors={data.social.totalNeighbors}
                tier={data.rewards.tier}
            />

            {/* ── Zone 2: Pickup Table + Right Sidebar ──────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
                <div className="xl:col-span-8">
                    <PickupTable history={data.pickupHistory} />
                </div>
                <div className="xl:col-span-4 space-y-4">
                    <ActiveCampaigns />
                    <SortingTips />
                    <NotificationsWidget />
                </div>
            </div>

            {/* ── Zone 3: Charts + Legacy Widgets ───────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <MaterialImpactChart data={data.metrics.materialBreakdown} />
                </div>
                <div className="lg:col-span-4">
                    <CarbonSavingsPulse
                        co2Saved={data.metrics.carbonImpact.totalCo2Saved}
                        treesEquivalent={data.metrics.carbonImpact.treesEquivalent}
                    />
                </div>
                <div className="lg:col-span-4 space-y-6">
                    <RewardsTracker
                        points={data.rewards.currentPoints}
                        nextMilestone={data.rewards.nextMilestone}
                        progress={data.rewards.milestoneProgress}
                        tier={data.rewards.tier}
                    />
                </div>
                <div className="lg:col-span-4">
                    <QuickActionHub />
                </div>
                <div className="lg:col-span-8">
                    <SocialMiniBoard
                        rank={data.social.rank}
                        totalNeighbors={data.social.totalNeighbors}
                        percentile={data.social.percentile}
                        streak={data.social.streak}
                    />
                </div>
            </div>

        </div>
    );
}
