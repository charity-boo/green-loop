import type { GoogleAddressComponent } from '@/lib/location/google-place-mapper';

export type GooglePlaceDetails = {
  address: string | null;
  placeId: string | null;
  latitude: number | null;
  longitude: number | null;
  addressComponents: GoogleAddressComponent[];
};

const PLACE_FIELDS = ['id', 'formattedAddress', 'location', 'addressComponents'];

export async function fetchPlaceDetailsNew(
  placesLibrary: google.maps.PlacesLibrary | null,
  placeId: string
): Promise<GooglePlaceDetails | null> {
  if (!placesLibrary?.Place) {
    return null;
  }

  const place = new placesLibrary.Place({ id: placeId });
  await place.fetchFields({ fields: PLACE_FIELDS });

  const lat = place.location?.lat();
  const lng = place.location?.lng();

  return {
    address: place.formattedAddress ?? null,
    placeId: place.id ?? placeId,
    latitude: typeof lat === 'number' ? lat : null,
    longitude: typeof lng === 'number' ? lng : null,
    addressComponents: place.addressComponents ?? [],
  };
}
