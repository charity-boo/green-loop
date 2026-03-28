import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { HostelDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const hostelsSnap = await adminDb.collection('hostels').orderBy('name').get();
    const hostels = hostelsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HostelDoc[];
    return NextResponse.json(hostels);
  } catch (error) {
    console.error('[admin/hostels] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch hostels' }, { status: 500 });
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
    
    const hostelData: Omit<HostelDoc, 'id'> = {
      ...data,
      points: data.points || 0,
      studentCount: data.studentCount || 0,
      totalWasteRecycled: data.totalWasteRecycled || 0,
      tier: data.tier || 'standard',
      verified: data.verified || false,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('hostels').add(hostelData);
    return NextResponse.json({ id: docRef.id, ...hostelData }, { status: 201 });
  } catch (error) {
    console.error('[admin/hostels] POST error:', error);
    return NextResponse.json({ error: 'Failed to create hostel' }, { status: 500 });
  }
}
