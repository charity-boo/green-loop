import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { wasteStatusSchema } from '@/lib/validation/schemas';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    await authorize(session, ['COLLECTOR', 'ADMIN']);
    const { user } = session!;
    const { id: wasteId } = await context.params;
    const body = await req.json();
    const { status } = body;

    if (!wasteId) {
      return createErrorResponse('Waste ID is required');
    }

    if (!status) {
      return createErrorResponse('Status is required');
    }

    const validation = wasteStatusSchema.safeParse(status);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error, "Invalid status. Accepted values: pending, collected, completed");
    }
    const validatedStatus = validation.data;

    const wasteRef = adminDb.collection('waste').doc(wasteId);
    const wasteDoc = await wasteRef.get();

    if (!wasteDoc.exists) {
      return createErrorResponse('Waste item not found', undefined, 404);
    }

    const wasteData = wasteDoc.data();

    if (!wasteData) {
      return createErrorResponse('Waste item data is empty', undefined, 404);
    }

    if (user.role !== 'ADMIN' && wasteData.assignedCollectorId !== user.id) {
      return createErrorResponse('Forbidden: You are not assigned to this task', undefined, 403);
    }

    const updateData = {
      status: validatedStatus,
      updatedAt: new Date().toISOString()
    };

    await wasteRef.update(updateData);

    const updatedWaste = {
      id: wasteId,
      ...wasteData,
      ...updateData
    };

    return NextResponse.json(updatedWaste);
  } catch (error) {
    return handleApiError(error, `PATCH /api/waste/${(await context.params).id}`);
  }
}
