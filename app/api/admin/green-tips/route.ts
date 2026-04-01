import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { GreenTipDoc } from '@/types/firestore';

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
    const search = searchParams.get('search');

    let query = db.collection('greenTips').orderBy('createdAt', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }
    if (category) {
      query = query.where('category', '==', category);
    }

    // Get all documents (we'll handle search and pagination in memory for simplicity)
    const snapshot = await query.get();
    let tips: GreenTipDoc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GreenTipDoc[];

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      tips = tips.filter(
        (tip) =>
          tip.title.toLowerCase().includes(searchLower) ||
          tip.description.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = tips.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTips = tips.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedTips,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Green Tips API error:', error);
    return NextResponse.json({ error: 'Failed to fetch green tips' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, imageUrl, category, status } = body;

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newTip: Omit<GreenTipDoc, 'id'> = {
      title,
      description,
      imageUrl: imageUrl || null,
      category,
      status: status || 'draft',
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('greenTips').add(newTip);

    // Log admin action
    await db.collection('admin_action_logs').add({
      adminId: session.user.id,
      actionType: 'CREATE_GREEN_TIP',
      targetType: 'GREEN_TIP',
      targetId: docRef.id,
      afterState: { ...newTip, id: docRef.id },
      createdAt: now,
    });

    return NextResponse.json(
      { id: docRef.id, ...newTip },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Green Tip error:', error);
    return NextResponse.json({ error: 'Failed to create green tip' }, { status: 500 });
  }
}
