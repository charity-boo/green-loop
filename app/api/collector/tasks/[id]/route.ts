import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { adminDb } from '@/lib/firebase/admin';
import { wasteStatusSchema } from '@/lib/validation/schemas';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

/**
 * PUT /api/collector/tasks/[id] - Update status of an assigned task
 * Protected: Requires "collector" role
 * Scoped: Collector can only update tasks assigned to them
 */
export async function PUT(
  request: NextRequest,
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

    // Ensure collector can only modify their own assigned tasks
    if (wasteItem.assignedCollectorId !== collectorId && session!.user.role !== 'ADMIN') {
      return createErrorResponse('Forbidden: You are not assigned to this task', undefined, 403);
    }

    const body = await request.json();
    const validation = wasteStatusSchema.safeParse(body.status);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error, "Invalid status. Accepted values: pending, collected, completed");
    }

    const status = validation.data;

    await adminDb.collection('waste').doc(id).update({
      status,
      updatedAt: new Date().toISOString()
    });

    const updatedWasteItem = {
      id,
      ...wasteItem,
      status,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedWasteItem);
  } catch (error) {
    return handleApiError(error, 'PUT /api/collector/tasks/[id]');
  }
}
