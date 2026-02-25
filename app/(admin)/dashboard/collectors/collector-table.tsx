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
}

export default function CollectorTable({ data, meta }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-2 px-4">Name</th>
                        <th className="px-4">Assigned</th>
                        <th className="px-4">Completed</th>
                        <th className="px-4">Missed</th>
                        <th className="px-4 text-right">Rate (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((c) => (
                        <tr key={c.collectorId} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 font-medium">{c.name}</td>
                            <td className="px-4">{c.assigned}</td>
                            <td className="px-4">{c.completed}</td>
                            <td className="px-4">{c.missed}</td>
                            <td className="px-4 text-right">{c.completionRate}%</td>
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
                    href={`?page=${Math.max(meta.currentPage - 1, 1)}`}
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
                    href={`?page=${meta.currentPage + 1}`}
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
