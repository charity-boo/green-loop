"use client";

import { useTransition } from "react";
import { toggleCollectorStatus } from "./actions";
import { Power, PowerOff } from "lucide-react";

export default function CollectorStatusToggle({ collectorId, active }: { collectorId: string, active: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const action = active ? "deactivate" : "reactivate";
        const reason = window.prompt(`Please provide a reason to ${action} this collector (min 10 characters):`);

        if (reason === null) return; // Cancelled

        if (reason.trim().length < 10) {
            alert("Error: A descriptive reason of at least 10 characters is mandatory for this action.");
            return;
        }

        startTransition(async () => {
            const res = await toggleCollectorStatus(collectorId, active, reason);
            if (res && res.error) {
                alert(res.error);
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${active
                ? "text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            title={active ? "Deactivate Collector" : "Reactivate Collector"}
        >
            {active ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            {active ? "Deactivate" : "Reactivate"}
        </button>
    );
}
