import { NextRequest, NextResponse } from 'next/server';
import { updateIssueReport, updateWasteReport, updateContactMessage } from '@/lib/firebase/services/moderation';
import { notifyModerationAction } from '@/lib/firebase/services/notifications';
import { getSession } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { type, status, comment, userId } = body;

  try {
    if (type === 'waste') {
      await updateWasteReport(session.user.id, id, status, comment);
      if (userId) {
        await notifyModerationAction(userId, id, 'WasteReport', status, comment);
      }
    } else if (type === 'message') {
      await updateContactMessage(session.user.id, id, status);
    } else {
      await updateIssueReport(session.user.id, id, status, comment);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update moderation error:', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
