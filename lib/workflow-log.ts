import { adminDb } from '@/lib/firebase/admin';

export type WorkflowActorType = 'system' | 'user' | 'collector' | 'admin' | 'stripe';

export type WorkflowEvent =
  | 'schedule_created'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'assignment_attempted'
  | 'assignment_succeeded'
  | 'assignment_failed'
  | 'collector_task_status_updated'
  | 'collector_task_collected'
  | 'collector_task_completed';

export type WorkflowLogInput = {
  event: WorkflowEvent;
  scheduleId: string;
  wasteId?: string | null;
  paymentId?: string | null;
  paymentIntentId?: string | null;
  stripeSessionId?: string | null;
  actorType: WorkflowActorType;
  actorId?: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
};

export type WorkflowLogDoc = WorkflowLogInput & {
  id: string;
  createdAt: string;
};

export async function writeWorkflowLog(input: WorkflowLogInput): Promise<string> {
  const payload = {
    ...input,
    wasteId: input.wasteId ?? input.scheduleId,
    paymentId: input.paymentId ?? null,
    paymentIntentId: input.paymentIntentId ?? null,
    stripeSessionId: input.stripeSessionId ?? null,
    actorId: input.actorId ?? null,
    before: input.before ?? null,
    after: input.after ?? null,
    metadata: input.metadata ?? null,
    createdAt: new Date().toISOString(),
  };

  const ref = await adminDb.collection('workflow_logs').add(payload);

  console.info('[WorkflowLog]', JSON.stringify({
    id: ref.id,
    event: payload.event,
    scheduleId: payload.scheduleId,
    wasteId: payload.wasteId,
    actorType: payload.actorType,
    actorId: payload.actorId,
  }));

  return ref.id;
}

export async function getWorkflowTimeline(scheduleId: string): Promise<WorkflowLogDoc[]> {
  const snapshot = await adminDb
    .collection('workflow_logs')
    .where('scheduleId', '==', scheduleId)
    .get();

  return (snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() })) as unknown as WorkflowLogDoc[])
    .sort((a, b) => {
      const left = typeof a.createdAt === 'string' ? a.createdAt : '';
      const right = typeof b.createdAt === 'string' ? b.createdAt : '';
      return left.localeCompare(right);
    });
}
