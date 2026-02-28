import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

/**
 * POST /api/admin/sync-claims
 * Reads each user's role from Firestore and syncs it to Firebase custom claims.
 * Protected by a secret key — run once to fix users whose claims are missing.
 */
export async function POST(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const secret = searchParams.get('secret');

  if (!secret || secret !== process.env.ADMIN_SYNC_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const snapshot = await adminDb.collection('users').get();
  const results: { uid: string; email: string; role: string; status: string }[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const uid = doc.id;
    const role = data.role || 'USER';

    try {
      await adminAuth.setCustomUserClaims(uid, { role: role.toUpperCase() });
      results.push({ uid, email: data.email, role, status: 'synced' });
      console.log(`[sync-claims] Set role=${role} for ${data.email} (${uid})`);
    } catch (err) {
      console.error(`[sync-claims] Failed for ${uid}:`, err);
      results.push({ uid, email: data.email, role, status: 'error' });
    }
  }

  return NextResponse.json({ synced: results.length, results });
}
