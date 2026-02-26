"use client";

import Link from "next/link";

interface CollectorPerformance {
    collectorId: string;
    name: string;
    assigned: number;
    completed: number;
    missed: number;
    completionRate: number;
}

interface Meta {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface Props {
    data: CollectorPerformance[];
    meta: Meta;
    sortBy: string;
    sortOrder: "asc" | "desc";
    window: "7" | "30" | "90" | "all";
}

function getRateColor(c: CollectorPerformance) {
    if (c.assigned === 0) return "text-gray-400";
    if (c.completionRate >= 90) return "text-emerald-600";
    if (c.completionRate >= 70) return "text-amber-500 font-medium";
    return "text-red-600 font-medium";
}

export default function CollectorTable({ data, meta, sortBy, sortOrder, window }: Props) {
    function buildSortLink(column: string) {
        const isActive = sortBy === column;
        const nextOrder = isActive && sortOrder === "asc" ? "desc" : "asc";
        return `?page=1&sortBy=${column}&sortOrder=${nextOrder}&window=${window}`;
    }

    const paginationLink = (newPage: number) => {
        return `?page=${newPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&window=${window}`;
    };

    function buildWindowLink(w: string) {
        return `?page=1&sortBy=${sortBy}&sortOrder=${sortOrder}&window=${w}`;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            {/* Window Selector */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Timeframe:</span>
                {["7", "30", "90", "all"].map((w) => (
                    <Link
                        key={w}
                        href={buildWindowLink(w)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${window === w
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                    >
                        {w === "all" ? "Lifetime" : `${w}D`}
                    </Link>
                ))}
            </div>

            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="text-left border-b font-medium text-slate-500">
                        <th className="py-2 px-4 focus-within:bg-slate-50">
                            <Link href={buildSortLink("name")} className="hover:text-slate-900 transition-colors inline-flex items-center gap-1 group">
                                Name
                            </Link>
                        </th>
                        <th className="px-4">
                            <Link href={buildSortLink("assigned")} className="hover:text-slate-900 transition-colors inline-flex items-center gap-1 group">
                                Assigned
                            </Link>
                        </th>
                        <th className="px-4 cursor-default">Completed</th>
                        <th className="px-4">
                            <Link href={buildSortLink("missed")} className="hover:text-slate-900 transition-colors inline-flex items-center gap-1 group">
                                Missed
                            </Link>
                        </th>
                        <th className="px-4 text-right">
                            <Link href={buildSortLink("completionRate")} className="hover:text-slate-900 transition-colors inline-flex items-center gap-1 group">
                                Rate (%)
                            </Link>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((c) => (
                        <tr key={c.collectorId} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium">
                                <Link
                                    href={`/dashboard/collectors/${c.collectorId}?window=${window}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                                    className="text-emerald-700 hover:text-emerald-800 hover:underline"
                                >
                                    {c.name}
                                </Link>
                            </td>
                            <td className="px-4">{c.assigned}</td>
                            <td className="px-4">{c.completed}</td>
                            <td className="px-4">{c.missed}</td>
                            <td className={`px-4 text-right ${getRateColor(c)}`}>
                                {c.completionRate}%
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                                No collector data found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center pt-4 border-t">
                <Link
                    href={paginationLink(Math.max(meta.currentPage - 1, 1))}
                    className={`px-4 py-2 text-sm font-medium rounded-md border bg-white text-gray-700 hover:bg-gray-50 transition-colors ${meta.currentPage <= 1 ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
                        }`}
                    aria-disabled={meta.currentPage <= 1}
                >
                    Previous
                </Link>

                <span className="text-sm font-medium text-gray-600">
                    Page {meta.currentPage} of {meta.totalPages || 1}
                </span>

                <Link
                    href={paginationLink(meta.currentPage + 1)}
                    className={`px-4 py-2 text-sm font-medium rounded-md border bg-white text-gray-700 hover:bg-gray-50 transition-colors ${meta.currentPage >= meta.totalPages || meta.totalPages === 0
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
