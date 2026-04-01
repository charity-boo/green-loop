"use client";

import { MapPin } from "lucide-react";
import { CollectorTask } from "@/types";
import { useMemo } from "react";

interface InteractiveMapProps {
    tasks?: CollectorTask[];
    activeTasks?: CollectorTask[];
    focusedTask?: CollectorTask | null;
    height?: string;
}

export default function InteractiveMap({ activeTasks = [], focusedTask = null, height = "600px" }: InteractiveMapProps) {
    // Determine the map center and query
    const activeJob = useMemo(() => 
        focusedTask || activeTasks.find(t => t.status === 'active'), 
    [activeTasks, focusedTask]);

    const mapQuery = useMemo(() => {
        if (activeJob?.coordinates) {
            return `${activeJob.coordinates.latitude},${activeJob.coordinates.longitude}`;
        }
        if (activeJob?.location) {
            return encodeURIComponent(activeJob.location + ", Ndagani, Kenya");
        }
        return encodeURIComponent("Ndagani, Chuka, Kenya");
    }, [activeJob]);

    const zoomLevel = activeJob ? 16 : 14;

    return (
        <div className="space-y-4">
            <div 
                className="rounded-2xl overflow-hidden border border-border relative shadow-sm bg-muted/30 group transition-all hover:border-emerald-200"
                style={{ height }}
            >
                <iframe
                    title="Collection Map"
                    src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
                    className="w-full h-full border-0 transition-all duration-700 opacity-90 group-hover:opacity-100"
                    allowFullScreen
                    loading="lazy"
                />
                
                {/* Map Overlays */}
                <div className="absolute top-6 left-6 flex flex-col gap-3">
                    <div className="bg-card/90 backdrop-blur-md px-5 py-2.5 rounded-xl border border-border flex items-center gap-3 shadow-xl">
                        <MapPin size={18} className="text-emerald-600 animate-bounce" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">Current Focus</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                                {activeJob ? "Active Pickup Location" : "Ndagani Sector Overview"}
                            </span>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-600/95 backdrop-blur-md px-5 py-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-3 shadow-xl">
                        <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                        <div className="flex flex-col text-white">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/40 leading-none mb-1">Open Tasks</span>
                            <span className="text-xs font-bold uppercase tracking-widest">{activeTasks.length} Identified</span>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-6 left-6 pointer-events-none">
                    <div className="bg-background/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-border flex items-center gap-2 shadow-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                        <span className="text-[9px] font-bold text-foreground uppercase tracking-widest">
                            GPS Uplink Active
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
