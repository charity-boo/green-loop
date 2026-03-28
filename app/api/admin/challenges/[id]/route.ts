import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { ChallengeDoc } from '@/types/firestore';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const docRef = db.collection('challenges').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const challenge: ChallengeDoc = { id: doc.id, ...doc.data() } as ChallengeDoc;
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Get Challenge error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const docRef = db.collection('challenges').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };
    const now = new Date().toISOString();

    const updates: Partial<ChallengeDoc> = {
      updatedAt: now,
    };

    // Only update provided fields
    const allowedFields = [
      'title',
      'description',
      'imageUrl',
      'startDate',
      'endDate',
      'goal',
      'currentProgress',
      'status',
      'participants',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as any)[field] = body[field];
      }
    }

    await docRef.update(updates);

    const afterState = { id, ...beforeState, ...updates };

    // Log admin action
    await db.collection('adminActionLogs').add({
      adminId: session.user.id,
      actionType: 'UPDATE_CHALLENGE',
      targetType: 'CHALLENGE',
      targetId: id,
      beforeState,
      afterState,
      createdAt: now,
    });

    return NextResponse.json(afterState);
  } catch (error) {
    console.error('Update Challenge error:', error);
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const docRef = db.collection('challenges').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };

    await docRef.delete();

    // Log admin action
    await db.collection('adminActionLogs').add({
      adminId: session.user.id,
      actionType: 'DELETE_CHALLENGE',
      targetType: 'CHALLENGE',
      targetId: id,
      beforeState,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Challenge deleted' });
  } catch (error) {
    console.error('Delete Challenge error:', error);
    return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 });
  }
}
