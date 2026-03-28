import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { CommunityStoryDoc } from '@/types/firestore';

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
    const docRef = db.collection('communityStories').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const story: CommunityStoryDoc = { id: doc.id, ...doc.data() } as CommunityStoryDoc;
    return NextResponse.json(story);
  } catch (error) {
    console.error('Get Story error:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
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

    const docRef = db.collection('communityStories').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };
    const now = new Date().toISOString();

    const updates: Partial<CommunityStoryDoc> = {
      updatedAt: now,
    };

    // Only update provided fields
    const allowedFields = ['title', 'story', 'authorName', 'imageUrl', 'category', 'featured', 'status'];

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
      actionType: 'UPDATE_STORY',
      targetType: 'STORY',
      targetId: id,
      beforeState,
      afterState,
      createdAt: now,
    });

    return NextResponse.json(afterState);
  } catch (error) {
    console.error('Update Story error:', error);
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const docRef = db.collection('communityStories').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const beforeState = { id: doc.id, ...doc.data() };

    await docRef.delete();

    // Log admin action
    await db.collection('adminActionLogs').add({
      adminId: session.user.id,
      actionType: 'DELETE_STORY',
      targetType: 'STORY',
      targetId: id,
      beforeState,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Story deleted' });
  } catch (error) {
    console.error('Delete Story error:', error);
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 });
  }
}
