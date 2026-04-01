import { describe, expect, it } from 'vitest';
import { mapGoogleAddressToCoverage, type GoogleAddressComponent } from '../google-place-mapper';

describe('mapGoogleAddressToCoverage', () => {
  it('maps Tharaka Nithi + Ndagani to known county and sub-region values', () => {
    const components: GoogleAddressComponent[] = [
      { long_name: 'Ndagani', short_name: 'Ndagani', types: ['sublocality', 'political'] },
      { long_name: 'Tharaka-Nithi County', short_name: 'Tharaka-Nithi', types: ['administrative_area_level_1', 'political'] },
      { long_name: 'Kenya', short_name: 'KE', types: ['country', 'political'] },
    ];

    const result = mapGoogleAddressToCoverage(components);

    expect(result.county).toBe('tharaka-nithi');
    expect(result.region).toBe('tharaka-nithi-ndagani');
  });

  it('maps Nairobi + Westlands to known values', () => {
    const components: GoogleAddressComponent[] = [
      { long_name: 'Westlands', short_name: 'Westlands', types: ['sublocality_level_1', 'sublocality', 'political'] },
      { long_name: 'Nairobi County', short_name: 'Nairobi', types: ['administrative_area_level_1', 'political'] },
      { long_name: 'Kenya', short_name: 'KE', types: ['country', 'political'] },
    ];

    const result = mapGoogleAddressToCoverage(components);

    expect(result.county).toBe('nairobi');
    expect(result.region).toBe('nairobi-westlands');
  });



  it('maps Places API (New) addressComponents using administrative_area_level_1', () => {
    const components = [
      {
        longText: 'Westlands',
        shortText: 'Westlands',
        types: ['sublocality_level_1', 'sublocality', 'political'],
      },
      {
        longText: 'Nairobi County',
        shortText: 'Nairobi',
        types: ['administrative_area_level_1', 'political'],
      },
      {
        longText: 'Kenya',
        shortText: 'KE',
        types: ['country', 'political'],
      },
    ] satisfies GoogleAddressComponent[];

    const result = mapGoogleAddressToCoverage(components);

    expect(result.county).toBe('nairobi');
    expect(result.region).toBe('nairobi-westlands');
  });

  it('returns null region when no known sub-region can be mapped', () => {
    const components: GoogleAddressComponent[] = [
      { long_name: 'Some Unknown Area', short_name: 'Unknown', types: ['locality', 'political'] },
      { long_name: 'Nairobi County', short_name: 'Nairobi', types: ['administrative_area_level_1', 'political'] },
    ];

    const result = mapGoogleAddressToCoverage(components);

    expect(result.county).toBe('nairobi');
    expect(result.region).toBeNull();
  });
});

it('prefers administrative_area_level_1 for county mapping', () => {
  const components: GoogleAddressComponent[] = [
    { long_name: 'Westlands', short_name: 'Westlands', types: ['administrative_area_level_2', 'political'] },
    { long_name: 'Nairobi County', short_name: 'Nairobi', types: ['administrative_area_level_1', 'political'] },
  ];

  const result = mapGoogleAddressToCoverage(components);

  expect(result.county).toBe('nairobi');
});
