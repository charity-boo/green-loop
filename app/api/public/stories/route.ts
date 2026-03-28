import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { CommunityStoryDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const snapshot = await adminDb.collection('communityStories').get();
    
    let stories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommunityStoryDoc[];

    // Filter by published status
    stories = stories.filter((story) => story.status === 'published');

    // Filter by category
    if (category && category !== 'all') {
      stories = stories.filter((story) => story.category === category);
    }

    // Filter by featured flag
    if (featured === 'true') {
      stories = stories.filter((story) => story.featured === true);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      stories = stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchLower) ||
          story.story.toLowerCase().includes(searchLower) ||
          story.authorName.toLowerCase().includes(searchLower)
      );
    }

    // Sort: featured first, then by createdAt descending
    stories.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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
    return NextResponse.json(
      { error: 'Failed to fetch community stories' },
      { status: 500 }
    );
  }
}
