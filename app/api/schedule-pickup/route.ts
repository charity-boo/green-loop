import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { handleApiError } from '@/lib/api-handler';
import { writeWorkflowLog } from '@/lib/workflow-log';
import { createNotification } from '@/services/notification.service';
import { logAIClassificationResult } from '@/lib/ai/ai-classification';
import { z } from 'zod';

const schedulePickupSchema = z.object({
  wasteType: z.string().min(1, 'Waste type is required'),
  aiSuggestedType: z.string().nullable().optional(),
  aiConfidence: z.number().nullable().optional(),
  classificationSource: z.enum(['manual', 'ai-assisted']),
  aiPhotoUsed: z.boolean().optional(),
  // Gemini classification fields
  aiWasteType: z.string().nullable().optional(),
  disposalTips: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  classificationStatus: z.enum(['none', 'pending', 'classified', 'failed']).optional(),
  address: z.string().min(1, 'Address is required'),
  county: z.string().nullable().optional(),
  region: z.string().min(1, 'Region is required'),
  placeId: z.string().nullable().optional(),
  locationSource: z.enum(['manual', 'gps', 'google_autocomplete']).optional(),
  pickupDate: z.string().nullable().optional(),
  timeSlot: z.string().min(1, 'Time slot is required'),
  instructions: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

const cancelPickupSchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required'),
});

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    const body = await req.json();
    const validation = cancelPickupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { user } = session!;
    const { scheduleId } = validation.data;

    const scheduleRef = adminDb.collection('schedules').doc(scheduleId);
    const scheduleDoc = await scheduleRef.get();

    if (!scheduleDoc.exists) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const scheduleData = scheduleDoc.data();

    // Verify ownership
    if (scheduleData?.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Only pending or assigned (active) schedules can be cancelled
    if (scheduleData?.status !== 'pending' && scheduleData?.status !== 'assigned') {
      return NextResponse.json({ error: 'Only pending or assigned schedules can be cancelled' }, { status: 400 });
    }

    await scheduleRef.update({
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    });

    // Notify collector if assigned
    if (scheduleData?.collectorId) {
      await createNotification({
        userId: scheduleData.collectorId,
        type: 'SCHEDULE_CANCELLED',
        message: `Pickup schedule #${scheduleId.slice(-6).toUpperCase()} has been cancelled by the user.`,
        relatedScheduleId: scheduleId,
      });
    }

    await writeWorkflowLog({
      event: 'schedule_cancelled',
      scheduleId: scheduleId,
      wasteId: scheduleId,
      actorType: user.role.toLowerCase() as 'user' | 'collector' | 'admin',
      actorId: user.id,
      before: {
        status: scheduleData?.status,
      },
      after: {
        status: 'cancelled',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/schedule-pickup');
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    const body = await req.json();
    const validation = schedulePickupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { user } = session!;
    const { data } = validation;

    // Check for existing active pickups
    const activeSchedules = await adminDb.collection('schedules')
      .where('userId', '==', user.id)
      .where('status', 'in', ['pending', 'assigned'])
      .limit(1)
      .get();

    if (!activeSchedules.empty) {
      return NextResponse.json(
        { error: 'You already have an active pickup scheduled. Please complete or cancel it before scheduling a new one.' },
        { status: 400 }
      );
    }

    // Fetch user phone for collector visibility
    const userDoc = await adminDb.collection('users').doc(user.id).get();
    const userPhone = userDoc.data()?.phoneNumber || null;

    const docRef = await adminDb.collection('schedules').add({
      userId: user.id,
      userName: user.name || 'User',
      userPhone,
      wasteType: data.wasteType,
      aiSuggestedType: data.aiSuggestedType ?? null,
      aiConfidence: data.aiConfidence ?? null,
      classificationSource: data.classificationSource,
      aiPhotoUsed: data.aiPhotoUsed ?? false,
      aiWasteType: data.aiWasteType ?? null,
      disposalTips: data.disposalTips ?? null,
      imageUrl: data.imageUrl ?? null,
      classificationStatus: data.classificationStatus ?? (data.aiWasteType ? 'classified' : 'none'),
      classifiedAt: data.aiWasteType ? new Date().toISOString() : null,
      address: data.address,
      county: data.county ?? null,
      region: data.region,
      placeId: data.placeId ?? null,
      locationSource: data.locationSource ?? 'manual',
      pickupDate: data.pickupDate ?? null,
      timeSlot: data.timeSlot,
      instructions: data.instructions ?? '',
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      status: 'pending',
      price: 5.00,
      paymentStatus: 'Unpaid',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await writeWorkflowLog({
      event: 'schedule_created',
      scheduleId: docRef.id,
      wasteId: docRef.id,
      actorType: 'user',
      actorId: user.id,
      after: {
        status: 'pending',
        paymentStatus: 'Unpaid',
        region: data.region,
      },
      metadata: {
        wasteType: data.wasteType,
        locationSource: data.locationSource ?? 'manual',
      },
    });

    // Log AI classification result for accuracy tracking
    if (data.aiWasteType && data.imageUrl) {
      try {
        await logAIClassificationResult({
          wasteId: docRef.id,
          userId: user.id,
          imageURL: data.imageUrl,
          predictedType: data.aiWasteType,
          confidenceScore: data.aiConfidence ?? 0,
        });
      } catch (logError) {
        // Log error but don't fail the request
        console.error('Failed to log AI classification result:', logError);
      }
    }

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/schedule-pickup');
  }
}
