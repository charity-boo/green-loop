import { notFound } from "next/navigation";
import { getCollectorDetail, getCollectorSchedules } from "@/lib/firebase/services/analytics";
import { subDays } from "date-fns";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import ScheduleTable from "./schedule-table";
import CollectorStatusToggle from "./collector-status-toggle";

interface PageProps {
    params: Promise<{ collectorId: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function CollectorDetailPage({ params, searchParams }: PageProps) {
    const { collectorId } = await params;
    const { page: pageStr } = await searchParams;
    const page = Math.max(1, Number(pageStr) || 1);

    const now = new Date();
    const startDate = subDays(now, 30);

    const [detail, scheduleResult] = await Promise.all([
        getCollectorDetail(collectorId, { startDate }),
        getCollectorSchedules(collectorId, { page, limit: 10, startDate })
    ]);

    if (!detail) {
        notFound();
    }

    const meta = {
        currentPage: scheduleResult.page,
        totalPages: scheduleResult.totalPages,
        totalCount: scheduleResult.total
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumbs / Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link
                        href="/dashboard/collectors"
                        className="text-sm text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Performance
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">{detail.name}</h1>
                    <p className="text-slate-500">{detail.email}</p>
                </div>

                <div className="flex items-center gap-3">
                    <CollectorStatusToggle
                        collectorId={detail.collectorId}
                        active={detail.active}
                    />
                </div>
            </div>

            {/* Performance Snapshot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <CalendarDays className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Assigned</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{detail.assigned}</div>
                    <p className="text-xs text-slate-400 mt-1">Last 30 days</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{detail.completed}</div>
                    <p className="text-xs text-slate-400 mt-1">Confirmed pickups</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Missed</span>
                    </div>
                    <div className="text-2xl font-bold text-rose-600">{detail.missed}</div>
                    <p className="text-xs text-slate-400 mt-1">Operational gaps</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-slate-500">Overrides</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{detail.totalOverrides}</div>
                    <p className="text-xs text-slate-400 mt-1">{detail.overrideRatio}% impact ratio</p>
                </div>
            </div>

            {/* Schedule History Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h2 className="text-lg font-bold text-slate-900">Task History</h2>
                    <p className="text-sm text-slate-500 mt-1">Granular log of all collection activities for this period.</p>
                </div>
                <ScheduleTable data={scheduleResult.data} meta={meta} />
            </div>
        </div>
    );
}
