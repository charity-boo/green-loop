import React from 'react';
import {
    ClipboardList,
    TrendingUp,
    Award,
    MapPin,
    Clock,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';

export default function CollectorDashboard() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#022c22] font-outfit transition-colors duration-300">
            {/* Premium Header Section */}
            <div className="bg-[#064e3b] text-white py-12 px-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
                            Collector <span className="text-[#10b981]">Dashboard</span>
                        </h1>
                        <p className="text-emerald-100/80 text-lg max-w-xl">
                            Ndagani Field-Ops: Monitor your collection progress and optimize your route in real-time.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-1">Status</p>
                            <p className="text-sm font-medium">Ready for Shift</p>
                        </div>
                        <button className="px-8 py-4 bg-[#10b981] hover:bg-emerald-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-900/60 hover:-translate-y-1 active:scale-95">
                            Go Online
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
                {/* Real-time Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        label="Daily Progress"
                        value="12.5 kg"
                        percentage={34}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="emerald"
                        subtext="of 35kg goal"
                    />
                    <StatCard
                        label="Pending Jobs"
                        value="5"
                        icon={<Clock className="w-6 h-6" />}
                        color="amber"
                        subtext="3 High Priority"
                    />
                    <StatCard
                        label="Green Points"
                        value="1,240"
                        icon={<Award className="w-6 h-6" />}
                        color="blue"
                        subtext="+120 earned today"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Central Task Management */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-emerald-800/30 pb-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                                <ClipboardList className="w-7 h-7 text-[#10b981]" />
                                Active Task Queue
                            </h2>
                            <button className="text-sm font-semibold text-[#10b981] hover:underline flex items-center gap-1">
                                View History <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Empty State placeholder for Task List */}
                        <div className="bg-white/80 dark:bg-[#064e3b]/30 backdrop-blur-xl border border-dashed border-emerald-200 dark:border-emerald-800/50 rounded-[2.5rem] p-16 text-center shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-8 transition-transform group-hover:scale-110">
                                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Active Tasks</h3>
                            <p className="text-slate-500 dark:text-emerald-100/50 mb-10 max-w-sm mx-auto">
                                The Ndagani region is currently clean! New collection requests will appear here in real-time.
                            </p>
                            <button className="px-10 py-3.5 bg-white dark:bg-emerald-900/40 text-emerald-700 dark:text-[#10b981] border-2 border-emerald-100 dark:border-emerald-800 font-bold rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-800/60 transition-all shadow-sm">
                                Refresh Queue
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Active Sector</h2>
                        <div className="bg-white dark:bg-[#064e3b]/20 border border-slate-200 dark:border-emerald-800/20 rounded-[2rem] p-8 shadow-sm relative group cursor-pointer">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl">
                                    <MapPin className="w-6 h-6 text-emerald-600 dark:text-[#10b981]" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ndagani Hub</h4>
                                    <p className="text-sm text-slate-500 dark:text-emerald-100/50">Chuka, Main Street Area</p>
                                </div>
                            </div>
                            <div className="h-44 bg-slate-100 dark:bg-emerald-950/50 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-emerald-900/50 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                <span className="text-xs font-bold uppercase tracking-widest mb-2">Satellite View</span>
                                <span className="text-[10px] italic">Live map loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string;
    icon: React.ReactNode;
    color: 'emerald' | 'amber' | 'blue';
    subtext: string;
    percentage?: number;
}

function StatCard({ label, value, icon, color, subtext, percentage }: StatCardProps) {
    const themes = {
        emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30",
        amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30",
        blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30"
    };

    return (
        <div className="bg-white dark:bg-[#064e3b]/40 backdrop-blur-md border border-slate-200 dark:border-emerald-800/10 p-7 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${themes[color]}`}>
                    {icon}
                </div>
                <span className="text-xs font-bold text-slate-400 dark:text-emerald-200/30 uppercase tracking-[0.2em]">{label}</span>
            </div>
            <div className="flex items-baseline gap-3">
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tighter">{value}</p>
                <p className="text-xs text-slate-400 dark:text-emerald-100/40 font-medium">{subtext}</p>
            </div>
            {percentage && (
                <div className="mt-5 h-1.5 w-full bg-slate-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#10b981] rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}
