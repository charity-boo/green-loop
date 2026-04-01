import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);
const mockConstructEvent = vi.hoisted(() => vi.fn());
const mockPaymentGet = vi.hoisted(() => vi.fn());
const mockPaymentUpdate = vi.hoisted(() => vi.fn());
const mockScheduleUpdate = vi.hoisted(() => vi.fn());
const mockScheduleGet = vi.hoisted(() => vi.fn());
const mockWasteGet = vi.hoisted(() => vi.fn());
const mockWasteUpdate = vi.hoisted(() => vi.fn());
const mockWriteWorkflowLog = vi.hoisted(() => vi.fn());
const mockAssignScheduleAutomatically = vi.hoisted(() => vi.fn());

vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));
vi.mock('@/lib/workflow-log', () => ({ writeWorkflowLog: mockWriteWorkflowLog }));
vi.mock('@/lib/admin/assignment', () => ({ 
  assignScheduleAutomatically: mockAssignScheduleAutomatically,
  autoAssignCollector: vi.fn(), // Keep legacy for types if needed but don't use
}));
vi.mock('stripe', () => {
  class MockStripe {
    webhooks = {
      constructEvent: mockConstructEvent,
    };
  }
  return { default: MockStripe };
});

vi.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    collection: vi.fn((name: string) => {
      if (name === 'payments') {
        return {
          doc: vi.fn(() => ({
            get: mockPaymentGet,
            update: mockPaymentUpdate,
          })),
        };
      }

      if (name === 'schedules') {
        return {
          doc: vi.fn(() => ({
            update: mockScheduleUpdate,
            get: mockScheduleGet,
          })),
        };
      }

      if (name === 'waste') {
        return {
          doc: vi.fn(() => ({
            get: mockWasteGet,
            update: mockWasteUpdate,
          })),
        };
      }

      return { doc: vi.fn() };
    }),
  },
}));

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy';

import { POST } from '@/app/api/payment/webhook/route';

describe('POST /api/payment/webhook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('triggers auto-assignment from webhook server flow and does not set collector fields directly', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          metadata: {
            paymentId: 'payment-1',
            wasteId: 'waste-1',
          },
          payment_intent: 'pi_123',
        },
      },
    });

    mockPaymentGet.mockResolvedValue({
      exists: true,
      data: () => ({ status: 'SUCCESS' }),
    });
    mockScheduleGet.mockResolvedValue({
      exists: true,
      data: () => ({ region: 'Ndagani', status: 'pending', paymentStatus: 'Unpaid' }),
    });
    mockWasteGet.mockResolvedValue({ exists: false });
    mockAssignScheduleAutomatically.mockResolvedValue({ assignedCollectorId: 'collector-1', reason: 'assigned' });

    const req = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockScheduleUpdate).toHaveBeenCalledWith(
      {
        paymentStatus: 'Paid',
        stripeSessionId: 'cs_test_123',
        updatedAt: expect.any(String),
      },
    );
    expect(mockScheduleUpdate).not.toHaveBeenCalledWith(expect.objectContaining({ collectorId: expect.any(String) }));
    expect(mockScheduleUpdate).not.toHaveBeenCalledWith(expect.objectContaining({ assignedCollectorId: expect.any(String) }));
    expect(mockAssignScheduleAutomatically).toHaveBeenCalledWith('waste-1');
  });

  it('skips auto-assignment when schedule region is missing', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_456',
          metadata: {
            paymentId: 'payment-1',
            wasteId: 'waste-1',
          },
          payment_intent: 'pi_456',
        },
      },
    });

    mockPaymentGet.mockResolvedValue({
      exists: true,
      data: () => ({ status: 'SUCCESS' }),
    });
    mockScheduleGet.mockResolvedValue({
      exists: true,
      data: () => ({ status: 'pending', paymentStatus: 'Unpaid' }),
    });
    mockWasteGet.mockResolvedValue({ exists: false });

    const req = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockAssignScheduleAutomatically).not.toHaveBeenCalled();
    expect(mockWriteWorkflowLog).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'assignment_failed',
        metadata: { reason: 'missing_region' },
      }),
    );
  });

  it('remains idempotent when checkout.session.completed webhook is retried', async () => {
    mockConstructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_retry',
          metadata: {
            paymentId: 'payment-1',
            wasteId: 'waste-1',
          },
          payment_intent: 'pi_retry',
        },
      },
    });

    mockPaymentGet.mockResolvedValue({
      exists: true,
      data: () => ({ status: 'SUCCESS' }),
    });
    mockScheduleGet.mockResolvedValue({
      exists: true,
      data: () => ({ region: 'Ndagani', status: 'assigned', paymentStatus: 'Paid', collectorId: 'collector-1' }),
    });
    mockWasteGet.mockResolvedValue({ exists: false });
    mockAssignScheduleAutomatically.mockResolvedValue({ assignedCollectorId: 'collector-1', reason: 'already_assigned' });

    const firstReq = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test' },
      body: JSON.stringify({}),
    });
    const secondReq = new Request('http://localhost/api/payment/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'sig_test' },
      body: JSON.stringify({}),
    });

    const firstRes = await POST(firstReq);
    const secondRes = await POST(secondReq);

    expect(firstRes.status).toBe(200);
    expect(secondRes.status).toBe(200);
    expect(mockPaymentUpdate).not.toHaveBeenCalled();
    expect(mockAssignScheduleAutomatically).toHaveBeenCalledTimes(2);
    expect(mockAssignScheduleAutomatically).toHaveBeenCalledWith('waste-1');
  });
});

