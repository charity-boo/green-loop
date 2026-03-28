import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { HostelDoc } from '@/types/firestore';

export async function GET() {
  try {
    const hostelsRef = adminDb.collection('hostels');
    const snapshot = await hostelsRef
      .where('verified', '==', true)
      .orderBy('points', 'desc')
      .limit(10)
      .get();

    const hostels = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HostelDoc[];

    return NextResponse.json(hostels);
  } catch (error) {
    return handleApiError(error, 'GET /api/hostels/leaderboard');
  }
}
