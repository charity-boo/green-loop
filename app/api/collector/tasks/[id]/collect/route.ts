import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { adminDb } from '@/lib/firebase/admin';
import { WasteStatus } from '@/lib/types/waste-status';
import { createErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

/**
 * POST /api/collector/tasks/[id]/collect - Mark a task as collected
 * Protected: Requires "collector" role
 * Scoped: Collector can only collect tasks assigned to them
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    await authorize(session, ['COLLECTOR', 'ADMIN']);
    const collectorId = session!.user.id;

    const wasteDoc = await adminDb.collection('waste').doc(id).get();

    if (!wasteDoc.exists) {
      return createErrorResponse('Waste item not found', undefined, 404);
    }

    const wasteItem = wasteDoc.data();

    if (!wasteItem) {
      return createErrorResponse('Waste item data is empty', undefined, 404);
    }

    // Ensure collector can only collect their own assigned tasks
    if (wasteItem.assignedCollectorId !== collectorId && session!.user.role !== 'ADMIN') {
      return createErrorResponse('Forbidden: You are not assigned to this task', undefined, 403);
    }

    if (wasteItem.status !== WasteStatus.Pending) {
      return createErrorResponse(`Waste item is already ${wasteItem.status}`, undefined, 400);
    }

    const updateData = {
      status: WasteStatus.Collected,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('waste').doc(id).update(updateData);

    const updatedWasteItem = {
      id,
      ...wasteItem,
      ...updateData
    };

    return NextResponse.json(updatedWasteItem);
  } catch (error) {
    return handleApiError(error, 'POST /api/collector/tasks/[id]/collect');
  }
}
