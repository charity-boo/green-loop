import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { wasteStatusSchema } from '@/lib/validation/schemas';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

const patchWasteSchema = z.object({
  status: wasteStatusSchema.optional(),
  classificationStatus: z.enum(['none', 'pending', 'classified', 'failed']).optional(),
}).refine((d) => d.status !== undefined || d.classificationStatus !== undefined, {
  message: 'At least one of status or classificationStatus is required',
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    // USER can trigger re-classification on their own items; COLLECTOR/ADMIN can do everything
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);
    const { user } = session!;
    const { id: wasteId } = await context.params;

    if (!wasteId) {
      return createErrorResponse('Waste ID is required');
    }

    const body = await req.json();
    const validation = patchWasteSchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { status, classificationStatus } = validation.data;

    const wasteRef = adminDb.collection('waste').doc(wasteId);
    const wasteDoc = await wasteRef.get();

    if (!wasteDoc.exists) {
      return createErrorResponse('Waste item not found', undefined, 404);
    }

    const wasteData = wasteDoc.data();
    if (!wasteData) {
      return createErrorResponse('Waste item data is empty', undefined, 404);
    }

    // Authorization: USER can only update their own docs (and only classificationStatus)
    if (user.role === 'USER') {
      if (wasteData.userId !== user.id) {
        return createErrorResponse('Forbidden', undefined, 403);
      }
      if (status !== undefined) {
        return createErrorResponse('Users cannot update waste status', undefined, 403);
      }
    } else if (user.role === 'COLLECTOR') {
      if (wasteData.assignedCollectorId !== user.id) {
        return createErrorResponse('Forbidden: You are not assigned to this task', undefined, 403);
      }
    }
    // ADMIN has no further restrictions

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status !== undefined) updateData.status = status;
    if (classificationStatus !== undefined) updateData.classificationStatus = classificationStatus;

    await wasteRef.update(updateData);

    return NextResponse.json({ id: wasteId, ...wasteData, ...updateData });
  } catch (error) {
    return handleApiError(error, `PATCH /api/waste/${(await context.params).id}`);
  }
}
