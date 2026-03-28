'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Trash2, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  Trophy, 
  Recycle,
  MapPin,
  Loader2,
  CheckCircle2,
  Lock,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { HostelSelection } from "./hostel-search";
import { HostelDoc } from "@/types/firestore";

export function MyHostelDashboard({ hostel, onReset }: { hostel: HostelSelection | null, onReset: () => void }) {
  const [leaderboard, setLeaderboard] = useState<HostelDoc[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{ [key: string]: 'success' | 'error' | null }>({});

  useEffect(() => {
    fetch('/api/hostels/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setLeaderboard(data))
      .catch(() => {});
  }, []);

  const handleReport = async (type: string, label: string) => {
    if (!hostel) return;
    setIsSubmitting(label);
    try {
      const res = await fetch('/api/hostels/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostelId: hostel.id || 'custom-entry',
          hostelName: hostel.name,
          type,
          message: `Reported via Student Dashboard: ${label} (Custom Hostel: ${hostel.isCustom ? 'Yes' : 'No'})`
        })
      });
      if (res.ok) {
        setSubmitStatus(prev => ({ ...prev, [label]: 'success' }));
        setTimeout(() => setSubmitStatus(prev => ({ ...prev, [label]: null })), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus(prev => ({ ...prev, [label]: 'error' }));
      setTimeout(() => setSubmitStatus(prev => ({ ...prev, [label]: null })), 3000);
    } finally {
      setIsSubmitting(null);
    }
  };

  if (!hostel) return null;

  const isCustom = 'isCustom' in hostel && hostel.isCustom;
  const hostelRank = isCustom ? 0 : leaderboard.findIndex(h => h.id === hostel.id) + 1;
  const totalWaste = isCustom ? 0 : (hostel as HostelDoc).totalWasteRecycled || 0;

  return (
    <div className="space-y-10 py-6">
      
      {/* Verification Notice for Custom Hostels */}
      {isCustom && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-900/5"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Lock className="h-6 w-6 text-amber-500" />
             </div>
             <div>
                <h4 className="font-black text-slate-900">Verification Pending</h4>
                <p className="text-sm text-slate-500 font-medium">This hub was created manually. To unlock real-time campus stats, ask your manager to register officially.</p>
             </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl border-amber-200 text-amber-700 font-bold hover:bg-amber-100/50 shrink-0"
            onClick={() => {
                const managerSection = document.getElementById("manager-portal");
                if (managerSection) managerSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Show Manager Plans
          </Button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            {isCustom ? "Manual Hub Active" : "Verified Session"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Welcome to {hostel.name}
          </h1>
          <p className="text-slate-500 font-semibold flex items-center gap-1.5 mt-2 text-lg">
            <MapPin className="h-5 w-5 text-slate-400" /> {hostel.location || "Location pending"}
          </p>
        </motion.div>
        
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset}
          className="rounded-2xl font-bold text-slate-500 border-2 border-slate-200 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm"
        >
          <LogOut className="h-5 w-5 mr-2" /> Change Hostel
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Actions & Stats */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden border-2 group">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-amber-500 mb-3 group-hover:scale-110 transition-transform origin-left">
                        <Trophy className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Campus Rank</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900 leading-none">
                      {hostelRank > 0 ? `#${hostelRank}` : "—"}
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase">out of {Math.max(leaderboard.length, 1)} hubs</p>
                </CardContent>
             </Card>
             <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden border-2 group">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-green-600 mb-3 group-hover:scale-110 transition-transform origin-left">
                        <Recycle className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Our Impact</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900 leading-none">
                      {totalWaste.toLocaleString()} <span className="text-xl">kg</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase tracking-wide">recycled to date</p>
                </CardContent>
             </Card>
             <Card className="rounded-[2rem] border-slate-200 shadow-xl shadow-slate-200/40 bg-white overflow-hidden border-2 max-sm:col-span-2 group">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-blue-500 mb-3 group-hover:scale-110 transition-transform origin-left">
                        <Clock className="h-5 w-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Next Pickup</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Syncing Schedule...</p>
                    <p className="text-[11px] text-slate-400 font-bold mt-2 uppercase">Awaiting Manager setup</p>
                </CardContent>
             </Card>
          </div>

          {/* Action Grid */}
          <div className="space-y-6 pt-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Need help? Quick Alerts.</h3>
            <div className="grid sm:grid-cols-3 gap-5">
               {[
                 { 
                   id: 'full_bin', 
                   label: 'Bin is Full', 
                   desc: 'Notify team for collection',
                   icon: <Trash2 className="h-7 w-7" />,
                   color: 'bg-red-50 text-red-600 border-red-100 hover:border-red-400 hover:bg-red-100/50' 
                 },
                 { 
                   id: 'missing_bin', 
                   label: 'Missing Bin', 
                   desc: 'Request bin replacement',
                   icon: <AlertTriangle className="h-7 w-7" />,
                   color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-400 hover:bg-amber-100/50' 
                 },
                 { 
                   id: 'other', 
                   label: 'Report Issue', 
                   desc: 'Other mess or missed pickup',
                   icon: <HelpCircle className="h-7 w-7" />,
                   color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-400 hover:bg-blue-100/50' 
                 },
               ].map((action) => (
                 <button
                    key={action.id}
                    disabled={isSubmitting !== null}
                    onClick={() => handleReport(action.id, action.label)}
                    className={`flex flex-col items-center text-center p-8 rounded-[2.5rem] border-2 transition-all group relative overflow-hidden shadow-sm ${action.color}`}
                 >
                    <div className="mb-4 p-4 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <span className="font-black text-xl mb-1.5">{action.label}</span>
                    <span className="text-[11px] opacity-80 font-bold uppercase tracking-wider">{action.desc}</span>
                    
                    {/* Status Overlays */}
                    {isSubmitting === action.label && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                        <Loader2 className="h-8 w-8 animate-spin text-slate-800" />
                      </div>
                    )}
                    {submitStatus[action.label] === 'success' && (
                       <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-green-600 flex flex-col items-center justify-center text-white p-4 z-20"
                       >
                         <CheckCircle2 className="h-10 w-10 mb-2" />
                         <span className="text-xs font-black uppercase tracking-[0.2em]">Sent!</span>
                       </motion.div>
                    )}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Leaderboard */}
        <div className="lg:col-span-4 h-full">
           <Card className="rounded-[2.5rem] border-slate-200 border-2 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white h-full sticky top-4">
              <CardHeader className="bg-slate-50 border-b border-slate-100 py-6 px-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Campus Board
                  </CardTitle>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Rankings</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200 animate-pulse" />
              </CardHeader>
              <CardContent className="p-0">
                 <ul className="divide-y divide-slate-100">
                    {leaderboard.length === 0 ? (
                      <div className="p-12 text-center">
                         <Loader2 className="h-8 w-8 animate-spin text-slate-200 mx-auto mb-3" />
                         <p className="text-xs font-bold text-slate-300 tracking-wider">Syncing Rankings...</p>
                      </div>
                    ) : leaderboard.slice(0, 10).map((h, i) => (
                        <li key={h.id} className={`py-5 px-8 flex items-center justify-between hover:bg-slate-50 transition-colors border-l-4 ${h.id === hostel.id ? 'bg-green-50/50 border-green-500' : 'border-transparent'}`}>
                           <div className="flex items-center gap-4">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-slate-300 text-slate-700' : i === 2 ? 'bg-amber-400 text-amber-900' : 'bg-slate-100 text-slate-400'}`}>
                                {i + 1}
                              </span>
                              <div>
                                 <p className={`text-[15px] font-black leading-tight ${h.id === hostel.id ? 'text-green-900' : 'text-slate-800'}`}>
                                    {h.name} {h.id === hostel.id && "⚡"}
                                 </p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{h.location}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-base font-black text-slate-700 leading-tight">{h.points?.toLocaleString()}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">PTS</p>
                           </div>
                        </li>
                    ))}
                    
                    {/* If Custom Hub, show a visual placeholder for 'you' in the future */}
                    {isCustom && (
                        <li className="py-6 px-8 bg-slate-50 border-emerald-200 border-l-4 border-dashed">
                           <div className="flex flex-col items-center text-center">
                              <Sparkles className="h-5 w-5 text-emerald-500 mb-2" />
                              <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">Your entry: {hostel.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-2 leading-tight italic">Be the first to bring Green Loop to your campus. Register below.</p>
                           </div>
                        </li>
                    )}
                 </ul>
                 <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Green Loop Network</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
