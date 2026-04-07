'use client';

import { motion } from "framer-motion";
import { Trophy, Calendar, Clock, Bell, Truck, Zap, Star, Sparkles, MapPin } from "lucide-react";

export function StaticStudentHub() {
  const topHostels = [
    { id: "1", name: "Sunset Gardens", location: "Ndagani West", points: 12450, rank: 1 },
    { id: "2", name: "Elite Heights", location: "Upper Campus", points: 11200, rank: 2 },
    { id: "3", name: "Green Park", location: "Riverside", points: 9800, rank: 3 },
  ];

  const schedule = [
    { zone: "Ndagani West", day: "Monday & Thursday", time: "8:00 AM" },
    { zone: "Upper Campus", day: "Tuesday & Friday", time: "7:30 AM" },
    { zone: "Riverside Area", day: "Wednesday & Saturday", time: "9:00 AM" },
  ];

  return (
    <div className="space-y-16">
      {/* Feature Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Schedule & Awareness */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] border-2 border-green-50 p-8 md:p-12 shadow-2xl shadow-green-100/50">
            <div className="mb-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest mb-4">
                <Calendar className="w-3.5 h-3.5" /> Stay Informed
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-green-950 mb-4 tracking-tight">Campus Collection Schedule</h3>
              <p className="text-green-800/60 font-medium text-lg">
                Waste collection is managed by property managers. Check your zone below to know when to have your sorted bags ready.
              </p>
            </div>
            
            <div className="space-y-4">
              {schedule.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-green-50/30 rounded-3xl border border-green-50 group hover:bg-green-100/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Truck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-black text-green-900">{item.zone}</p>
                      <p className="text-xs text-green-600/60 font-bold uppercase tracking-wider">{item.day}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-green-700/60 justify-end">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-sm font-bold">{item.time}</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-black uppercase tracking-widest mt-1 block">Regular Pickup</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 grid grid-cols-2 gap-4">
               {[
                 { icon: <Bell className="text-green-600" />, label: "Get Notified", desc: "Via campus boards" },
                 { icon: <Star className="text-green-500" />, label: "Track Stats", desc: "Live hostel impact" },
               ].map((benefit, i) => (
                 <div key={i} className="flex flex-col items-center text-center p-6 bg-green-50/30 rounded-3xl border border-green-50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3">
                      {benefit.icon}
                    </div>
                    <p className="font-black text-green-900 text-sm">{benefit.label}</p>
                    <p className="text-[10px] text-green-600/50 font-bold uppercase tracking-wider mt-1">{benefit.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Leaderboard Preview */}
        <div className="lg:col-span-5">
           <div className="bg-green-900 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/20 text-white">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black tracking-tight text-white">Live Rankings</h4>
                  <p className="text-xs font-bold text-green-400 uppercase tracking-widest mt-1">Campus-wide Board</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              </div>
              
              <div className="divide-y divide-white/5">
                {topHostels.map((h, i) => (
                  <div key={h.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        i === 0 ? 'bg-green-400 text-green-950' : 
                        i === 1 ? 'bg-green-100 text-green-900' : 
                        'bg-green-800 text-green-100'
                      }`}>
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-black text-[15px] text-white">{h.name}</p>
                        <p className="text-[10px] text-green-100/40 font-bold uppercase tracking-wider mt-0.5">{h.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-green-400">{h.points.toLocaleString()}</p>
                      <p className="text-[9px] text-green-100/30 font-black uppercase tracking-[0.2em]">Points</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-8 bg-white/5 text-center">
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-green-100/60">
                    Hostel Points Updated Daily
                 </p>
              </div>
           </div>
           
           <div className="mt-8 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                <Zap className="h-6 w-6 text-green-600 fill-green-600" />
              </div>
              <p className="text-sm font-bold text-green-900">
                Over <span className="text-lg">4,200</span> students active this week in Ndagani.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
