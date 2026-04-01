import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { GreenTipDoc } from '@/types/firestore';

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
    const docRef = db.collection('greenTips').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Green tip not found' }, { status: 404 });
    }

    const tip: GreenTipDoc = { id: doc.id, ...doc.data() } as GreenTipDoc;
    return NextResponse.json(tip);
  } catch (error) {
    console.error('Get Green Tip error:', error);
    return NextResponse.json({ error: 'Failed to fetch green tip' }, { status: 500 });
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
    const { title, description, imageUrl, category, status } = body;

    const docRef = db.collection('greenTips').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Green tip not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };
    const now = new Date().toISOString();

    const updates: Partial<GreenTipDoc> = {
      updatedAt: now,
    };

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (category !== undefined) updates.category = category;
    if (status !== undefined) updates.status = status;

    await docRef.update(updates);

    const afterState = { ...beforeState, ...updates };

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'UPDATE_GREEN_TIP',
      targetType: 'GREEN_TIP',
      targetId: id,
      beforeState,
      afterState,
      createdAt: now,
    });

    return NextResponse.json(afterState);
  } catch (error) {
    console.error('Update Green Tip error:', error);
    return NextResponse.json({ error: 'Failed to update green tip' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const docRef = db.collection('greenTips').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Green tip not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };

    await docRef.delete();

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'DELETE_GREEN_TIP',
      targetType: 'GREEN_TIP',
      targetId: id,
      beforeState,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Green tip deleted' });
  } catch (error) {
    console.error('Delete Green Tip error:', error);
    return NextResponse.json({ error: 'Failed to delete green tip' }, { status: 500 });
  }
}
