import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NextRequest } from 'next/server';

const mockJsonFn = vi.hoisted(() =>
  vi.fn((data: unknown, init?: { status?: number }) => ({
    status: init?.status ?? 200,
    _body: data,
  })),
);

vi.mock('next/server', () => ({ NextResponse: { json: mockJsonFn } }));
vi.mock('@/lib/api-handler', () => ({ handleApiError: vi.fn(() => ({ status: 500, _body: { error: 'Internal error' } })) }));

vi.mock('@/lib/firebase/admin', () => {
  const mockCollection = {
    add: vi.fn(),
  };

  return {
    adminDb: {
      collection: vi.fn().mockReturnValue(mockCollection),
    },
  };
});

import { POST } from '@/app/api/hostels/book/route';
import { adminDb } from '@/lib/firebase/admin';

const mockAdminDb = vi.mocked(adminDb);

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/hostels/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }) as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/hostels/book', () => {
  it('stores required fields with Google autocomplete mapping details', async () => {
    const mockCollection = mockAdminDb.collection('hostel_bookings') as any;
    mockCollection.add.mockResolvedValue({ id: 'booking-1' });

    const payload = {
      propertyName: 'Sunset Gardens',
      location: 'Kilimani, Nairobi, Kenya',
      contactPerson: 'Jane Doe',
      email: 'jane@hostel.com',
      tier: 'Premium',
      placeId: 'place-123',
      latitude: -1.2921,
      longitude: 36.8219,
      county: 'Nairobi County',
      region: 'Nairobi',
      source: 'google_autocomplete',
    };

    const res = await POST(makeRequest(payload));

    expect(res.status).toBe(201);
    expect(mockCollection.add).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: payload.propertyName,
        location: payload.location,
        contactPerson: payload.contactPerson,
        email: payload.email,
        tier: payload.tier,
        placeId: payload.placeId,
        latitude: payload.latitude,
        longitude: payload.longitude,
        county: payload.county,
        region: payload.region,
        locationSource: payload.source,
        status: 'pending',
      }),
    );
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ propertyName: 'Only Name' }));

    expect(res.status).toBe(400);
    expect((res as any)._body).toEqual({ error: 'Missing required fields' });
  });
});
