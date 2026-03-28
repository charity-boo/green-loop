"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PickupHistoryItem } from "@/types";
import { WasteStatus } from "@/types/waste-status";
import { Scan } from "lucide-react";
import PaymentButton from "@/components/user/payment-button";
import ClassificationBadge from "@/components/user/classification-badge";

interface PickupTableProps {
    history: PickupHistoryItem[];
}

const statusLabel: Record<string, string> = {
    [WasteStatus.Completed]: "Recycled",
    [WasteStatus.Pending]: "Pending",
    [WasteStatus.Skipped]: "Skipped",
    [WasteStatus.Active]: "Active",
    [WasteStatus.Collected]: "Collected",
    cancelled: "Cancelled",
};

const statusStyle: Record<string, string> = {
    [WasteStatus.Completed]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [WasteStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-200",
    [WasteStatus.Skipped]: "bg-slate-100 text-slate-500 border-slate-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
};

const typeStyle: Record<string, string> = {
    Organic: "bg-lime-50 text-lime-700 border-lime-200",
    Plastic: "bg-blue-50 text-blue-700 border-blue-200",
    Paper: "bg-sky-50 text-sky-700 border-sky-200",
    Glass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Metal: "bg-slate-50 text-slate-700 border-slate-200",
    Hazardous: "bg-red-50 text-red-700 border-red-200",
};

export default function PickupTable({ history }: PickupTableProps) {
    const [reclassifyingIds, setReclassifyingIds] = useState<Set<string>>(new Set());

    const handleReclassify = useCallback(async (scheduleId: string) => {
        setReclassifyingIds((prev) => new Set(prev).add(scheduleId));
        try {
            await fetch('/api/schedule-pickup/reclassify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduleId }),
            });
        } finally {
            // Cloud Function will update classificationStatus; optimistically keep spinner
            // until the next dashboard refresh clears it
        }
    }, []);

    return (
        <div className="bg-white flex flex-col min-h-[300px]">
            {/* Header */}
            <div className="flex items-center justify-between py-6 border-b border-slate-100 flex-shrink-0 bg-white">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Pickup History</h3>
                    <p className="text-xs text-slate-500 mt-1">{history.length} total records</p>
                </div>
                <Link
                    href="/schedule-pickup"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all active:scale-95"
                >
                    <Scan className="h-4 w-4" />
                    New Scan
                </Link>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto py-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-slate-400 text-xs font-medium border-b border-slate-50">
                            <th className="py-4 text-left font-semibold">ID</th>
                            <th className="py-4 text-left font-semibold">Date</th>
                            <th className="py-4 text-left font-semibold">Type</th>
                            <th className="py-4 text-left font-semibold">AI Classification</th>
                            <th className="py-4 text-left font-semibold">Status</th>
                            <th className="py-4 text-right font-semibold">Points</th>
                            <th className="py-4 text-right font-semibold">Payment</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {history.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 rounded-full bg-slate-50 text-slate-300">
                                            <Scan className="h-8 w-8" />
                                        </div>
                                        <p className="text-slate-400 text-sm font-medium">No pickups yet — schedule your first one!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            history.map((item) => {
                                const sStyle = statusStyle[item.status] ?? statusStyle[WasteStatus.Pending];
                                const tStyle = typeStyle[item.wasteType] ?? "bg-slate-50 text-slate-700 border-slate-200";
                                return (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 font-mono text-[10px] text-slate-400">
                                            #{item.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="py-6 text-slate-700 font-medium whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="py-6">
                                            <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tight ${tStyle}`}>
                                                {item.wasteType}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <ClassificationBadge
                                                scheduleId={item.id}
                                                aiWasteType={item.aiWasteType}
                                                disposalTips={item.disposalTips}
                                                classificationStatus={item.classificationStatus}
                                                canReclassify
                                                onReclassify={handleReclassify}
                                                reclassifying={reclassifyingIds.has(item.id)}
                                            />
                                        </td>
                                        <td className="py-6">
                                            <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tight ${sStyle}`}>
                                                {statusLabel[item.status] ?? item.status}
                                            </span>
                                        </td>
                                        <td className="py-6 text-right font-bold text-emerald-600">
                                            +{item.points}
                                        </td>
                                        <td className="py-6 text-right">
                                            {item.paymentStatus === "Paid" ? (
                                                <span className="inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tight bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    Paid
                                                </span>
                                            ) : (
                                                <PaymentButton wasteId={item.id} amount={item.price ?? 5} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
