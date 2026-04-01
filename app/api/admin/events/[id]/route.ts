import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { EventDoc } from '@/types/firestore';

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
    const docRef = db.collection('events').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const event: EventDoc = { id: doc.id, ...doc.data() } as EventDoc;
    return NextResponse.json(event);
  } catch (error) {
    console.error('Get Event error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
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

    const docRef = db.collection('events').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };
    const now = new Date().toISOString();

    const updates: Partial<EventDoc> = {
      updatedAt: now,
    };

    // Only update provided fields
    const allowedFields = [
      'title',
      'description',
      'imageUrl',
      'eventDate',
      'location',
      'category',
      'status',
      'registrationRequired',
      'maxParticipants',
      'currentParticipants',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        (updates as Record<string, unknown>)[field] = body[field];
      }
    }

    await docRef.update(updates);

    const afterState = { ...beforeState, ...updates };

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'UPDATE_EVENT',
      targetType: 'EVENT',
      targetId: id,
      beforeState,
      afterState,
      createdAt: now,
    });

    return NextResponse.json(afterState);
  } catch (error) {
    console.error('Update Event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const docRef = db.collection('events').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };

    await docRef.delete();

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'DELETE_EVENT',
      targetType: 'EVENT',
      targetId: id,
      beforeState,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    console.error('Delete Event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
