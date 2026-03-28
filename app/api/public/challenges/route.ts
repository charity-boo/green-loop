import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { ChallengeDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const snapshot = await adminDb.collection('challenges').get();
    
    let challenges = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChallengeDoc[];

    // Filter by status (active, upcoming, completed)
    if (status && status !== 'all') {
      challenges = challenges.filter((challenge) => challenge.status === status);
    } else {
      // By default, exclude challenges that don't have a valid status
      challenges = challenges.filter((challenge) => 
        challenge.status === 'active' || 
        challenge.status === 'upcoming' || 
        challenge.status === 'completed'
      );
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      challenges = challenges.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(searchLower) ||
          challenge.description.toLowerCase().includes(searchLower) ||
          challenge.goal.toLowerCase().includes(searchLower)
      );
    }

    // Sort by startDate descending (newest first), but prioritize active challenges
    challenges.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      if (a.status === 'upcoming' && b.status === 'completed') return -1;
      if (a.status === 'completed' && b.status === 'upcoming') return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

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
    return NextResponse.json(
      { error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}
