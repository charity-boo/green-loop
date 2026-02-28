"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PickupHistoryItem } from "@/types";
import { WasteStatus } from "@/lib/types/waste-status";
import { Scan, ChevronLeft, ChevronRight } from "lucide-react";

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

const PAGE_SIZE = 6;

export default function PickupTable({ history }: PickupTableProps) {
    const [page, setPage] = useState(0);
    const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
    const rows = history.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                    <h3 className="text-base font-black text-slate-900">Pickup History</h3>
                    <p className="text-xs text-slate-400 font-medium">{history.length} records</p>
                </div>
                <Link
                    href="/learning-hub"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
                >
                    <Scan className="h-4 w-4" />
                    Scan New Waste
                </Link>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Type</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                    No pickups yet — schedule your first one!
                                </td>
                            </tr>
                        ) : (
                            rows.map((item) => {
                                const sStyle = statusStyle[item.status] ?? statusStyle[WasteStatus.Pending];
                                const tStyle = typeStyle[item.wasteType] ?? "bg-slate-50 text-slate-700 border-slate-200";
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                            #{item.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium whitespace-nowrap">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold ${tStyle}`}>
                                                {item.wasteType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-bold ${sStyle}`}>
                                                {statusLabel[item.status] ?? item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black text-emerald-600">
                                            +{item.points}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
                    <span>Page {page + 1} of {totalPages}</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
