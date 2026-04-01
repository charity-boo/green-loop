import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { handleApiError } from '@/lib/api-handler';
import { z } from 'zod';
import { validateCollectorLocationSelection } from '@/lib/location/collector-location-validation';

const locationSchema = z.object({
  address: z.string().min(1),
  county: z.string().min(1),
  region: z.string().min(1),
  placeId: z.string().min(1),
  locationSource: z.enum(['manual', 'gps', 'google_autocomplete']),
});

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    const body = await req.json();
    const validation = locationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { address, county, region, placeId, locationSource } = validation.data;

    const sourceValidation = validateCollectorLocationSelection({
      address,
      county,
      region,
      placeId,
      locationSource,
    });
    if (!sourceValidation.isValid) {
      return NextResponse.json({ error: sourceValidation.error }, { status: 400 });
    }

    const { user } = session!;
    await adminDb.collection('users').doc(user.id).update({
      address,
      county,
      region,
      placeId,
      locationSource,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/user/location');
  }
}
