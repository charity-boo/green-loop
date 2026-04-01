import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';

/**
 * DECOMMISSIONED: Manual job claiming is disabled in favor of Region-Based Auto Assignment.
 * This route now always returns 409 Conflict.
 */
export async function POST() {
  try {
    const session = await getSession();
    await authorize(session, ['COLLECTOR', 'ADMIN']);

    return NextResponse.json(
      { 
        error: 'Manual claiming is disabled. Jobs are assigned automatically by region based on least workload.',
        code: 'MANUAL_CLAIM_DISABLED'
      },
      { status: 409 }
    );
  } catch (error) {
    console.error('POST /api/collector/accept-job error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
