"use client";

import { Navigation } from "lucide-react";
import { CollectorTask } from "@/types";

interface TacticalMapProps {
    tasks: CollectorTask[];
    activeTasks: CollectorTask[];
}

export default function TacticalMap({ tasks, activeTasks }: TacticalMapProps) {
    return (
        <div className="space-y-6">
            <div className="rounded-[2.5rem] overflow-hidden border border-border h-[600px] relative shadow-inner bg-slate-50">
                <iframe
                    title="Operational Map"
                    src="https://maps.google.com/maps?q=Ndagani,Chuka,Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                    allowFullScreen
                    loading="lazy"
                />
                
                {/* Tactical Overlays */}
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                    <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                        <Navigation size={18} className="text-emerald-400 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Navigation status</span>
                            <span className="text-xs font-black uppercase tracking-widest text-white">Live Tactical Overlay</span>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-600/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                        <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Active targets</span>
                            <span className="text-xs font-black uppercase tracking-widest text-white">{activeTasks.length} Identified</span>
                        </div>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute bottom-8 right-8 pointer-events-none opacity-20">
                    <div className="text-[8px] font-black text-slate-900 uppercase tracking-[0.4em] text-right">
                        System_Version_4.2.0<br />
                        Ndagani_Sector_Alpha
                    </div>
                </div>
            </div>
        </div>
    );
}
