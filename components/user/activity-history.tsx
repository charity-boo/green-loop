"use client";

import React from "react";
import { motion } from "framer-motion";
import { PickupHistoryItem } from "@/types";
import { WasteStatus } from "@/types/waste-status";
import { Calendar, MapPin, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ActivityHistoryProps {
    history: PickupHistoryItem[];
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
    [WasteStatus.Completed]: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Completed" },
    [WasteStatus.Pending]: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Scheduled" },
    [WasteStatus.Skipped]: { icon: AlertCircle, color: "text-slate-400", bg: "bg-slate-50", label: "Skipped" },
    [WasteStatus.Active]: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Active" },
};

export default function ActivityHistory({ history }: ActivityHistoryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden h-full flex flex-col"
        >
            <div className="p-8 border-b border-slate-50">
                <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
                <p className="text-sm text-slate-500 font-medium">Your historical contributions to the loop</p>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[500px] p-4 lg:p-8 space-y-4">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Package className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-bold">No pickups yet</p>
                        <p className="text-sm">Your recycling journey starts here!</p>
                    </div>
                ) : (
                    history.map((item, idx) => {
                        const config = statusConfig[item.status as WasteStatus] || statusConfig[WasteStatus.Pending];
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + idx * 0.05 }}
                                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-slate-50/50 border border-transparent hover:border-emerald-200 hover:bg-white transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg} ${config.color}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{item.wasteType}</span>
                                            <span className="text-xs font-bold text-slate-400">• {item.weight} kg</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {item.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate max-w-[120px]">{item.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-none pt-4 sm:pt-0">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Points earned</p>
                                        <p className="text-lg font-black text-emerald-600">+{item.points}</p>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full ${config.bg} ${config.color} text-xs font-black uppercase tracking-widest`}>
                                        {config.label}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
