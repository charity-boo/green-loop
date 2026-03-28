import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';

export async function GET() {
  try {
    const hostelsSnap = await adminDb
      .collection('hostels')
      .where('verified', '==', true)
      .get();

    let totalWaste = 0;
    let totalStudents = 0;
    let totalPoints = 0;
    const hostelCount = hostelsSnap.docs.length;

    hostelsSnap.docs.forEach((doc) => {
      const data = doc.data();
      totalWaste += data.totalWasteRecycled ?? 0;
      totalStudents += data.studentCount ?? 0;
      totalPoints += data.points ?? 0;
    });

    const diversionRate = hostelCount > 0 ? Math.min(Math.round((totalWaste / (totalWaste + 200)) * 100), 99) : 0;

    return NextResponse.json({
      totalWasteKg: totalWaste,
      totalStudents,
      hostelCount,
      diversionRate,
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/hostels/stats');
  }
}
