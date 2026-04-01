"use client";

import React from 'react';
import { 
    Award, 
    Zap, 
    Gift, 
    TreePine, 
    CreditCard, 
    ShoppingBag, 
    ArrowUpRight,
    History,
    CheckCircle2,
    Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserDashboardData } from '@/types';

interface GreenPointsClientProps {
    data: UserDashboardData;
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

export default function GreenPointsClient({ data }: GreenPointsClientProps) {
    const { currentPoints: points, tier, milestoneProgress, canRedeem } = data.rewards;
    const history = data.pickupHistory.filter(item => item.points > 0);

    const handleClaim = (reward: string, cost: number) => {
        if (!canRedeem) return;
        alert(`Claiming ${reward} for ${cost} points... Our team will contact you shortly.`);
    };

    return (
        <div className="px-6 py-8 max-w-[1400px] mx-auto space-y-12">
            {/* --- Hero Section: Points & Tier --- */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl -ml-32 -mb-32"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                {tier} Status Active
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">
                            {points.toLocaleString()}
                            <span className="text-emerald-500 ml-4 text-2xl md:text-3xl">PTS</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
                            Your recycling efforts are powering a cleaner Ndagani. Redeem your points for exclusive rewards below.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Next Milestone</p>
                                <p className="text-2xl font-black tracking-tight text-white">{data.rewards.nextMilestone.toLocaleString()} PTS</p>
                            </div>
                            <span className="text-4xl font-black text-emerald-500/50">{Math.round(milestoneProgress)}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                style={{ width: `${milestoneProgress}%` }}
                            />
                        </div>
                        <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Award className="w-4 h-4 text-emerald-500" />
                            {data.rewards.nextMilestone - points} points to reach your next reward tier
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Global Redemption Lock Warning --- */}
            {!canRedeem && (
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-6 shadow-sm">
                    <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-amber-900 uppercase tracking-tight mb-1">Redemption Locked</h3>
                        <p className="text-amber-700 font-medium max-w-2xl">
                            You have outstanding payments for recent pickups. Please settle your balance to unlock your Green Points and claim your rewards.
                        </p>
                    </div>
                    <div className="ml-auto">
                        <button className="px-6 py-3 bg-amber-600 text-white rounded-xl font-bold text-sm hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
                            View Payments
                        </button>
                    </div>
                </div>
            )}

            {/* --- Rewards Grid --- */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Rewards</h2>
                        <p className="text-slate-500 font-medium">Use your points to make an even bigger impact.</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <Gift className="w-4 h-4" />
                        <span>Redemption Center</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REWARDS.map((reward) => {
                        const isClaimable = points >= reward.cost && canRedeem;
                        return (
                            <div 
                                key={reward.id} 
                                className={cn(
                                    "group p-8 rounded-[2rem] border transition-all duration-500 flex flex-col h-full",
                                    isClaimable 
                                        ? "bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:border-emerald-200 hover:-translate-y-1" 
                                        : "bg-slate-50/50 border-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "h-16 w-16 rounded-2xl flex items-center justify-center mb-8 transition-colors",
                                    isClaimable ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                    <reward.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{reward.label}</h3>
                                        <span className={cn(
                                            "text-sm font-black tracking-widest",
                                            isClaimable ? "text-emerald-600" : "text-slate-400"
                                        )}>
                                            {reward.cost} PTS
                                        </span>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        {reward.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleClaim(reward.label, reward.cost)}
                                    disabled={!isClaimable}
                                    className={cn(
                                        "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all",
                                        isClaimable 
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 active:scale-[0.98]" 
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                    )}
                                >
                                    {isClaimable ? 'Redeem Reward' : (points < reward.cost ? `${reward.cost - points} more pts needed` : 'Locked')}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Points History --- */}
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Points History</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your recent earnings</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-2">Date</th>
                                <th className="px-6 py-2">Activity</th>
                                <th className="px-6 py-2">Type</th>
                                <th className="px-6 py-2 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((item) => (
                                <tr key={item.id} className="group">
                                    <td className="px-6 py-5 bg-slate-50 rounded-l-2xl group-hover:bg-emerald-50/50 transition-colors">
                                        <span className="text-sm font-bold text-slate-600">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">Waste Pickup Completed</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 group-hover:bg-emerald-50/50 transition-colors">
                                        <span className="px-2.5 py-1 rounded-full bg-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            {item.wasteType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 bg-slate-50 rounded-r-2xl text-right group-hover:bg-emerald-50/50 transition-colors">
                                        <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                                            <span className="text-lg font-black tracking-tight">+{item.points}</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No points history available yet. Start recycling to earn points!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
