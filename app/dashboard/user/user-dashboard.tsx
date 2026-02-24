
'use client';

import { useState, useMemo } from "react";
import Image from "next/image";
import { PickupHistoryItem, UserDashboardData } from "@/types";
import { WasteStatusDisplay, WasteStatusColor } from "@/lib/types/waste-status-display";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { WasteStatus } from "@/lib/types/waste-status";
import { Input } from "@/components/ui/input";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import {
  Leaf,
  Weight,
  Trophy,
  History,
  Search,
  ArrowUpDown,
  TrendingUp,
  Zap,
  Calendar,
  MoreVertical,
  Package,
  Gift,
  AlertCircle
} from "lucide-react";

type SortKey = "date" | "weight" | "points";
type SortDirection = "asc" | "desc";

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function UserDashboard({ data }: { data: UserDashboardData }) {
  const [searchTerm, setSearchTerm] = useState("");

  const trendData = useMemo(() => {
    return data.pickupHistory.slice(0, 10).reverse().map(item => ({
      name: item.date,
      kg: item.weight || (Math.random() * 8 + 2),
    }));
  }, [data.pickupHistory]);

  const co2Saved = (data.metrics.totalWeight * 2.5).toFixed(1);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-[1600px] mx-auto pb-20">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">User Dashboard</h1>
          <p className="text-gray-500 font-medium italic">Your personalized recycling workspace</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-10 w-10 bg-white shadow-sm rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-700 pr-4">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Metric Cards: Total Waste, Recycling Rate, CO2 Saved, Next Pickup, Skipped */}
      <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
        <Card className="rounded-[40px] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 p-2 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <Weight className="h-24 w-24 text-green-500" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <Package className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 leading-none">{data.metrics.totalWeight.toFixed(1)} <span className="text-xl font-bold text-gray-400">kg</span></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Total Waste</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 p-2 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <Zap className="h-24 w-24 text-blue-500" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Zap className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 leading-none">{data.metrics.recyclingRate}%</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Recycling Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none bg-[#1B4332] shadow-[0_30px_80px_rgba(27,67,50,0.15)] hover:shadow-[0_40px_100px_rgba(27,67,50,0.25)] transition-all duration-500 p-2 group relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-125 transition-transform duration-500">
            <Leaf className="h-24 w-24 text-green-400" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <Leaf className="h-7 w-7 text-green-400" />
            </div>
            <div>
              <div className="text-4xl font-black leading-none">{co2Saved} <span className="text-xl font-bold opacity-50">kg</span></div>
              <p className="text-[10px] font-black uppercase tracking-widest text-green-100/50 mt-3">CO2 Saved</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 p-2 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <Calendar className="h-24 w-24 text-amber-500" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">{data.metrics.nextPickup || 'None'}</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Next Scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 p-2 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-500">
            <AlertCircle className="h-24 w-24 text-red-500" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 leading-none">{data.metrics.skippedPickups || 0}</div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-3">Skipped Pickups</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Waste Collection Trend Area Chart */}
      <Card className="rounded-[40px] border-none bg-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Waste Collection Trend</CardTitle>
            <CardDescription className="text-gray-400 font-bold text-sm uppercase tracking-widest">Bi-weekly recycling volume (kg)</CardDescription>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10 h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} dy={20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 40px 60px -10px rgb(0 0 0 / 0.2)', padding: '20px 24px', backgroundColor: '#1E293B', color: '#fff' }}
                itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="kg" stroke="#22c55e" strokeWidth={6} fillOpacity={1} fill="url(#colorTrend)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rewards & Impact Section */}
      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="rounded-[40px] border-none bg-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] overflow-hidden lg:col-span-7">
          <CardHeader className="p-10 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Rewards Program</CardTitle>
                <CardDescription className="text-gray-400 font-bold text-sm uppercase tracking-widest">Your progress to next milestone</CardDescription>
              </div>
              <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                <Trophy className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 pt-0 space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Current Tier</span>
                <div className="text-3xl font-black text-[#1B4332] flex items-center gap-2">
                  <Zap className="h-6 w-6 text-amber-500 fill-amber-500" />
                  {data.rewards.tier} Member
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-gray-900">{data.rewards.currentPoints}</span>
                <span className="text-sm font-bold text-gray-400 ml-2 uppercase tracking-widest">Points</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm font-black uppercase tracking-widest">
                <span className="text-gray-400">Progress to {data.rewards.nextMilestone} pts</span>
                <span className="text-[#1B4332]">{Math.round(data.rewards.milestoneProgress)}%</span>
              </div>
              <Progress value={data.rewards.milestoneProgress} className="h-4 bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-gray-50 rounded-[30px] border border-gray-100">
                <div className="text-2xl font-black text-gray-900">{data.metrics.totalPickups}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Pickups</div>
              </div>
              <div className="p-6 bg-gray-50 rounded-[30px] border border-gray-100">
                <div className="text-2xl font-black text-gray-900">{data.metrics.rewardPoints}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">Lifetime Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[40px] border-none bg-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] overflow-hidden lg:col-span-5">
          <CardHeader className="p-10 pb-6">
            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Available Rewards</CardTitle>
            <CardDescription className="text-gray-400 font-bold text-sm uppercase tracking-widest">Redeem your earned points</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0 space-y-6">
            {data.rewards.availableRewards.map((reward) => (
              <div key={reward.id} className="flex items-center gap-6 p-4 rounded-3xl border border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="h-14 w-14 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Gift className="h-7 w-7 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-black text-gray-900">{reward.title}</div>
                  <div className="text-xs text-gray-400 font-medium line-clamp-1">{reward.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-green-600 bg-green-50 px-3 py-1 rounded-xl">{reward.pointsCost}</div>
                </div>
              </div>
            ))}
            <button className="w-full py-5 rounded-[24px] bg-[#1B4332] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              View All Rewards
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pickups Table */}
      <Card className="rounded-[40px] border-none bg-white shadow-[0_30px_70px_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Recent Pickups</CardTitle>
            <CardDescription className="text-gray-400 font-bold text-sm uppercase tracking-widest">Transaction log history</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Filter by location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-gray-50 border-none rounded-2xl focus-visible:ring-4 focus-visible:ring-green-100 placeholder:text-gray-400 placeholder:font-bold"
            />
          </div>
        </CardHeader>
        <CardContent className="p-10 pt-0 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent tracking-widest uppercase">
                <TableHead className="py-6 text-[12px] font-black text-gray-400">Location</TableHead>
                <TableHead className="py-6 text-[12px] font-black text-gray-400">Status</TableHead>
                <TableHead className="py-6 text-[12px] font-black text-gray-400 text-right">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pickupHistory.length > 0 ? (
                data.pickupHistory.filter(p => !searchTerm || p.location.toLowerCase().includes(searchTerm.toLowerCase())).map((pickup) => (
                  <TableRow key={pickup.id} className="border-b border-gray-50 group transition-all duration-300 hover:bg-gray-50/50">
                    <TableCell className="py-8">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900">{pickup.location}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{pickup.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-8">
                      <span className={cn(
                        "px-5 py-2 rounded-2xl text-[11px] font-black tracking-widest uppercase border transition-colors shadow-sm",
                        pickup.status === WasteStatus.Completed
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {WasteStatusDisplay[pickup.status]}
                      </span>
                    </TableCell>
                    <TableCell className="py-8 text-right font-black text-gray-900 text-xl tracking-tight">
                      {pickup.weight.toFixed(1)} <span className="text-sm text-gray-400 font-bold">kg</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-40 text-center text-gray-300 font-black italic text-lg pr-4 border-none">
                    No recent pickups to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

