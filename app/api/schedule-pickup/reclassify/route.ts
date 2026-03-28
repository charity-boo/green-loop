import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { createErrorResponse, createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

const reclassifySchema = z.object({
  scheduleId: z.string().min(1, 'scheduleId is required'),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);
    const { user } = session!;

    const body = await req.json();
    const validation = reclassifySchema.safeParse(body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { scheduleId } = validation.data;
    const scheduleRef = adminDb.collection('schedules').doc(scheduleId);
    const scheduleDoc = await scheduleRef.get();

    if (!scheduleDoc.exists) {
      return createErrorResponse('Schedule not found', undefined, 404);
    }

    const scheduleData = scheduleDoc.data();
    if (!scheduleData) {
      return createErrorResponse('Schedule data is empty', undefined, 404);
    }

    // USER can only re-classify their own schedules
    if (user.role === 'USER' && scheduleData.userId !== user.id) {
      return createErrorResponse('Forbidden', undefined, 403);
    }

    if (!scheduleData.imageUrl) {
      return createErrorResponse('No image available for classification', undefined, 400);
    }

    await scheduleRef.update({
      classificationStatus: 'pending',
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Classification started' });
  } catch (error) {
    return handleApiError(error, 'POST /api/schedule-pickup/reclassify');
  }
}
