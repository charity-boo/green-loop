/**
 * API Route: POST /api/notifications
 * 
 * Create notifications in Firestore (admin operation)
 * Only authenticated admins can create notifications for broadcasting
 * 
 * Usage:
 *   await fetch('/api/notifications', {
 *     method: 'POST',
 *     body: JSON.stringify({
 *       role: 'ADMIN',
 *       title: 'System Alert',
 *       message: 'Scheduled maintenance',
 *       type: 'alert',
 *     }),
 *   });
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { addNotification } from '@/lib/firebase/notifications';
import { notificationRequestSchema } from '@/lib/validation/schemas';
import { createValidationErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';

export async function POST(request: NextRequest) {
  try {
    // Verify admin role
    const session = await getSession();
    await authorize(session, ['ADMIN']);

    const body = await request.json();
    const validation = notificationRequestSchema.safeParse(body);

    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { role, title, message, type, userId } = validation.data;

    // Create notification in Firestore
    const notificationId = await addNotification({
      role: role,
      title: title,
      message: message,
      type: type,
      status: 'unread',
      userId: userId,
    });

    return NextResponse.json(
      {
        success: true,
        notificationId,
        message: 'Notification created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, 'POST /api/notifications');
  }
}

/**
 * GET /api/notifications
 * Get authenticated user's notifications
 */
export async function GET() {
  try {
    const session = await getSession();
    await authorize(session, ['USER', 'COLLECTOR', 'ADMIN']);

    return NextResponse.json(
      {
        message: 'Use Firestore SDK for fetching notifications with real-time updates',
        userId: session!.user.id,
        role: session!.user.role,
        hint: 'Import useNotifications from @/hooks/use-notifications',
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, 'GET /api/notifications');
  }
}
