import { describe, expect, it } from 'vitest';
import { isEligibleForAssignment } from '@/lib/admin/assignment-policy';
import { AssignmentSchedule } from '@/lib/admin/assignment-types';

describe('isEligibleForAssignment', () => {
  it('returns true for pending, paid, and unassigned schedules', () => {
    const schedule: AssignmentSchedule = {
      id: 's1',
      status: 'pending',
      paymentStatus: 'Paid',
    };
    expect(isEligibleForAssignment(schedule)).toBe(true);
  });

  it('returns false if already assigned (assignedCollectorId)', () => {
    const schedule: AssignmentSchedule = {
      id: 's1',
      status: 'pending',
      paymentStatus: 'Paid',
      assignedCollectorId: 'c1',
    };
    expect(isEligibleForAssignment(schedule)).toBe(false);
  });

  it('returns false if already assigned (collectorId legacy)', () => {
    const schedule: AssignmentSchedule = {
      id: 's1',
      status: 'pending',
      paymentStatus: 'Paid',
      collectorId: 'c1',
    };
    expect(isEligibleForAssignment(schedule)).toBe(false);
  });

  it('returns false if status is not pending', () => {
    const schedule: AssignmentSchedule = {
      id: 's1',
      status: 'assigned',
      paymentStatus: 'Paid',
    };
    expect(isEligibleForAssignment(schedule)).toBe(false);
  });

  it('returns false if paymentStatus is not Paid', () => {
    const schedule: AssignmentSchedule = {
      id: 's1',
      status: 'pending',
      paymentStatus: 'Unpaid',
    };
    expect(isEligibleForAssignment(schedule)).toBe(false);
  });
});
