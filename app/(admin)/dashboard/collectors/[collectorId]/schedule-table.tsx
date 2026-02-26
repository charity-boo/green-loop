"use client";

import Link from "next/link";
import { format } from "date-fns";

type Status = "PENDING" | "COMPLETED" | "MISSED";

interface CollectorSchedule {
    id: string;
    date: Date;
    status: Status;
    wasteType: string;
    wasteVolume: number;
}

interface Meta {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface Props {
    data: CollectorSchedule[];
    meta: Meta;
    baseUrl: string;
    searchParams: {
        window?: string;
        sortBy?: string;
        sortOrder?: string;
    };
}

export default function ScheduleTable({ data, meta, baseUrl, searchParams }: Props) {
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
                        <th className="py-3 px-6 text-right w-1/4 rounded-tr-xl">Volume (kg)</th>
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
                            <td className="py-4 px-6 text-right font-medium text-slate-900">
                                {Number(s.wasteVolume).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-500 italic">
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
