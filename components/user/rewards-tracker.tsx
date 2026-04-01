'use client';

import React from 'react';
import { Award, Zap, Gift, TreePine, CreditCard, ShoppingBag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface RewardsTrackerProps {
    points: number;
    nextMilestone: number;
    progress: number;
    canRedeem: boolean;
    className?: string;
}

const REWARDS = [
    {
        id: 'free_pickup',
        label: 'Free Collection',
        cost: 500,
        icon: CreditCard,
        description: 'Waive your next collection fee'
    },
    {
        id: 'partner_voucher',
        label: 'Eco-Voucher',
        cost: 1000,
        icon: ShoppingBag,
        description: 'Ksh 200 off at partner eco-shops'
    },
    {
        id: 'plant_tree',
        label: 'Plant 1 Tree',
        cost: 250,
        icon: TreePine,
        description: 'Support local reforestation'
    }
];

/**
 * Integrated Green Points & Redemption Center
 * Directly actionable on the dashboard.
 */
export default function RewardsTracker({ points, progress, canRedeem, className }: RewardsTrackerProps) {
    const handleClaim = (reward: string, cost: number) => {
        if (!canRedeem) return;
        // In a real app, this would trigger a mutation.
        alert(`Claiming ${reward} for ${cost} points...`);
    };

    return (
        <div className={cn(
            "p-6 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:border-green-200",
            className
        )}>
            {/* Points Summary Section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-green-50 text-green-600">
                        <Award className="w-4 h-4" />
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Rewards Center</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-600 uppercase tracking-widest">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    Live Points
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    {points.toLocaleString()}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
            </div>

            {/* Global Redemption Lock Warning */}
            {!canRedeem && (
                <div className="mb-8 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 shrink-0">
                        <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">Redemption Locked</p>
                        <p className="text-[10px] font-medium text-amber-700 leading-tight">Pay your outstanding pickups to unlock rewards.</p>
                    </div>
                </div>
            )}

            <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Next Milestone</span>
                    <span className="text-green-600">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Redemption List: Directly actionable here */}
            <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2 mb-6">
                    <Gift className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Redeem Your Points</span>
                </div>

                <div className="space-y-4">
                    {REWARDS.map((reward) => {
                        const isClaimable = points >= reward.cost && canRedeem;
                        return (
                            <div 
                                key={reward.id} 
                                className="group/reward p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-green-100 hover:shadow-sm transition-all"
                            >
                                <div className="flex items-start gap-3 justify-between mb-3">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "p-2 rounded-lg shrink-0 transition-colors",
                                            isClaimable ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <reward.icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-bold text-slate-900 leading-none">{reward.label}</p>
                                            <p className="text-[10px] font-medium text-slate-400 leading-tight">{reward.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-[10px] font-black tracking-widest",
                                            isClaimable ? "text-green-600" : "text-slate-400"
                                        )}>
                                            {reward.cost} pts
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleClaim(reward.label, reward.cost)}
                                    disabled={!isClaimable}
                                    className={cn(
                                        "w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all",
                                        isClaimable 
                                            ? "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100 active:scale-95" 
                                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {isClaimable ? 'Claim Now' : (points < reward.cost ? `${reward.cost - points} more pts needed` : 'Redemption Locked')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* View Full Details Link */}
            <div className="mt-8 pt-6 border-t border-slate-50">
                <Link 
                    href="/dashboard/green-points"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-slate-50 hover:bg-green-50 text-slate-600 hover:text-green-700 transition-all group"
                >
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-green-700">View Detailed History</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-green-700" />
                </Link>
            </div>
        </div>
    );
}

