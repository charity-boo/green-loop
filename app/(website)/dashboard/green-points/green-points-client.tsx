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
            {/* --- Hero Section Removed as per request --- */}

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

            {/* --- Points Summary Summary --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-slate-900/20">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Balance</span>
                        </div>
                        <h1 className="text-6xl font-black tracking-tight mb-2">{points.toLocaleString()} <span className="text-2xl text-slate-500 uppercase tracking-widest ml-2">PTS</span></h1>
                        <p className="text-slate-400 font-medium mb-8">Current Tier: <span className="text-emerald-400 font-bold uppercase tracking-widest ml-2">{tier}</span></p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Progress to Next Tier</span>
                            <span className="text-sm font-black text-emerald-400 tracking-tight">{Math.round(milestoneProgress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000"
                                style={{ width: `${milestoneProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-emerald-600">
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="text-xs font-black uppercase tracking-[0.2em]">AI Intelligence Bonus</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-2">
                            {data.metrics.aiStats?.totalAiPoints.toLocaleString() || '0'}
                        </h2>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                            Total points earned through our Smart AI Waste Classification system.
                        </p>
                    </div>
                    <div className="pt-8 border-t border-slate-50 mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                <span className="text-lg font-black">{data.metrics.aiStats?.totalClassified || 0}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                Items successfully identified <br />
                                <span className="text-xs text-slate-400 font-medium tracking-normal">Using local & cloud AI</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                                        <div className="flex flex-col gap-1">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest w-fit">
                                                {item.wasteType}
                                            </span>
                                            {item.classificationStatus === 'classified' && (
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-tight">
                                                    <Zap className="w-2.5 h-2.5 fill-current" />
                                                    AI Bonus Included
                                                </span>
                                            )}
                                        </div>
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
