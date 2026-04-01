import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { assignScheduleAutomatically } from '@/lib/admin/assignment';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status');
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));

  try {
    let query: FirebaseFirestore.Query = adminDb.collection('schedules').orderBy('createdAt', 'desc');

    if (status && status !== 'ALL') {
      query = query.where('status', '==', status);
    }

    const totalSnap = await query.count().get();
    const total = totalSnap.data().count;

    const offset = (page - 1) * limit;
    const snap = await query.offset(offset).limit(limit).get();

    const schedules = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({
      schedules,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[admin/schedules] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const allowed = ['pending', 'assigned', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const scheduleRef = adminDb.collection('schedules').doc(id);
    const scheduleDoc = await scheduleRef.get();
    
    if (!scheduleDoc.exists) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    const currentData = scheduleDoc.data();

    // If setting to assigned and no collectorId exists, try to auto-assign
    if (status === 'assigned' && !currentData?.collectorId && currentData?.region) {
      const result = await assignScheduleAutomatically(id);
      if (!result.assignedCollectorId) {
        return NextResponse.json({ 
          error: `Auto-assignment failed: ${result.reason || 'No available collector found'}` 
        }, { status: 400 });
      }
      return NextResponse.json({ success: true, assignedCollectorId: result.assignedCollectorId });
    }

    await scheduleRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/schedules] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
