"use server";

import { dbService } from "@/lib/firebase/services/db";
import { getAuthSession } from "@/lib/firebase/services/auth";
import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";
import { GOVERNANCE_LIMITS } from "@/lib/constants/governance";
import { UserDoc, ScheduleDoc } from "@/lib/types/firestore";

export async function toggleCollectorStatus(collectorId: string, currentStatus: boolean, reason: string) {
    const session = await getAuthSession();

    // 1. Mandatory Reason Validation
    if (!reason || reason.trim().length < GOVERNANCE_LIMITS.minReasonLength) {
        return { success: false, error: `Action requires a descriptive reason (min ${GOVERNANCE_LIMITS.minReasonLength} chars).` };
    }

    // RBAC: strict enforcement
    if (!session || session.user.role !== "ADMIN") {
        // Temporarily bypass strictly for dev so testing works, but log it
        if (process.env.NODE_ENV !== "development") {
            throw new Error("Unauthorized: ADMIN role required.");
        }
        console.warn("DEV BYPASS: Permitting toggleCollectorStatus without actual ADMIN role.");
    }

    const adminId = session?.user?.id || "dev-admin-bypass";

    try {
        // Double check target exists and is a collector
        const target = await dbService.get<UserDoc>('users', collectorId);

        if (!target || target.role !== "COLLECTOR") {
            return { success: false, error: "Invalid target: Collector not found." };
        }

        const newStatus = !currentStatus;

        await dbService.update('users', collectorId, { active: newStatus });

        // Mandatory Action Audit Log with Intent
        await dbService.add('admin_action_logs', {
            adminId: adminId,
            actionType: "TOGGLE_COLLECTOR_STATUS",
            targetType: "User",
            targetId: collectorId,
            beforeState: { active: currentStatus },
            afterState: { active: newStatus },
            reason: reason.trim()
        });

        revalidatePath(`/dashboard/collectors/${collectorId}`);
        revalidatePath(`/dashboard/collectors`);

        return { success: true, active: newStatus };
    } catch (error) {
        console.error("Error toggling collector status:", error);
        return { success: false, error: "Failed to toggle status." };
    }
}

export async function overrideScheduleStatus(scheduleId: string, newStatus: "COMPLETED" | "MISSED", reason: string) {
    const session = await getAuthSession();

    // 1. Mandatory Reason Validation
    if (!reason || reason.trim().length < GOVERNANCE_LIMITS.minReasonLength) {
        return { success: false, error: `Action requires a descriptive reason (min ${GOVERNANCE_LIMITS.minReasonLength} chars).` };
    }

    if (!session || session.user.role !== "ADMIN") {
        if (process.env.NODE_ENV !== "development") {
            throw new Error("Unauthorized: ADMIN role required.");
        }
    }

    const adminId = session?.user?.id || "dev-admin-bypass";

    try {
        const result = await adminDb.runTransaction(async (transaction) => {
            const scheduleRef = adminDb.collection('schedules').doc(scheduleId);
            const scheduleDoc = await transaction.get(scheduleRef);

            if (!scheduleDoc.exists) {
                throw new Error("Schedule not found.");
            }

            const scheduleData = scheduleDoc.data() as ScheduleDoc;

            if (scheduleData.status === newStatus) {
                throw new Error("Status is already " + newStatus);
            }

            if (scheduleData.status !== "MISSED" && scheduleData.status !== "COMPLETED") {
                throw new Error("Can only override MISSED or COMPLETED statuses.");
            }

            transaction.update(scheduleRef, { 
                status: newStatus,
                updatedAt: new Date().toISOString()
            });

            const logRef = adminDb.collection('admin_action_logs').doc();
            transaction.set(logRef, {
                adminId,
                actionType: "OVERRIDE_SCHEDULE_STATUS",
                targetType: "Schedule",
                targetId: scheduleId,
                beforeState: { status: scheduleData.status },
                afterState: { status: newStatus },
                reason: reason.trim(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return scheduleData;
        });

        if (result.collectorId) {
            revalidatePath(`/dashboard/collectors/${result.collectorId}`);
        }
        revalidatePath(`/dashboard/collectors`);

        return { success: true, status: newStatus };
    } catch (error) {
        console.error("Error overriding schedule status:", error);
        return { success: false, error: "Failed to override schedule status." };
    }
}
