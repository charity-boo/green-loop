import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import type { EventDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 12);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const snapshot = await adminDb.collection('events').get();
    
    let events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EventDoc[];

    // Filter out draft events (only show published and completed)
    events = events.filter((event) => event.status !== 'draft');

    // Filter by category
    if (category && category !== 'all') {
      events = events.filter((event) => event.category === category);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
      );
    }

    // Sort by eventDate ascending (upcoming first)
    events.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    // Pagination
    const total = events.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = events.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Events API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
