import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  // 1. Security check: Only Admins can approve
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    // 2. Fetch the user document
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userSnap.data();

    // 3. Validate this is a pending collector
    if (userData.status !== 'PENDING_APPROVAL' || userData.requestedRole !== 'COLLECTOR') {
      return NextResponse.json({ error: 'User is not pending collector approval' }, { status: 400 });
    }

    // 4. Update Firestore to ACTIVE and COLLECTOR role
    await updateDoc(userRef, {
      role: 'COLLECTOR',
      status: 'ACTIVE',
      updatedAt: new Date().toISOString()
    });

    // 5. Sync Firebase custom claims so JWT reflects new role immediately
    await adminAuth.setCustomUserClaims(id, { role: 'COLLECTOR' });

    return NextResponse.json({ success: true, message: 'Collector approved successfully' });
  } catch (error) {
    console.error('Approve collector error:', error);
    return NextResponse.json({ error: 'Failed to approve collector' }, { status: 500 });
  }
}
