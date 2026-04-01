import { describe, expect, it } from 'vitest';

import { validateCollectorLocationSelection } from '@/lib/location/collector-location-validation';

describe('validateCollectorLocationSelection', () => {
  it('rejects collector location when google suggestion was not selected', () => {
    const result = validateCollectorLocationSelection({
      address: 'Moi Avenue, Nairobi',
      county: 'nairobi',
      region: 'nairobi-cbd',
      placeId: null,
      locationSource: 'manual',
    });

    expect(result).toEqual({
      isValid: false,
      error: 'Please select your location from Google suggestions.',
    });
  });

  it('accepts collector location selected from google suggestions', () => {
    const result = validateCollectorLocationSelection({
      address: 'Kenyatta Avenue, Nairobi, Kenya',
      county: 'nairobi',
      region: 'nairobi-cbd',
      placeId: 'ChIJ-example',
      locationSource: 'google_autocomplete',
    });

    expect(result).toEqual({ isValid: true });
  });
});
