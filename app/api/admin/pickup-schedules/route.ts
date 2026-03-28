import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getSession } from '@/lib/auth';
import { PickupScheduleDoc, WasteCategory } from '@/types/firestore';

const VALID_CATEGORIES: WasteCategory[] = ['organic', 'plastic', 'metal', 'general', 'mixed'];
const VALID_DAYS = [0, 1, 2, 3, 4, 5, 6]; // Sunday-Saturday

function validateTime(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const activeOnly = searchParams.get('active') === 'true';
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 20)));

  try {
    let query: FirebaseFirestore.Query = adminDb
      .collection('pickupSchedules')
      .orderBy('dayOfWeek', 'asc')
      .orderBy('time', 'asc');

    if (activeOnly) {
      query = query.where('active', '==', true);
    }

    const totalSnap = await query.count().get();
    const total = totalSnap.data().count;

    const offset = (page - 1) * limit;
    const snap = await query.offset(offset).limit(limit).get();

    const schedules = snap.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as PickupScheduleDoc[];

    return NextResponse.json({
      schedules,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[admin/pickup-schedules] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch pickup schedules' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { categoryId, categoryName, dayOfWeek, time, region, preparationInstructions, active } = data;

    // Validation
    if (!categoryId || !categoryName || dayOfWeek === undefined || !time || !preparationInstructions) {
      return NextResponse.json({ 
        error: 'Missing required fields: categoryId, categoryName, dayOfWeek, time, preparationInstructions' 
      }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(categoryId as WasteCategory)) {
      return NextResponse.json({ 
        error: `Invalid categoryId. Must be one of: ${VALID_CATEGORIES.join(', ')}` 
      }, { status: 400 });
    }

    if (!VALID_DAYS.includes(dayOfWeek)) {
      return NextResponse.json({ 
        error: 'Invalid dayOfWeek. Must be 0-6 (Sunday-Saturday)' 
      }, { status: 400 });
    }

    if (!validateTime(time)) {
      return NextResponse.json({ 
        error: 'Invalid time format. Must be HH:MM in 24-hour format (e.g., 09:00)' 
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const scheduleData: Omit<PickupScheduleDoc, 'id'> = {
      categoryId: categoryId as WasteCategory,
      categoryName,
      dayOfWeek: Number(dayOfWeek),
      time,
      region: region || null,
      preparationInstructions,
      active: active !== undefined ? Boolean(active) : true,
      createdBy: session.user.id,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('pickupSchedules').add(scheduleData);
    
    return NextResponse.json({
      success: true,
      schedule: { id: docRef.id, ...scheduleData }
    }, { status: 201 });
  } catch (error) {
    console.error('[admin/pickup-schedules] POST error:', error);
    return NextResponse.json({ error: 'Failed to create pickup schedule' }, { status: 500 });
  }
}
