import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getWorkflowTimeline } from '@/lib/workflow-log';
import { createErrorResponse } from '@/lib/api-response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scheduleId: string }> }
) {
  const session = await getSession();
  if (!session || session.user.role !== 'ADMIN') {
    return createErrorResponse('Forbidden', undefined, 403);
  }

  const { scheduleId } = await params;
  if (!scheduleId) {
    return createErrorResponse('scheduleId is required', undefined, 400);
  }

  const timeline = await getWorkflowTimeline(scheduleId);
  return NextResponse.json({ scheduleId, timeline });
}
