import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db, admin } from '@/lib/firebase/admin';
import { CommunityStoryDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query: admin.firestore.Query = db.collection('communityStories').orderBy('createdAt', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }
    if (featured !== null && featured !== undefined) {
      query = query.where('featured', '==', featured === 'true');
    }

    const snapshot = await query.get();
    let stories: CommunityStoryDoc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityStoryDoc[];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      stories = stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchLower) ||
          story.story.toLowerCase().includes(searchLower) ||
          story.authorName.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = stories.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStories = stories.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedStories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Stories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, story, authorName, imageUrl, category, featured, status } = body;

    // Validation
    if (!title || !story || !authorName || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, story, authorName, category' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newStory: Omit<CommunityStoryDoc, 'id'> = {
      title,
      story,
      authorName,
      imageUrl: imageUrl || null,
      category,
      featured: featured || false,
      status: status || 'draft',
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('communityStories').add(newStory);

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'CREATE_STORY',
      targetType: 'STORY',
      targetId: docRef.id,
      afterState: { ...newStory, id: docRef.id },
      createdAt: now,
    });

    return NextResponse.json(
      { id: docRef.id, ...newStory },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Story error:', error);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}
