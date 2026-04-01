import { describe, expect, it } from 'vitest';

import { validatePickupDetails } from '@/lib/location/pickup-details-validation';

describe('validatePickupDetails', () => {
  it('rejects non-google selection for schedule pickup address', () => {
    const result = validatePickupDetails({
      address: 'Moi Avenue, Nairobi',
      region: 'nairobi-cbd',
      date: new Date('2026-04-01'),
      timeSlot: 'morning',
      placeId: null,
      locationSource: 'manual',
    });

    expect(result).toEqual({
      isValid: false,
      error: 'Please select your pickup address from Google suggestions.',
    });
  });

  it('accepts google autocomplete selection with place id', () => {
    const result = validatePickupDetails({
      address: 'Kenyatta Avenue, Nairobi, Kenya',
      region: 'nairobi-cbd',
      date: new Date('2026-04-01'),
      timeSlot: 'morning',
      placeId: 'ChIJ-example',
      locationSource: 'google_autocomplete',
    });

    expect(result).toEqual({ isValid: true });
  });
});
