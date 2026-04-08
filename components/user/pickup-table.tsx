"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PickupHistoryItem } from "@/types";
import { WasteStatus } from "@/types/waste-status";
import { Scan, XCircle, Loader2 } from "lucide-react";
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
    [WasteStatus.Cancelled]: "Cancelled",
    assigned: "Active",
};

const statusStyle: Record<string, string> = {
    [WasteStatus.Completed]: "bg-green-50 text-green-700 border-green-200",
    [WasteStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-200",
    [WasteStatus.Skipped]: "bg-slate-100 text-slate-500 border-slate-200",
    [WasteStatus.Active]: "bg-blue-50 text-blue-700 border-blue-200",
    [WasteStatus.Cancelled]: "bg-red-50 text-red-600 border-red-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
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
    const router = useRouter();
    const [reclassifyingIds, setReclassifyingIds] = useState<Set<string>>(new Set());
    const [cancellingIds, setCancellingIds] = useState<Set<string>>(new Set());

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

    const handleCancel = useCallback(async (scheduleId: string) => {
        if (!confirm("Are you sure you want to cancel this pickup?")) return;

        setCancellingIds((prev) => new Set(prev).add(scheduleId));
        try {
            const res = await fetch("/api/schedule-pickup", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ scheduleId }),
            });

            if (res.ok) {
                router.refresh();
            } else {
                const error = await res.json();
                alert(error.error || "Failed to cancel pickup");
            }
        } catch (error) {
            console.error("Error cancelling pickup:", error);
            alert("An error occurred while cancelling the pickup");
        } finally {
            setCancellingIds((prev) => {
                const next = new Set(prev);
                next.delete(scheduleId);
                return next;
            });
        }
    }, [router]);

    return (
        <div className="bg-white flex flex-col min-h-[300px]">
            {/* Header */}
            <div className="flex items-center justify-between py-6 border-b border-slate-100 flex-shrink-0 bg-white">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Pickup History</h3>
                    <p className="text-xs text-slate-500 mt-1">{history.length} total records</p>
                </div>
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
                                        <td className="py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-bold text-sm">
                                                    {item.date && item.date !== 'N/A' 
                                                        ? new Date(item.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric'
                                                        }) 
                                                        : 'N/A'}
                                                </span>
                                                <span className="text-slate-400 text-[10px] font-medium">
                                                    {item.date && item.date !== 'N/A' 
                                                        ? new Date(item.date).toLocaleDateString('en-US', { 
                                                            year: 'numeric'
                                                        }) 
                                                        : ''}
                                                </span>
                                            </div>
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
                                        <td className="py-6 text-right font-bold text-green-600">
                                            +{item.points}
                                        </td>
                                        <td className="py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.paymentStatus === "Unpaid" && 
                                                (item.status === WasteStatus.Pending || item.status === WasteStatus.Active) && (
                                                    <PaymentButton wasteId={item.id} amount={item.price ?? 5} />
                                                )}
                                                {(item.status === WasteStatus.Pending || item.status === WasteStatus.Active) && (
                                                    <button
                                                        onClick={() => handleCancel(item.id)}
                                                        disabled={cancellingIds.has(item.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                                                        title="Cancel Pickup"
                                                    >
                                                        {cancellingIds.has(item.id) ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
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
