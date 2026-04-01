export type CollectorLocationSource = 'manual' | 'gps' | 'google_autocomplete';

export interface CollectorLocationValidationInput {
  address: string;
  county: string;
  region: string;
  placeId?: string | null;
  locationSource?: CollectorLocationSource;
}

export interface CollectorLocationValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateCollectorLocationSelection(
  input: CollectorLocationValidationInput
): CollectorLocationValidationResult {
  if (!input.address || !input.county || !input.region) {
    return {
      isValid: false,
      error: 'Please fill in your address, county, and service area.',
    };
  }

  if (input.locationSource !== 'google_autocomplete' || !input.placeId) {
    return {
      isValid: false,
      error: 'Please select your location from Google suggestions.',
    };
  }

  return { isValid: true };
}
