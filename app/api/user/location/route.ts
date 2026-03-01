import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { handleApiError } from '@/lib/api-handler';
import { z } from 'zod';
import { KENYA_COUNTIES } from '@/lib/constants/regions';

const locationSchema = z.object({
  county: z.string().min(1),
  region: z.string().min(1),
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

    const { county, region } = validation.data;

    const countyData = KENYA_COUNTIES.find((c) => c.value === county);
    if (!countyData) {
      return NextResponse.json({ error: 'Invalid county' }, { status: 400 });
    }

    const regionData = countyData.subRegions.find((sr) => sr.value === region);
    if (!regionData) {
      return NextResponse.json({ error: 'Invalid region for the selected county' }, { status: 400 });
    }

    const { user } = session!;
    await adminDb.collection('users').doc(user.id).update({
      county,
      region,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, 'PATCH /api/user/location');
  }
}
