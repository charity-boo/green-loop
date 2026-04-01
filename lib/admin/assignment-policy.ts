import type { AssignmentCollector, AssignmentSchedule } from '@/lib/admin/assignment-types';

export function isEligibleForAssignment(schedule: AssignmentSchedule): boolean {
  const assignedCollectorId = schedule.assignedCollectorId ?? schedule.collectorId;
  return schedule.status === 'pending' && schedule.paymentStatus === 'Paid' && !assignedCollectorId;
}

export function collectorMatchesRegion(
  collector: AssignmentCollector,
  scheduleRegion: string,
  scheduleCounty?: string,
): boolean {
  if (!scheduleRegion) {
    return false;
  }

  if (collector.region === scheduleRegion) {
    return true;
  }

  if (!scheduleCounty) {
    return false;
  }

  return collector.region === scheduleCounty || collector.county === scheduleCounty;
}

export function selectLeastLoadedCollector(
  collectors: AssignmentCollector[],
  workloads: Map<string, number>,
): AssignmentCollector | null {
  if (collectors.length === 0) {
    return null;
  }

  return [...collectors].sort((a, b) => {
    const loadA = workloads.get(a.id) ?? 0;
    const loadB = workloads.get(b.id) ?? 0;

    if (loadA !== loadB) {
      return loadA - loadB;
    }

    return a.id.localeCompare(b.id);
  })[0];
}
