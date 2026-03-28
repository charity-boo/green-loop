import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/firebase/admin';
import { EventDoc } from '@/types/firestore';

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

    let query = db.collection('events').orderBy('eventDate', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    if (category) {
      query = query.where('category', '==', category) as any;
    }

    const snapshot = await query.get();
    let events: EventDoc[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as EventDoc[];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
      );
    }

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
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      imageUrl,
      eventDate,
      location,
      category,
      status,
      registrationRequired,
      maxParticipants,
    } = body;

    // Validation
    if (!title || !description || !eventDate || !location || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, eventDate, location, category' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newEvent: Omit<EventDoc, 'id'> = {
      title,
      description,
      imageUrl: imageUrl || null,
      eventDate,
      location,
      category,
      status: status || 'draft',
      registrationRequired: registrationRequired || false,
      maxParticipants: maxParticipants || null,
      currentParticipants: 0,
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('events').add(newEvent);

    // Log admin action
    await db.collection('adminActionLogs').add({
      adminId: session.user.id,
      actionType: 'CREATE_EVENT',
      targetType: 'EVENT',
      targetId: docRef.id,
      afterState: { ...newEvent, id: docRef.id },
      createdAt: now,
    });

    return NextResponse.json(
      { id: docRef.id, ...newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create Event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
