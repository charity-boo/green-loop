import { prisma } from '@/lib/prisma';

/**
 * Creates a new in-app notification for a user.
 * 
 * @param data - The notification data
 * @param data.userId - The ID of the user to receive the notification
 * @param data.type - The type of notification (e.g., SCHEDULE_ASSIGNED, PICKUP_COMPLETED)
 * @param data.message - The notification message to display
 * @param data.relatedScheduleId - Optional ID of the schedule related to this notification
 * @returns The created notification record
 * @throws Error if the notification creation fails
 */
export async function createNotification(data: {
  userId: string;
  type: string;
  message: string;
  relatedScheduleId?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        relatedScheduleId: data.relatedScheduleId,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification. Please check the provided data and database connection.');
  }
}
