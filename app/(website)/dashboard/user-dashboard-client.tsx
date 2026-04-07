"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserDashboardData } from "@/types";
import ImpactHero from "@/components/user/impact-hero";
import StatCards from "@/components/user/stat-cards";
import PickupTable from "@/components/user/pickup-table";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface DashboardClientProps {
    data: UserDashboardData;
    userName: string;
}

export default function DashboardClient({ data, userName }: DashboardClientProps) {
    const router = useRouter();
    const [isCancelling, setIsCancelling] = useState(false);

    const { metrics, rewards, social } = data;

    const nextPickup = data.metrics.nextPickup && data.metrics.nextPickup !== 'N/A'
        ? new Date(data.metrics.nextPickup).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    const handleCancelPickup = async () => {
        if (!data.metrics.nextPickupId) return;
        if (!confirm("Are you sure you want to cancel this pickup?")) return;

        setIsCancelling(true);
        try {
            const res = await fetch("/api/schedule-pickup", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scheduleId: data.metrics.nextPickupId }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to cancel pickup");
            }
        } catch (error) {
            console.error("Error cancelling pickup:", error);
            alert("An error occurred while cancelling the pickup");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="px-6 py-8 max-w-[1400px] mx-auto space-y-12">

                <ImpactHero
                    userName={userName}
                    nextPickup={nextPickup}
                />

                <StatCards 
                    points={metrics.rewardPoints}
                    totalWeight={metrics.totalWeight}
                    rank={social.rank}
                    totalNeighbors={social.totalNeighbors}
                    tier={rewards.tier}
                />

                {/* ── Tier 2: Dashboard Cards Section ───── */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Next Collection Card */}
                    {nextPickup ? (
                        <div className="bg-green-600 p-8 rounded-3xl text-white shadow-lg shadow-green-200">
                            <p className="text-xs font-bold uppercase tracking-widest text-green-100 mb-2">Next Collection</p>
                            <h2 className="text-4xl font-bold tracking-tight mb-6">{nextPickup}</h2>
                            <div className="flex items-center gap-4">
                                <Link href="/schedule-pickup" className="bg-white text-green-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors">
                                    Reschedule
                                </Link>
                                <button 
                                    onClick={handleCancelPickup}
                                    disabled={isCancelling}
                                    className="text-green-100 text-sm font-semibold hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Cancel Pickup
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-green-100 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Collection Service</p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">None Scheduled</h2>
                            <Link href="/schedule-pickup" className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-green-700 transition-colors inline-block shadow-lg shadow-green-200">
                                Schedule Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* ── Main Content: Single Column Layout ─────────────────── */}
                <div className="pt-6">
                    <PickupTable history={data.pickupHistory} />
                </div>
            </div>
        </div>
    );
}
