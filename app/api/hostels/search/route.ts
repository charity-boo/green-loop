import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { HostelDoc } from '@/types/firestore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      const doc = await adminDb.collection('hostels').doc(id).get();
      if (!doc.exists) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    const query = searchParams.get('q')?.toLowerCase().trim();

    if (!query || query.length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch all verified hostels and filter in-memory since Firestore
    // does not support full-text search natively
    const snapshot = await adminDb
      .collection('hostels')
      .where('verified', '==', true)
      .limit(50)
      .get();

    const all = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as HostelDoc[];

    const results = all.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query)
    );

    return NextResponse.json(results.slice(0, 8), { status: 200 });
  } catch (error) {
    return handleApiError(error, 'GET /api/hostels/search');
  }
}
