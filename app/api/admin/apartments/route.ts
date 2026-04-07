import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { ApartmentDoc } from '@/types/firestore';

export async function GET(_req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const apartmentsSnap = await adminDb.collection('apartments').orderBy('name').get();
    const apartments = apartmentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ApartmentDoc[];
    return NextResponse.json(apartments);
  } catch (error) {
    console.error('[admin/apartments] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const now = new Date().toISOString();
    
    const apartmentData: Omit<ApartmentDoc, 'id'> = {
      ...data,
      points: data.points || 0,
      unitCount: data.unitCount || 0,
      totalWasteRecycled: data.totalWasteRecycled || 0,
      tier: data.tier || 'standard',
      verified: data.verified || false,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('apartments').add(apartmentData);
    return NextResponse.json({ id: docRef.id, ...apartmentData }, { status: 201 });
  } catch (error) {
    console.error('[admin/apartments] POST error:', error);
    return NextResponse.json({ error: 'Failed to create apartment' }, { status: 500 });
  }
}
