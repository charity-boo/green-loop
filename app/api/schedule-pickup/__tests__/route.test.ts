import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { getSession } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

const mockJsonFn = vi.fn((data: any, init?: any) => ({
  status: init?.status ?? 200,
  json: async () => data,
}));

vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init?: any) => mockJsonFn(data, init),
  },
}));

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

vi.mock('@/lib/middleware/authorize', () => ({
  authorize: vi.fn().mockResolvedValue(true),
}));

vi.mock('@/lib/api-handler', () => ({
  handleApiError: vi.fn((err) => {
    console.error('Mocked handleApiError:', err);
    return { status: 500, json: async () => ({ error: err.message }) };
  }),
}));

vi.mock('@/lib/workflow-log', () => ({
  writeWorkflowLog: vi.fn().mockResolvedValue('log-123'),
}));

vi.mock('@/lib/firebase/admin', () => {
  const mockDoc = {
    get: vi.fn().mockResolvedValue({
      exists: true,
      data: () => ({ phoneNumber: '1234567890' }),
    }),
  };
  const mockQuery = {
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    get: vi.fn().mockResolvedValue({ empty: true, docs: [] }),
  };
  const mockCollection = {
    doc: vi.fn().mockReturnValue(mockDoc),
    add: vi.fn().mockResolvedValue({ id: 'schedule-123' }),
    where: vi.fn().mockReturnValue(mockQuery),
  };
  return {
    adminDb: {
      collection: vi.fn().mockReturnValue(mockCollection),
    },
  };
});

describe('POST /api/schedule-pickup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validBody = {
    wasteType: 'Plastic',
    classificationSource: 'manual',
    address: '123 Main St',
    region: 'Nairobi',
    timeSlot: 'Morning',
  };

  const userSession = {
    user: { id: 'user-1', email: 'user@test.com', name: 'Test User', role: 'USER' as const },
    expires: new Date(Date.now() + 3600000).toISOString(),
  };

  it('successfully schedules a pickup when valid data is provided', async () => {
    vi.mocked(getSession).mockResolvedValue(userSession as any);

    const req = new Request('http://localhost/api/schedule-pickup', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data).toEqual({ id: 'schedule-123' });
    
    // Verify adminDb.collection('schedules').add was called
    expect(adminDb.collection).toHaveBeenCalledWith('schedules');
  });

  it('fails to schedule when the user already has an active pickup', async () => {
    vi.mocked(getSession).mockResolvedValue(userSession as any);

    // Mock active schedules check to return a non-empty result
    const mockQuery = {
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ empty: false, docs: [{ id: 'existing-123' }] }),
    };
    
    // We need to ensure the first call to collection('schedules').where() returns this mockQuery
    vi.mocked(adminDb.collection).mockReturnValueOnce({
      where: vi.fn().mockReturnValue(mockQuery),
    } as any);

    const req = new Request('http://localhost/api/schedule-pickup', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('already have an active pickup');
  });

  it('returns 400 when validation fails', async () => {
    vi.mocked(getSession).mockResolvedValue(userSession as any);

    const req = new Request('http://localhost/api/schedule-pickup', {
      method: 'POST',
      body: JSON.stringify({ wasteType: '' }), // Invalid data
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Validation failed');
  });
});
