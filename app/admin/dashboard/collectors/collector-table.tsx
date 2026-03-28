"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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
    search?: string;
}

function getRateColor(c: CollectorPerformance) {
    if (c.assigned === 0) return "text-gray-400";
    if (c.completionRate >= 90) return "text-emerald-600";
    if (c.completionRate >= 70) return "text-amber-500 font-medium";
    return "text-red-600 font-medium";
}

export default function CollectorTable({ data, meta, sortBy, sortOrder, window, search }: Props) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search || "");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (search || "")) {
                const params = new URLSearchParams(window.location.search);
                if (searchTerm) {
                    params.set("search", searchTerm);
                } else {
                    params.delete("search");
                }
                params.set("page", "1"); // Reset to page 1 on search
                router.push(`?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, search, router]);

    function buildLink(params: Record<string, string | number>) {
        const newParams = new URLSearchParams(window.location.search);
        Object.entries(params).forEach(([key, value]) => {
            newParams.set(key, String(value));
        });
        return `?${newParams.toString()}`;
    }

    function buildSortLink(column: string) {
        const isActive = sortBy === column;
        const nextOrder = isActive && sortOrder === "asc" ? "desc" : "asc";
        return buildLink({ page: 1, sortBy: column, sortOrder: nextOrder });
    }

    return (
        <div className="bg-card rounded-xl shadow-sm p-6 space-y-4">
            {/* Filters & Search Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Window Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Timeframe:</span>
                    {["7", "30", "90", "all"].map((w) => (
                        <Link
                            key={w}
                            href={buildLink({ window: w, page: 1 })}
                            className={`text-xs px-3 py-1 rounded-full border transition-all ${window === w
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-card text-slate-600 border-border hover:border-slate-300 hover:bg-muted/50"
                                }`}
                        >
                            {w === "all" ? "Lifetime" : `${w}D`}
                        </Link>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search collectors..."
                        className="pl-9 pr-8 h-9 rounded-lg border-border focus-visible:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-left border-b font-medium text-muted-foreground">
                            <th className="py-2 px-4 focus-within:bg-muted/50">
                                <Link href={buildSortLink("name")} className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                                    Name
                                </Link>
                            </th>
                            <th className="px-4">
                                <Link href={buildSortLink("assigned")} className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                                    Assigned
                                </Link>
                            </th>
                            <th className="px-4 cursor-default">Completed</th>
                            <th className="px-4">
                                <Link href={buildSortLink("missed")} className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                                    Missed
                                </Link>
                            </th>
                            <th className="px-4 text-right">
                                <Link href={buildSortLink("completionRate")} className="hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                                    Rate (%)
                                </Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((c) => (
                            <tr key={c.collectorId} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-4 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/collectors/${c.collectorId}?window=${window}&sortBy=${sortBy}&sortOrder=${sortOrder}`}
                                            className="text-emerald-700 hover:text-emerald-800 hover:underline"
                                        >
                                            {c.name}
                                        </Link>
                                        {c.completionRate < 70 && c.assigned >= 5 && (
                                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border border-amber-200 bg-amber-50 text-amber-700">
                                                Under Review
                                            </span>
                                        )}
                                    </div>
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
                                    No collector data found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t gap-4">
                <p className="text-xs text-slate-400 font-medium">
                    Showing <span className="text-foreground">{data.length}</span> of <span className="text-foreground">{meta.totalCount}</span> collectors
                </p>

                <div className="flex items-center gap-3">
                    <Link
                        href={buildLink({ page: Math.max(meta.currentPage - 1, 1) })}
                        className={`px-4 py-2 text-sm font-bold rounded-xl border bg-card text-slate-700 hover:bg-muted/50 transition-all ${meta.currentPage <= 1 ? "opacity-50 pointer-events-none cursor-not-allowed" : "shadow-sm active:scale-95"
                            }`}
                        aria-disabled={meta.currentPage <= 1}
                    >
                        Previous
                    </Link>

                    <span className="text-sm font-bold text-slate-600 bg-muted/50 px-3 py-1.5 rounded-lg border border-border">
                        {meta.currentPage} <span className="text-slate-400 font-medium px-1">/</span> {meta.totalPages || 1}
                    </span>

                    <Link
                        href={buildLink({ page: meta.currentPage + 1 })}
                        className={`px-4 py-2 text-sm font-bold rounded-xl border bg-card text-slate-700 hover:bg-muted/50 transition-all ${meta.currentPage >= meta.totalPages || meta.totalPages === 0
                            ? "opacity-50 pointer-events-none cursor-not-allowed"
                            : "shadow-sm active:scale-95"
                            }`}
                        aria-disabled={meta.currentPage >= meta.totalPages || meta.totalPages === 0}
                    >
                        Next
                    </Link>
                </div>
            </div>
        </div>
    );
}
