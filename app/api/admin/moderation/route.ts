import { NextRequest, NextResponse } from 'next/server';
import { getIssueReports, getWasteReports, ModerationFilters } from '@/lib/firebase/services/moderation';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = req.nextUrl;
  const type = searchParams.get('type') as 'issues' | 'waste' | null;
  const filters: ModerationFilters = {};
  const status = searchParams.get('status');
  if (status) filters.status = status;

  try {
    if (type === 'waste') {
      const data = await getWasteReports(filters);
      return NextResponse.json(data);
    } else {
      const data = await getIssueReports(filters);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Moderation API error:', error);
    return NextResponse.json({ error: 'Failed to fetch moderation data' }, { status: 500 });
  }
}
