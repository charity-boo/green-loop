import { getCountyForRegion } from '@/lib/constants/regions';
import { adminDb } from '@/lib/firebase/admin';
import { writeWorkflowLog } from '@/lib/workflow-log';
import type {
  AssignmentCollector,
  AssignmentReasonCode,
  AssignmentResult,
  AssignmentSchedule,
} from '@/lib/admin/assignment-types';
import {
  collectorMatchesRegion,
  isEligibleForAssignment,
  selectLeastLoadedCollector,
} from '@/lib/admin/assignment-policy';

function asSchedule(id: string, data: Record<string, unknown> | undefined): AssignmentSchedule {
  return { id, ...(data ?? {}) } as AssignmentSchedule;
}

function isCollectorActive(collector: AssignmentCollector): boolean {
  return (
    collector.active === true ||
    collector.status === 'ACTIVE' ||
    collector.status === 'active' ||
    (!collector.status && collector.active !== false)
  );
}

async function logAssignmentFailure(
  scheduleId: string,
  reason: AssignmentReasonCode,
  metadata?: Record<string, unknown>,
): Promise<void> {
  await writeWorkflowLog({
    event: 'assignment_failed',
    scheduleId,
    wasteId: scheduleId,
    actorType: 'system',
    metadata: { reason, ...(metadata ?? {}) },
  });
}

function buildWasteAssignmentPayload(
  scheduleId: string,
  scheduleData: AssignmentSchedule,
  collectorId: string,
  county: string | null,
  now: string,
): Record<string, unknown> {
  return {
    scheduleId,
    userId: scheduleData.userId ?? null,
    userName: scheduleData.userName ?? 'User',
    userPhone: scheduleData.userPhone ?? null,
    collectorId,
    assignedCollectorId: collectorId,
    status: 'pending',
    paymentStatus: 'Paid',
    wasteType: scheduleData.wasteType ?? null,
    address: scheduleData.address ?? null,
    county: scheduleData.county ?? county,
    region: scheduleData.region ?? null,
    placeId: scheduleData.placeId ?? null,
    locationSource: scheduleData.locationSource ?? 'manual',
    latitude: scheduleData.latitude ?? null,
    longitude: scheduleData.longitude ?? null,
    pickupDate: scheduleData.pickupDate ?? null,
    timeSlot: scheduleData.timeSlot ?? null,
    updatedAt: now,
    createdAt: scheduleData.createdAt ?? now,
  };
}

