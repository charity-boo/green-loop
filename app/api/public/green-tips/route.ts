import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { GreenTipDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const query = adminDb.collection('greenTips');
    
    const snapshot = await query.get();
    
    let tips = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GreenTipDoc[];

    // Filter by published status
    tips = tips.filter((tip) => tip.status === 'published');

    // Filter by category
    if (category && category !== 'all') {
      tips = tips.filter((tip) => tip.category === category);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      tips = tips.filter(
        (tip) =>
          tip.title.toLowerCase().includes(searchLower) ||
          tip.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by createdAt descending (newest first)
    tips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
    return NextResponse.json(
      { error: 'Failed to fetch green tips' },
      { status: 500 }
    );
  }
}
