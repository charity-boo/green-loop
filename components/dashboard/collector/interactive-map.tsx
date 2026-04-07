"use client";

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
