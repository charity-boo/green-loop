import { describe, expect, it } from 'vitest';

import {
  collectorMatchesRegion,
  isEligibleForAssignment,
  selectLeastLoadedCollector,
} from '@/lib/admin/assignment-policy';
import type { AssignmentCollector, AssignmentSchedule } from '@/lib/admin/assignment-types';

function schedule(overrides: Partial<AssignmentSchedule> = {}): AssignmentSchedule {
  return {
    id: 'schedule-1',
    status: 'pending',
    paymentStatus: 'Paid',
    region: 'tharaka-nithi-ndagani',
    county: 'tharaka-nithi',
    ...overrides,
  };
}

function collector(id: string, overrides: Partial<AssignmentCollector> = {}): AssignmentCollector {
  return {
    id,
    role: 'COLLECTOR',
    active: true,
    status: 'ACTIVE',
    region: 'tharaka-nithi-ndagani',
    county: 'tharaka-nithi',
    ...overrides,
  };
}

describe('assignment-policy helpers', () => {
  it('isEligibleForAssignment requires pending + Paid and no existing collector', () => {
    expect(isEligibleForAssignment(schedule())).toBe(true);
    expect(isEligibleForAssignment(schedule({ paymentStatus: 'Unpaid' }))).toBe(false);
    expect(isEligibleForAssignment(schedule({ status: 'completed' }))).toBe(false);
    expect(isEligibleForAssignment(schedule({ collectorId: 'collector-1' }))).toBe(false);
    expect(isEligibleForAssignment(schedule({ assignedCollectorId: 'collector-1' }))).toBe(false);
  });

  it('collectorMatchesRegion supports exact region and county fallback', () => {
    expect(collectorMatchesRegion(collector('c1'), 'tharaka-nithi-ndagani', 'tharaka-nithi')).toBe(true);
    expect(
      collectorMatchesRegion(
        collector('c2', { region: 'kirinyaga-central', county: 'tharaka-nithi' }),
        'tharaka-nithi-ndagani',
        'tharaka-nithi',
      ),
    ).toBe(true);
    expect(
      collectorMatchesRegion(
        collector('c3', { region: 'kirinyaga-central', county: 'kirinyaga' }),
        'tharaka-nithi-ndagani',
        'tharaka-nithi',
      ),
    ).toBe(false);
  });

  it('selectLeastLoadedCollector picks lowest workload and is deterministic on ties', () => {
    const collectors = [collector('collector-b'), collector('collector-a'), collector('collector-c')];
    const workloads = new Map<string, number>([
      ['collector-a', 1],
      ['collector-b', 1],
      ['collector-c', 3],
    ]);

    const selected = selectLeastLoadedCollector(collectors, workloads);

    expect(selected?.id).toBe('collector-a');
  });
});
