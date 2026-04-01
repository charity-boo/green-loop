import { describe, expect, it, vi } from 'vitest';

import { fetchPlaceDetailsNew } from '../google-place-details';

describe('fetchPlaceDetailsNew', () => {
  it('fetches place details using Places API (New) Place class', async () => {
    const fetchFields = vi.fn().mockResolvedValue(undefined);

    const placeInstance = {
      id: 'place-123',
      formattedAddress: 'Westlands, Nairobi, Kenya',
      addressComponents: [
        {
          longText: 'Nairobi County',
          shortText: 'Nairobi',
          types: ['administrative_area_level_1', 'political'],
        },
      ],
      location: {
        lat: () => -1.2676,
        lng: () => 36.8108,
      },
      fetchFields,
    };

    class PlaceCtor {
      constructor(_request: { id: string }) {
        return placeInstance;
      }
    }
    const placeCtorSpy = vi.spyOn({ PlaceCtor }, 'PlaceCtor');

    const result = await fetchPlaceDetailsNew(
      {
        Place: placeCtorSpy as unknown as google.maps.PlacesLibrary['Place'],
      } as unknown as google.maps.PlacesLibrary,
      'place-123'
    );

    expect(placeCtorSpy).toHaveBeenCalledWith({ id: 'place-123' });
    expect(fetchFields).toHaveBeenCalledWith({
      fields: ['id', 'formattedAddress', 'location', 'addressComponents'],
    });
    expect(result).toEqual({
      address: 'Westlands, Nairobi, Kenya',
      placeId: 'place-123',
      latitude: -1.2676,
      longitude: 36.8108,
      addressComponents: placeInstance.addressComponents,
    });
  });

  it('returns null when Place class is unavailable', async () => {
    const result = await fetchPlaceDetailsNew({} as google.maps.PlacesLibrary, 'missing');

    expect(result).toBeNull();
  });
});
