import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { authorize } from "@/lib/middleware/authorize";
import { adminDb } from "@/lib/firebase/admin";
import { WasteStatus } from "@/lib/types/waste-status";

import { handleApiError } from "@/lib/api-handler";

/**
 * GET /api/admin/stats - Get system statistics
 */
export async function GET() {
  try {
    const session = await getSession();
    await authorize(session, ['ADMIN']);

    const usersSnapshot = await adminDb.collection('users').count().get();
    const totalWasteSnapshot = await adminDb.collection('waste').count().get();
    const pendingSnapshot = await adminDb.collection('waste').where('status', '==', WasteStatus.Pending).count().get();
    const completedSnapshot = await adminDb.collection('waste').where('status', '==', WasteStatus.Completed).count().get();

    const stats = {
      totalUsers: usersSnapshot.data().count,
      totalWaste: totalWasteSnapshot.data().count,
      pendingPickups: pendingSnapshot.data().count,
      completedPickups: completedSnapshot.data().count,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return handleApiError(error, "GET /api/admin/stats");
  }
}
