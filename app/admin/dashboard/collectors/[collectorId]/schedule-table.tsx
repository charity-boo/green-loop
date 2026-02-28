"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useTransition } from "react";
import { overrideScheduleStatus } from "./actions";

type Status = "PENDING" | "COMPLETED" | "MISSED";

interface CollectorSchedule {
    id: string;
    date: Date | string;
    status: Status;
    wasteType: string;
    wasteVolume: number;
}

interface Meta {
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

interface Props {
    data: CollectorSchedule[];
    meta: Meta;
    baseUrl?: string;
    searchParams?: {
        window?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

function StatusOverrideButton({ scheduleId, status }: { scheduleId: string; status: Status }) {
    const [isPending, startTransition] = useTransition();

    if (status !== "MISSED" && status !== "COMPLETED") return null;

    const newStatus = status === "MISSED" ? "COMPLETED" : "MISSED";
    const label = status === "MISSED" ? "Mark Completed" : "Mark Missed";

    const handleOverride = () => {
        const reason = window.prompt(`Mandatory: Why are you overriding this status to ${newStatus}? (min 10 characters):`);

        if (reason === null) return; // Cancelled

        if (reason.trim().length < 10) {
            alert("Error: Governance policy requires a descriptive intent (min 10 chars) to override immutable operational data.");
            return;
        }

        if (confirm(`Confirm audit log entry: Mark as ${newStatus}?`)) {
            startTransition(async () => {
                const res = await overrideScheduleStatus(scheduleId, newStatus, reason);
                if (!res.success) {
                    alert(res.error || "Failed to override.");
                }
            });
        }
    };

    return (
        <button
            onClick={handleOverride}
            disabled={isPending}
            className={`text-xs font-medium px-2 py-1 rounded transition-colors disabled:opacity-50 ${status === "MISSED" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
        >
            {isPending ? "..." : label}
        </button>
    );
}

export default function ScheduleTable({ data, meta, baseUrl = "", searchParams = {} }: Props) {
    const buildLink = (page: number) => {
        let qs = `?page=${page}`;
        if (searchParams.window) qs += `&window=${searchParams.window}`;
        if (searchParams.sortBy) qs += `&sortBy=${searchParams.sortBy}`;
        if (searchParams.sortOrder) qs += `&sortOrder=${searchParams.sortOrder}`;
        return `${baseUrl}${qs}`;
    };

    const statusColors: Record<Status, string> = {
        PENDING: "bg-slate-100 text-slate-700 border-slate-200",
        COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
        MISSED: "bg-red-100 text-red-800 border-red-200"
    };

    return (
        <div className="bg-white rounded-xl shadow-sm space-y-4">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="text-left border-b font-medium text-slate-500 bg-slate-50 rounded-t-xl">
                        <th className="py-3 px-6 rounded-tl-xl w-1/4">Date</th>
                        <th className="py-3 px-6 w-1/4">Status</th>
                        <th className="py-3 px-6 w-1/4">Waste Type</th>
                        <th className="py-3 px-6 text-right w-1/5">Volume (kg)</th>
                        <th className="py-3 px-6 text-right w-1/5 rounded-tr-xl">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-6 font-medium text-slate-900 border-r border-slate-100">
                                {format(new Date(s.date), "MMM d, yyyy h:mm a")}
                            </td>
                            <td className="py-4 px-6 border-r border-slate-100">
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[s.status] || statusColors.PENDING}`}>
                                    {s.status}
                                </span>
                            </td>
                            <td className="py-4 px-6 border-r border-slate-100">
                                {s.wasteType}
                            </td>
                            <td className="py-4 px-6 text-right font-medium text-slate-900 border-r border-slate-100">
                                {Number(s.wasteVolume).toFixed(2)}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <StatusOverrideButton scheduleId={s.id} status={s.status} />
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-500 italic">
                                No schedules found for this timeframe.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-slate-50 rounded-b-xl">
                <Link
                    href={buildLink(Math.max(meta.currentPage - 1, 1))}
                    className={`px-4 py-2 text-sm font-medium rounded-md border bg-white text-slate-700 hover:bg-slate-50 transition-colors ${meta.currentPage <= 1 ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                        }`}
                    aria-disabled={meta.currentPage <= 1}
                >
                    Previous
                </Link>

                <span className="text-sm font-medium text-slate-600">
                    Page {meta.currentPage} of {Math.max(meta.totalPages, 1)}
                </span>

                <Link
                    href={buildLink(meta.currentPage + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border bg-white text-slate-700 hover:bg-slate-50 transition-colors ${meta.currentPage >= meta.totalPages || meta.totalPages === 0
                        ? "opacity-50 pointer-events-none cursor-not-allowed"
                        : ""
                        }`}
                    aria-disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0}
                >
                    Next
                </Link>
            </div>
        </div>
    );
}
