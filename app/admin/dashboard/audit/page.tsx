import React from 'react';
import { dbService } from '@/lib/firebase/services/db';
import { format } from 'date-fns';
import { ShieldAlert, AlertTriangle, TrendingUp, AlertOctagon, UserX } from 'lucide-react';
import { getAnomalyMetrics } from '@/lib/firebase/services/analytics';
import { GOVERNANCE_LIMITS } from '@/lib/constants/governance';
import { AdminActionLogDoc, UserDoc } from '@/lib/types/firestore';

// Helper to safely render JSON changes
function StateDelta({ before, after }: { before: Record<string, unknown> | null | undefined, after: Record<string, unknown> | null | undefined }) {
    if (!before && !after) return <span className="text-slate-400 italic">None</span>;
    return (
        <div className="flex flex-col gap-1 font-mono text-xs">
            {before && (
                <div className="text-slate-500 line-through truncate max-w-[200px]" title={JSON.stringify(before)}>
                    {JSON.stringify(before)}
                </div>
            )}
            {after && (
                <div className="text-emerald-600 font-medium truncate max-w-[200px]" title={JSON.stringify(after)}>
                    {JSON.stringify(after)}
                </div>
            )}
        </div>
    );
}

export const dynamic = 'force-dynamic';

interface ExtendedLog extends AdminActionLogDoc {
    admin: { name: string | null; email: string } | null;
}

export default async function AuditLogPage() {
    const [rawLogs, metrics] = await Promise.all([
        dbService.query<AdminActionLogDoc>('admin_action_logs', {
            orderBy: [['createdAt', 'desc']],
            limit: 100,
        }),
        getAnomalyMetrics()
    ]);

    // Manually join admin data
    const logs: ExtendedLog[] = await Promise.all(rawLogs.map(async (log) => {
        const admin = await dbService.get<UserDoc>('users', log.adminId);
        return {
            ...log,
            admin: admin ? { name: admin.name, email: admin.email } : null
        };
    }));

    const showWarning = metrics.totalOverrides7d >= GOVERNANCE_LIMITS.overrides7d ||
        metrics.activeCollectorsUnderReview >= GOVERNANCE_LIMITS.underReviewCount;

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100/50 rounded-lg">
                        <ShieldAlert className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Governance & System Anomalies</h1>
                        <p className="text-slate-500">Immutable record of all administrative actions and quantified instability vectors.</p>
                    </div>
                </div>
            </header>

            {showWarning && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 shadow-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                        <h3 className="text-amber-800 font-semibold text-sm tracking-wide">System Integrity Warning: Anomalous Operations Detected</h3>
                        <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                            The system is currently detecting destabilizing activity metrics ({metrics.totalOverrides7d} overrides, {metrics.activeCollectorsUnderReview} under review).
                            Please evaluate the logs structured below.
                        </p>
                    </div>
                </div>
            )}

            {/* Anomaly Dashboard Summary Block */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Overrides (7d)</p>
                        <p className="text-3xl font-bold text-slate-900">{metrics.totalOverrides7d}</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deactivations (7d)</p>
                        <p className="text-3xl font-bold text-slate-900">{metrics.totalStatusToggles7d}</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <UserX className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Under Review</p>
                        <p className="text-3xl font-bold text-amber-600">{metrics.activeCollectorsUnderReview}</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <AlertOctagon className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl flex flex-col justify-center">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Override Trend Window</p>
                    <div className="flex items-end gap-1 h-12 w-full">
                        {metrics.overrideTrend7d.map((day, idx: number) => {
                            const maxCount = Math.max(1, ...metrics.overrideTrend7d.map((d) => d.count));
                            const heightPercent = (day.count / maxCount) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col justify-end group relative items-center">
                                    <div
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-sm transition-all"
                                        style={{ height: `${Math.max(10, heightPercent)}%` }}
                                        title={`${day.date}: ${day.count} overrides`}
                                    />
                                    <span className="text-[8px] text-slate-500 mt-1 opacity-50 group-hover:opacity-100">{idx === 6 ? 'Today' : ''}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-left border-b border-slate-200 font-medium text-slate-500 bg-slate-50">
                                <th className="py-3 px-6 whitespace-nowrap">Timestamp</th>
                                <th className="py-3 px-6 whitespace-nowrap">Admin</th>
                                <th className="py-3 px-6 whitespace-nowrap">Action Type</th>
                                <th className="py-3 px-6 whitespace-nowrap">Target</th>
                                <th className="py-3 px-6 whitespace-nowrap">Reason</th>
                                <th className="py-3 px-6 whitespace-nowrap">State Delta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                                        <div className="font-medium">{format(new Date(log.createdAt), "MMM d, yyyy")}</div>
                                        <div className="text-xs text-slate-400">{format(new Date(log.createdAt), "HH:mm:ss.SSS")}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-slate-900">{log.admin?.name || 'Unknown Admin'}</div>
                                        <div className="text-xs text-slate-500">{log.admin?.email || log.adminId}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                                            {log.actionType}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600">
                                        <span className="font-medium text-slate-900">{log.targetType}</span>
                                        <br />
                                        <span className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-500" title={log.targetId}>
                                            {log.targetId.slice(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600">
                                        {log.reason ? (
                                            <div className="max-w-[200px] text-xs leading-relaxed italic text-slate-500" title={log.reason}>
                                                &quot;{log.reason}&quot;
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 italic text-xs">Unspecified</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <StateDelta before={log.beforeState} after={log.afterState} />
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                                        No audit logs found. The system is unblemished.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
