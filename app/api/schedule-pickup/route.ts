import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { handleApiError } from '@/lib/api-handler';
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
  classificationStatus: z.enum(['none', 'pending', 'classified', 'failed']).optional(),
  address: z.string().min(1, 'Address is required'),
  region: z.string().min(1, 'Region is required'),
  pickupDate: z.string().nullable().optional(),
  timeSlot: z.string().min(1, 'Time slot is required'),
  instructions: z.string().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

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

    const data = validation.data;
    const { user } = session!;

    const docRef = await adminDb.collection('schedules').add({
      userId: user.id,
      userName: user.name || 'User',
      wasteType: data.wasteType,
      aiSuggestedType: data.aiSuggestedType ?? null,
      aiConfidence: data.aiConfidence ?? null,
      classificationSource: data.classificationSource,
      aiPhotoUsed: data.aiPhotoUsed ?? false,
      aiWasteType: data.aiWasteType ?? null,
      disposalTips: data.disposalTips ?? null,
      classificationStatus: data.classificationStatus ?? (data.aiWasteType ? 'classified' : 'none'),
      classifiedAt: data.aiWasteType ? new Date().toISOString() : null,
      address: data.address,
      region: data.region,
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

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/schedule-pickup');
  }
}
