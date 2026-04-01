import { describe, it, expect, vi, beforeEach } from 'vitest';

const addMock = vi.hoisted(() => vi.fn());
const collectionMock = vi.hoisted(() => vi.fn(() => ({ add: addMock })));

vi.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    collection: collectionMock,
  },
}));

import { writeWorkflowLog } from '@/lib/workflow-log';

describe('writeWorkflowLog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes a workflow log entry with correlation fields', async () => {
    addMock.mockResolvedValue({ id: 'log-1' });

    await writeWorkflowLog({
      event: 'schedule_created',
      scheduleId: 'schedule-1',
      wasteId: 'schedule-1',
      actorType: 'user',
      actorId: 'user-1',
      metadata: { source: 'api' },
    });

    expect(collectionMock).toHaveBeenCalledWith('workflow_logs');
    expect(addMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'schedule_created',
        scheduleId: 'schedule-1',
        wasteId: 'schedule-1',
        actorType: 'user',
        actorId: 'user-1',
        metadata: { source: 'api' },
        createdAt: expect.any(String),
      })
    );
  });
});
