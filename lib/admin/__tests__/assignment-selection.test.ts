import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockScheduleGet = vi.hoisted(() => vi.fn());
const mockUsersGet = vi.hoisted(() => vi.fn());
const mockWasteGet = vi.hoisted(() => vi.fn());
const mockRunTransaction = vi.hoisted(() => vi.fn());
const mockWriteWorkflowLog = vi.hoisted(() => vi.fn());
const mockGetCountyForRegion = vi.hoisted(() => vi.fn(() => ({ value: 'tharaka-nithi' })));

vi.mock('@/lib/workflow-log', () => ({ writeWorkflowLog: mockWriteWorkflowLog }));
vi.mock('@/lib/constants/regions', () => ({ getCountyForRegion: mockGetCountyForRegion }));
vi.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    runTransaction: mockRunTransaction,
    collection: vi.fn((name: string) => {
      if (name === 'schedules') {
        return {
          doc: vi.fn(() => ({ get: mockScheduleGet })),
        };
      }

      if (name === 'users') {
        const whereSecond = vi.fn(() => ({ get: mockUsersGet }));
        const whereFirst = vi.fn(() => ({ where: whereSecond }));
        return { where: whereFirst };
      }

      if (name === 'waste') {
        const whereSecond = vi.fn(() => ({ get: mockWasteGet }));
        const whereFirst = vi.fn(() => ({ where: whereSecond }));
        return { where: whereFirst, doc: vi.fn(() => ({ id: 'waste-doc' })) };
      }

      return {};
    }),
  },
}));

import { assignScheduleAutomatically } from '@/lib/admin/assignment';

describe('assignScheduleAutomatically', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns missing_region when schedule region is absent', async () => {
    mockScheduleGet.mockResolvedValue({
      exists: true,
      id: 'schedule-1',
      data: () => ({ status: 'pending', paymentStatus: 'Paid' }),
    });

    const result = await assignScheduleAutomatically('schedule-1');

    expect(result).toEqual({ assignedCollectorId: null, reason: 'missing_region' });
    expect(mockWriteWorkflowLog).toHaveBeenCalledWith(expect.objectContaining({
      event: 'assignment_failed',
      metadata: expect.objectContaining({ reason: 'missing_region' }),
    }));
  });

  it('returns existing collector for already assigned schedules', async () => {
    mockScheduleGet.mockResolvedValue({
      exists: true,
      id: 'schedule-1',
      data: () => ({
        status: 'assigned',
        paymentStatus: 'Paid',
        region: 'tharaka-nithi-ndagani',
        collectorId: 'collector-existing',
      }),
    });

    const result = await assignScheduleAutomatically('schedule-1');

    expect(result).toEqual({ assignedCollectorId: 'collector-existing', reason: 'already_assigned' });
    expect(mockRunTransaction).not.toHaveBeenCalled();
  });
});
