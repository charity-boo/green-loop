import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { adminDb } from '@/lib/firebase/admin';
import { WasteStatus } from '@/types/waste-status';
import { wasteStatusSchema } from '@/lib/validation/schemas';
import { createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

/**
 * GET /api/collector/tasks - List tasks assigned to the current collector
 * Protected: Requires "collector" role
 * Scoped: Only returns tasks assigned to the authenticated collector
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    await authorize(session, ['COLLECTOR', 'ADMIN']);
    const collectorId = session!.user.id;

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    let status = WasteStatus.Pending;

    if (statusParam) {
      const statusValidation = wasteStatusSchema.safeParse(statusParam);
      if (!statusValidation.success) {
        return createValidationErrorResponse(statusValidation.error, "Invalid status. Accepted values: pending, active, completed");
      }
      status = statusValidation.data;
    }

    const tasksSnapshot = await adminDb.collection('waste')
      .where('status', '==', status)
      .where('assignedCollectorId', '==', collectorId)
      .get();

    const tasks = tasksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(tasks);
  } catch (error) {
    return handleApiError(error, 'GET /api/collector/tasks');
  }
}
