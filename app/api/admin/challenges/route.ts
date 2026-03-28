import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { ChallengeDoc } from '@/types/firestore';

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
    const search = searchParams.get('search');

    let query = db.collection('challenges').orderBy('startDate', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status) as any;
    }

    const snapshot = await query.get();
    let challenges: ChallengeDoc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChallengeDoc[];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      challenges = challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchLower) ||
          challenge.description.toLowerCase().includes(searchLower) ||
          challenge.goal.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = challenges.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedChallenges = challenges.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedChallenges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Challenges API error:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, description, imageUrl, startDate, endDate, goal, status } = body;

    // Validation
    if (!title || !description || !startDate || !endDate || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, startDate, endDate, goal' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newChallenge: Omit<ChallengeDoc, 'id'> = {
      title,
      description,
      imageUrl: imageUrl || null,
      startDate,
      endDate,
      goal,
      currentProgress: 0,
      status: status || 'upcoming',
      participants: [],
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('challenges').add(newChallenge);

    // Log admin action
    await db.collection('adminActionLogs').add({
      adminId: session.user.id,
      actionType: 'CREATE_CHALLENGE',
      targetType: 'CHALLENGE',
      targetId: docRef.id,
      afterState: { ...newChallenge, id: docRef.id },
      createdAt: now,
    });

    return NextResponse.json(
      { id: docRef.id, ...newChallenge },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Challenge error:', error);
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 });
  }
}
