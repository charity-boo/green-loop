import React from 'react';
import Image from 'next/image';
import { 
  getDashboardKPIs, 
  getWasteTrendData, 
  getWasteDistribution,
  DashboardKPIs,
  WasteTrend,
  WasteDistributionData
} from '@/lib/firebase/services/analytics';
import WasteTrendChart from '@/components/admin/WasteTrendChart';
import WasteDistributionChart from '@/components/admin/WasteDistributionChart';
import { KPISkeleton } from '@/components/admin/Skeletons';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  Calendar, 
  Download, 
  Share2, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AnalyticsPage() {
  let kpis: DashboardKPIs | null = null;
  let trendData: WasteTrend[] = [];
  let distribution: WasteDistributionData[] = [];

  try {
    [kpis, trendData, distribution] = await Promise.all([
      getDashboardKPIs(),
      getWasteTrendData(),
      getWasteDistribution(),
    ]);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
            Impact Intelligence
          </h1>
          <p className="text-slate-400 mt-2 max-w-md">Data-driven insights into Ndagani&apos;s circular economy performance and sustainability metrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl transition-all font-bold text-sm flex items-center gap-2 backdrop-blur-md">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Last 30 Days
          </button>
          <button className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20">
            <Download className="w-4 h-4" />
            Generate PDF Report
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      {!kpis ? <KPISkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPIReportCard 
            title="Waste Diverted" 
            value={`${(kpis?.totalUsers || 0) * 12.5} kg`} 
            trend="+14.2%" 
            up={true} 
            color="emerald"
            desc="Since last month"
          />
          <KPIReportCard 
            title="Recycling Rate" 
            value="68.4%" 
            trend="+5.1%" 
            up={true} 
            color="blue"
            desc="Efficiency metric"
          />
          <KPIReportCard 
            title="Active Drivers" 
            value={kpis?.activeCollectors || 0} 
            trend="-2" 
            up={false} 
            color="amber"
            desc="Live workforce"
          />
          <KPIReportCard 
            title="AI Precision" 
            value={`${kpis?.aiAccuracy || 0}%`} 
            trend="+0.8%" 
            up={true} 
            color="indigo"
            desc="Model confidence"
          />
        </div>
      )}

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Collection Volume Trend
              </h3>
              <p className="text-slate-500 text-sm mt-1">Daily waste volume (kg) processed by GreenLoop.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Filter className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Share2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <WasteTrendChart data={trendData} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-500" />
              Waste Stream Distribution
            </h3>
          </div>
          <div className="h-[300px] w-full relative">
            <WasteDistributionChart data={distribution} />
          </div>
          <div className="mt-8 space-y-3">
             {distribution.map((item, idx) => (
               <div key={idx} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 font-medium text-slate-700">
                    <div className={cn("w-2.5 h-2.5 rounded-full", 
                      item.wasteType === 'ORGANIC' ? 'bg-emerald-500' : 
                      item.wasteType === 'PLASTIC' ? 'bg-blue-500' : 
                      item.wasteType === 'RECYCLABLE' ? 'bg-indigo-500' : 'bg-rose-500'
                    )} />
                    {item.wasteType}
                 </div>
                 <div className="font-bold text-slate-900">{item.count} units</div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Advanced Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
               <TrendingUp className="w-32 h-32" />
            </div>
            <h4 className="text-emerald-100 font-bold uppercase tracking-widest text-[10px] mb-2">Environmental Impact</h4>
            <h3 className="text-4xl font-black mb-6">4.2 Tons</h3>
            <p className="text-emerald-50/80 text-sm leading-relaxed max-w-xs mb-8">
               Total carbon footprint reduction achieved through proper waste segregation in Ndagani this quarter.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-950/20">
               View Impact Report <ArrowUpRight className="w-4 h-4" />
            </button>
         </div>

         <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Community Engagement</h3>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500 font-medium">User Participation Rate</span>
                     <span className="text-emerald-600 font-bold">82%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full w-[82%] shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                     <span className="text-slate-500 font-medium">Goal Completion (Ndgani Clean City)</span>
                     <span className="text-blue-500 font-bold">64%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full w-[64%] shadow-[0_0_12px_rgba(59,130,246,0.3)]" />
                  </div>
               </div>
               <div className="pt-4 flex items-center justify-between">
                  <div className="flex -space-x-3">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-bold text-xs text-slate-600 shadow-sm overflow-hidden">
                           <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" width={40} height={40} className="w-full h-full object-cover" />
                        </div>
                     ))}
                     <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center font-bold text-[10px] text-emerald-600 shadow-sm">
                        +840
                     </div>
                  </div>
                  <button className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">View All Members</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function KPIReportCard({ title, value, trend, up, color: _color, desc }: { title: string; value: string | number; trend: string; up: boolean; color: string; desc: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
        <div className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
          up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {trend}
        </div>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight group-hover:scale-105 origin-left transition-transform duration-300">{value}</div>
      <p className="text-xs text-slate-400 mt-2 font-medium">{desc}</p>
    </div>
  );
}
