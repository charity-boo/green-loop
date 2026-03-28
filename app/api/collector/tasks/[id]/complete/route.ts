import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { authorize } from '@/lib/middleware/authorize';
import { adminDb, admin } from '@/lib/firebase/admin';
import { WasteStatus } from '@/types/waste-status';
import { createErrorResponse } from '@/lib/api-response';
import { handleApiError } from '@/lib/api-handler';
import { calculateRewardPoints } from '@/lib/utils/reward-calculator';

/**
 * POST /api/collector/tasks/[id]/complete - Mark a task as completed
 * Protected: Requires "collector" role
 * Scoped: Collector can only complete tasks assigned to them
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    await authorize(session, ['COLLECTOR', 'ADMIN']);
    const collectorId = session!.user.id;

    // Use a transaction to ensure atomic updates and idempotency
    const updatedWasteItem = await adminDb.runTransaction(async (transaction) => {
      const wasteRef = adminDb.collection('waste').doc(id);
      const wasteDoc = await transaction.get(wasteRef);

      if (!wasteDoc.exists) {
        throw new Error('WASTE_NOT_FOUND');
      }

      const wasteItem = wasteDoc.data();

      if (!wasteItem) {
        throw new Error('WASTE_DATA_EMPTY');
      }

      // Ensure collector can only complete their own assigned tasks
      if (wasteItem.assignedCollectorId !== collectorId && session!.user.role !== 'ADMIN') {
        throw new Error('FORBIDDEN');
      }

      // Idempotency: if already completed, return success without double awarding
      if (wasteItem.status === WasteStatus.Completed) {
        return {
          id,
          ...wasteItem
        };
      }

      if (wasteItem.status !== WasteStatus.Collected) {
        throw new Error('INVALID_STATUS');
      }

      const userRef = adminDb.collection('users').doc(wasteItem.userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error('USER_NOT_FOUND');
      }

      // Calculate points earned
      const pointsEarned = calculateRewardPoints(
        wasteItem.wasteItem?.formValue || wasteItem.wasteType || 'general',
        wasteItem.wasteItem?.probability || wasteItem.aiConfidence || 0
      );

      const updateData = {
        status: WasteStatus.Completed,
        pointsEarned,
        updatedAt: new Date().toISOString()
      };

      // Update waste document
      transaction.update(wasteRef, updateData);

      // Award points to user
      transaction.update(userRef, {
        rewardPoints: admin.firestore.FieldValue.increment(pointsEarned)
      });

      // Create notification for reward earned
      const notificationRef = adminDb.collection('notifications').doc();
      transaction.set(notificationRef, {
        userId: wasteItem.userId,
        role: 'USER',
        type: 'reward_earned',
        title: 'Reward Earned',
        message: `You earned ${pointsEarned} Green Points from your recent pickup.`,
        status: 'unread',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        id,
        ...wasteItem,
        ...updateData
      };
    });

    return NextResponse.json(updatedWasteItem);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === 'WASTE_NOT_FOUND') {
      return createErrorResponse('Waste item not found', undefined, 404);
    }
    if (message === 'WASTE_DATA_EMPTY') {
      return createErrorResponse('Waste item data is empty', undefined, 404);
    }
    if (message === 'FORBIDDEN') {
      return createErrorResponse('Forbidden: You are not assigned to this task', undefined, 403);
    }
    if (message === 'INVALID_STATUS') {
      return createErrorResponse('Waste item must be collected before completing.', undefined, 400);
    }
    if (message === 'USER_NOT_FOUND') {
      return createErrorResponse('User document not found for this waste item', undefined, 404);
    }
    return handleApiError(error, 'POST /api/collector/tasks/[id]/complete');
  }
}
