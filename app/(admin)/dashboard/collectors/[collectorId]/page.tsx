import { notFound } from "next/navigation";
import { getCollectorDetail, getCollectorSchedules } from "@/lib/admin/analytics";
import { subDays, format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, UserCircle, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import ScheduleTable from "./schedule-table";
import CollectorStatusToggle from "./collector-status-toggle";

interface PageProps {
    params: Promise<{ collectorId: string }>;
    searchParams: Promise<{
        page?: string;
        window?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function CollectorDetailPage({ params, searchParams }: PageProps) {
    const { collectorId } = await params;
    const {
        page: pageStr,
        window: windowStr,
        sortBy = "completionRate",
        sortOrder = "desc"
    } = await searchParams;

    // Window Sanitization (mirroring parent)
    const allowedWindows = ["7", "30", "90", "all"] as const;
    const window = allowedWindows.includes(windowStr as any)
        ? (windowStr as typeof allowedWindows[number])
        : "30";

    // Date Calculation
    let startDate: Date;
    const now = new Date();
    if (window === "7") startDate = subDays(now, 7);
    else if (window === "30") startDate = subDays(now, 30);
    else if (window === "90") startDate = subDays(now, 90);
    else startDate = new Date(0);

    // Fetch Details & Schedules in parallel
    const page = Math.max(Number(pageStr) || 1, 1);

    const [detail, schedules] = await Promise.all([
        getCollectorDetail(collectorId, { startDate }),
        getCollectorSchedules(collectorId, { startDate, page, limit: 10 })
    ]);

    if (!detail) {
        notFound();
    }

    // Colors
    const isIdle = detail.assigned === 0;
    const rateColor = isIdle ? "text-slate-400" :
        detail.completionRate >= 90 ? "text-emerald-600" :
            detail.completionRate >= 70 ? "text-amber-500" : "text-red-600";

    const bgRateColor = isIdle ? "bg-slate-50 border-slate-200" :
        detail.completionRate >= 90 ? "bg-emerald-50 border-emerald-200" :
            detail.completionRate >= 70 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

    const backUrl = `/dashboard/collectors?window=${window}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    return (
        <div className="space-y-6 max-w-5xl mx-auto align-top">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href={backUrl}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
                        aria-label="Back to collectors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 flex items-center gap-2">
                            {detail.name}
                            {!detail.active && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded border border-red-200 bg-red-50 text-red-600 uppercase tracking-wide">
                                    Inactive
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-slate-500">
                            {window === "all" ? "Lifetime Performance" : `Performance over the last ${window} days`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center mt-1">
                    <CollectorStatusToggle collectorId={collectorId} active={detail.active} />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className={`p-5 rounded-xl border flex flex-col justify-center ${bgRateColor}`}>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Completion Rate</span>
                    <span className={`text-3xl font-bold ${rateColor}`}>
                        {detail.completionRate}%
                    </span>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-slate-500">
                        <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{detail.assigned}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned</p>
                    </div>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{detail.completed}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</p>
                    </div>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-semibold text-slate-900">{detail.missed}</p>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Missed</p>
                    </div>
                </div>
            </div>

            {/* Schedule Table */}
            <div>
                <h2 className="text-lg font-medium text-slate-900 mb-4 px-1">Schedule History</h2>
                <ScheduleTable
                    data={schedules.data}
                    meta={{
                        currentPage: schedules.page,
                        totalPages: schedules.totalPages,
                        totalCount: schedules.total,
                        pageSize: schedules.limit
                    }}
                    baseUrl={`/dashboard/collectors/${collectorId}`}
                    searchParams={{
                        window,
                        sortBy,
                        sortOrder
                    }}
                />
            </div>
        </div>
    );
}
