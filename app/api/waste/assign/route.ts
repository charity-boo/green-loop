import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { wasteAssignmentSchema } from '@/lib/validation/schemas';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['ADMIN']);

    const body = await req.json();
    const validation = wasteAssignmentSchema.safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { wasteId, collectorId } = validation.data;

    const wasteRef = adminDb.collection('waste').doc(wasteId);
    const wasteDoc = await wasteRef.get();

    if (!wasteDoc.exists) {
      return createErrorResponse('Waste item not found', undefined, 404);
    }

    const updateData = {
      assignedCollectorId: collectorId,
      updatedAt: new Date().toISOString()
    };

    await wasteRef.update(updateData);

    const updatedWaste = {
      id: wasteId,
      ...wasteDoc.data(),
      ...updateData
    };

    return NextResponse.json(updatedWaste);
  } catch (error) {
    return handleApiError(error, 'POST /api/waste/assign');
  }
}
