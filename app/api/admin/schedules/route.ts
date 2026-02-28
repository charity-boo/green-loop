import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';

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

    await adminDb.collection('schedules').doc(id).update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin/schedules] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
