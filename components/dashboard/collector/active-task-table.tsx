"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CollectorTask } from "@/types";
import { WasteStatus } from "@/types/waste-status";
import { 
    MapPin, 
    User, 
    Play, 
    CheckCircle2, 
    SkipForward,
    ClipboardList,
    ImageIcon
} from "lucide-react";
import Image from "next/image";
import ClassificationBadge from "@/components/user/classification-badge";

interface ActiveTaskTableProps {
    tasks: CollectorTask[];
}

const statusLabel: Record<string, string> = {
    [WasteStatus.Completed]: "Recycled",
    [WasteStatus.Pending]: "Pending",
    [WasteStatus.Skipped]: "Skipped",
    [WasteStatus.Active]: "Active",
    [WasteStatus.Cancelled]: "Cancelled",
};

const statusStyle: Record<string, string> = {
    [WasteStatus.Completed]: "bg-green-50 text-green-700 border-green-200",
    [WasteStatus.Pending]: "bg-amber-50 text-amber-700 border-amber-200",
    [WasteStatus.Skipped]: "bg-slate-100 text-slate-500 border-slate-200",
    [WasteStatus.Active]: "bg-blue-50 text-blue-700 border-blue-200",
    [WasteStatus.Cancelled]: "bg-red-50 text-red-600 border-red-200",
};

const typeStyle: Record<string, string> = {
    Organic: "bg-lime-50 text-lime-700 border-lime-200",
    Plastic: "bg-blue-50 text-blue-700 border-blue-200",
    Paper: "bg-sky-50 text-sky-700 border-sky-200",
    Glass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    Metal: "bg-slate-50 text-slate-700 border-slate-200",
    Hazardous: "bg-red-50 text-red-700 border-red-200",
    Recyclable: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function ActionButton({ task }: { task: CollectorTask }) {
    const router = useRouter();

    if (task.status === WasteStatus.Completed) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle2 size={12} />
                Done
            </span>
        );
    }

    if (task.status === WasteStatus.Skipped) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 text-[10px] font-black uppercase tracking-wider">
                <SkipForward size={12} />
                Skipped
            </span>
        );
    }

    if (task.status === WasteStatus.Active) {
        return (
            <button
                onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/active/${task.id}/verify`); }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-blue-600/20"
            >
                 <CheckCircle2 size={12} />
                Verify
            </button>
        );
    }

    return (
        <button
            onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/active/${task.id}`); }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/20"
        >
            <Play size={12} />
            Start
        </button>
    );
}

export default function ActiveTaskTable({ tasks }: ActiveTaskTableProps) {
    const [reclassifyingIds, setReclassifyingIds] = useState<Set<string>>(new Set());

    const handleReclassify = useCallback(async (wasteId: string) => {
        setReclassifyingIds((prev) => new Set(prev).add(wasteId));
        try {
            await fetch(`/api/waste/${wasteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classificationStatus: 'pending' }),
            });
        } finally {
            // Refresh will clear the spinner
        }
    }, []);

    return (
        <div className="bg-white flex flex-col min-h-[400px]">
            {/* Table Header Row (Hidden on small screens) */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-50">
                            <th className="py-5 text-left pl-4 font-black">Preview</th>
                            <th className="py-5 text-left font-black">Resident / Area</th>
                            <th className="py-5 text-left font-black">Collection Info</th>
                            <th className="py-5 text-left font-black">AI Analysis</th>
                            <th className="py-5 text-left font-black">Status</th>
                            <th className="py-5 text-right pr-4 font-black">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tasks.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-200">
                                            <ClipboardList size={40} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-900 uppercase italic">All Clear!</h4>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">No active tasks in your sector</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            tasks.map((task) => {
                                const sStyle = statusStyle[task.status] ?? statusStyle[WasteStatus.Pending];
                                const typeKey = (task.type || 'Recyclable') as keyof typeof typeStyle;
                                const tStyle = typeStyle[typeKey] ?? typeStyle.Recyclable;
                                
                                return (
                                    <tr key={task.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                                        {/* ID / Preview */}
                                        <td className="py-6 pl-4">
                                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:border-emerald-200 transition-colors">
                                                {task.imageUrl ? (
                                                    <Image src={task.imageUrl} alt="Waste" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon size={18} className="text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Resident / Location */}
                                        <td className="py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center">
                                                        <User size={10} className="text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900 tracking-tight">
                                                        {task.user?.name || task.userName || 'Resident'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 pl-7 text-[10px] font-medium text-slate-400">
                                                    <MapPin size={10} className="text-slate-300" />
                                                    <span className="truncate">{task.location || task.address || 'Ndagani Sector'}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Collection Info */}
                                        <td className="py-6">
                                            <div className="flex flex-col gap-2">
                                                <span className={`inline-flex w-fit px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-tight ${tStyle}`}>
                                                    {task.type || 'Recyclable'}
                                                </span>
                                                <p className="text-[11px] font-bold text-slate-500 tracking-tight line-clamp-1 italic max-w-[200px]">
                                                    &quot;{task.description || 'Unclassified'}&quot;
                                                </p>
                                            </div>
                                        </td>

                                        {/* AI Analysis */}
                                        <td className="py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <ClassificationBadge
                                                    scheduleId={task.id}
                                                    aiWasteType={task.aiWasteType}
                                                    disposalTips={task.disposalTips}
                                                    classificationStatus={task.classificationStatus}
                                                    canReclassify
                                                    onReclassify={handleReclassify}
                                                    reclassifying={reclassifyingIds.has(task.id)}
                                                />
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                        Conf: <span className="text-emerald-600">{task.confidence ? `${Math.round(task.confidence * 100)}%` : 'N/A'}</span>
                                                    </span>
                                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                                                        Est: <span className="text-slate-900">{task.weight ? `${task.weight}kg` : 'N/A'}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-6">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.15em] ${sStyle}`}>
                                                {statusLabel[task.status] ?? task.status}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="py-6 pr-4 text-right">
                                            <ActionButton task={task} />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile View (Optional: You can keep the Grid Cards for mobile as they are often better) */}
            <div className="lg:hidden p-4 space-y-4">
                {tasks.length === 0 ? (
                    <div className="py-20 text-center">
                         <p className="text-slate-400 text-sm font-medium">No active tasks</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div key={task.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 overflow-hidden relative">
                                    {task.imageUrl ? <Image src={task.imageUrl} alt="W" fill className="object-cover" /> : <ClipboardList size={20} />}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-900">{task.user?.name || 'Resident'}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">{task.location || 'Ndagani'}</span>
                                </div>
                             </div>
                             <ActionButton task={task} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
