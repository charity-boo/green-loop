import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propertyName,
      location,
      contactPerson,
      email,
      tier,
      placeId,
      latitude,
      longitude,
      county,
      region,
      source,
    } = body;

    if (!propertyName || !location || !contactPerson || !email || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = await adminDb.collection('hostel_bookings').add({
      propertyName,
      location,
      contactPerson,
      email,
      tier,
      placeId: placeId ?? null,
      latitude: typeof latitude === 'number' ? latitude : null,
      longitude: typeof longitude === 'number' ? longitude : null,
      county: county ?? null,
      region: region ?? null,
      locationSource: source ?? null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, bookingId: docRef.id }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'POST /api/hostels/book');
  }
}
