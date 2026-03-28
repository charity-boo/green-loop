import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('educational_videos')
      .orderBy('order', 'asc')
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ videos: [], total: 0 });
    }

    const videos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ videos, total: videos.length });
  } catch (error) {
    console.error('[API /videos] Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos', videos: [] },
      { status: 500 }
    );
  }
}