async function assignSchedule(
  scheduleId: string,
  maybeExistingData?: AssignmentSchedule,
): Promise<AssignmentResult> {
  const scheduleRef = adminDb.collection('schedules').doc(scheduleId);
  const wasteRef = adminDb.collection('waste').doc(scheduleId);

  const scheduleData = maybeExistingData
    ? { ...maybeExistingData, id: scheduleId }
    : (() => undefined)();

  const initialSchedule = scheduleData
    ? scheduleData
    : (() => undefined)();

  const hydratedSchedule = initialSchedule
    ? initialSchedule
    : asSchedule(scheduleId, (await scheduleRef.get()).data() as Record<string, unknown> | undefined);

  if (!hydratedSchedule || Object.keys(hydratedSchedule).length === 1) {
    await logAssignmentFailure(scheduleId, 'schedule_not_found');
    return { assignedCollectorId: null, reason: 'schedule_not_found' };
  }

  const existingCollectorId = hydratedSchedule.assignedCollectorId ?? hydratedSchedule.collectorId;
  if (existingCollectorId) {
    await logAssignmentFailure(scheduleId, 'already_assigned', { collectorId: existingCollectorId });
    return { assignedCollectorId: existingCollectorId, reason: 'already_assigned' };
  }

  const scheduleRegion = hydratedSchedule.region;
  if (!scheduleRegion) {
    await logAssignmentFailure(scheduleId, 'missing_region');
    return { assignedCollectorId: null, reason: 'missing_region' };
  }

  const county = hydratedSchedule.county ?? getCountyForRegion(scheduleRegion)?.value ?? null;

  if (!isEligibleForAssignment(hydratedSchedule)) {
    await logAssignmentFailure(scheduleId, 'not_eligible', {
      status: hydratedSchedule.status ?? null,
      paymentStatus: hydratedSchedule.paymentStatus ?? null,
    });
    return { assignedCollectorId: null, reason: 'not_eligible' };
  }

  const collectorsSnapshot = await adminDb.collection('users').where('role', '==', 'COLLECTOR').get();
  const collectors = collectorsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Record<string, unknown>),
  })) as AssignmentCollector[];

  const matchingCollectors = collectors.filter(
    (collector) =>
      isCollectorActive(collector) &&
      collectorMatchesRegion(collector, scheduleRegion, county ?? undefined),
  );

  if (matchingCollectors.length === 0) {
    await logAssignmentFailure(scheduleId, 'no_active_collectors', { region: scheduleRegion, county });
    return { assignedCollectorId: null, reason: 'no_active_collectors' };
  }

  const candidateCollectorIds = new Set(matchingCollectors.map((collector) => collector.id));
  const workloads = new Map<string, number>(matchingCollectors.map((collector) => [collector.id, 0]));

  const pendingOrActiveWasteSnapshot = await adminDb
    .collection('waste')
    .where('status', 'in', ['pending', 'active'])
    .get();

  for (const doc of pendingOrActiveWasteSnapshot.docs) {
    const wasteData = doc.data() as Record<string, unknown>;
    const assignedId =
      (typeof wasteData.assignedCollectorId === 'string' && wasteData.assignedCollectorId) ||
      (typeof wasteData.collectorId === 'string' && wasteData.collectorId) ||
      null;

    if (assignedId && candidateCollectorIds.has(assignedId)) {
      workloads.set(assignedId, (workloads.get(assignedId) ?? 0) + 1);
    }
  }

  const selectedCollector = selectLeastLoadedCollector(matchingCollectors, workloads);
  if (!selectedCollector) {
    await logAssignmentFailure(scheduleId, 'no_active_collectors', { region: scheduleRegion, county });
    return { assignedCollectorId: null, reason: 'no_active_collectors' };
  }

  const result = await adminDb.runTransaction(async (transaction) => {
    const latestScheduleSnapshot = await transaction.get(scheduleRef);
    if (!latestScheduleSnapshot.exists) {
      return { assignedCollectorId: null, reason: 'schedule_not_found' as AssignmentReasonCode, committed: false };
    }

    const latestSchedule = asSchedule(
      latestScheduleSnapshot.id,
      latestScheduleSnapshot.data() as Record<string, unknown> | undefined,
    );

    const latestAssignedCollectorId = latestSchedule.assignedCollectorId ?? latestSchedule.collectorId;
    if (latestAssignedCollectorId) {
      return {
        assignedCollectorId: latestAssignedCollectorId,
        reason: 'already_assigned' as AssignmentReasonCode,
        committed: false,
      };
    }

    if (!isEligibleForAssignment(latestSchedule)) {
      return { assignedCollectorId: null, reason: 'not_eligible' as AssignmentReasonCode, committed: false };
    }

    const now = new Date().toISOString();

    transaction.update(scheduleRef, {
      collectorId: selectedCollector.id,
      assignedCollectorId: selectedCollector.id,
      status: 'assigned',
      assignedAt: now,
      updatedAt: now,
    });

    transaction.set(
      wasteRef,
      buildWasteAssignmentPayload(scheduleId, latestSchedule, selectedCollector.id, county, now),
      { merge: true },
    );

    return {
      assignedCollectorId: selectedCollector.id,
      reason: 'assigned' as AssignmentReasonCode,
      committed: true,
      beforeStatus: latestSchedule.status ?? null,
    };
  });

  if (!result.committed) {
    await logAssignmentFailure(scheduleId, result.reason, {
      region: scheduleRegion,
      county,
      collectorId: result.assignedCollectorId,
    });
    return { assignedCollectorId: result.assignedCollectorId, reason: result.reason };
  }

  await writeWorkflowLog({
    event: 'assignment_succeeded',
    scheduleId,
    wasteId: scheduleId,
    actorType: 'system',
    actorId: result.assignedCollectorId,
    before: { status: result.beforeStatus },
    after: {
      status: 'assigned',
      collectorId: result.assignedCollectorId,
      assignedCollectorId: result.assignedCollectorId,
    },
    metadata: {
      region: scheduleRegion,
      county,
      reason: 'assigned',
      activeWorkload: workloads.get(result.assignedCollectorId ?? '') ?? 0,
    },
  });

  return { assignedCollectorId: result.assignedCollectorId, reason: 'assigned' };
}

export async function assignScheduleAutomatically(scheduleId: string): Promise<AssignmentResult> {
  await writeWorkflowLog({
    event: 'assignment_attempted',
    scheduleId,
    wasteId: scheduleId,
    actorType: 'system',
  });

  try {
    return await assignSchedule(scheduleId);
  } catch (error) {
    console.error(`[Assignment] Failed to auto-assign schedule ${scheduleId}:`, error);
    await logAssignmentFailure(scheduleId, 'unexpected_error', {
      message: error instanceof Error ? error.message : String(error),
    });
    return { assignedCollectorId: null, reason: 'unexpected_error' };
  }
}


export async function autoAssignCollector(
  scheduleId: string,
  region?: string,
  existingData?: Omit<AssignmentSchedule, 'id'>,
): Promise<string | null> {
  await writeWorkflowLog({
    event: 'assignment_attempted',
    scheduleId,
    wasteId: scheduleId,
    actorType: 'system',
    metadata: { region: region ?? existingData?.region ?? null },
  });

  try {
    const result = await assignSchedule(scheduleId, {
      id: scheduleId,
      ...(existingData ?? {}),
      region: existingData?.region ?? region,
    });

    return result.assignedCollectorId;
  } catch (error) {
    console.error(`[Assignment] Legacy autoAssignCollector failed for schedule ${scheduleId}:`, error);
    await logAssignmentFailure(scheduleId, 'unexpected_error', {
      message: error instanceof Error ? error.message : String(error),
      region: region ?? existingData?.region ?? null,
    });
    return null;
  }
}
