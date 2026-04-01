export type PickupLocationSource = 'manual' | 'gps' | 'google_autocomplete';

export interface PickupDetailsValidationInput {
  address: string;
  region: string;
  date: Date | undefined;
  timeSlot: string;
  placeId?: string | null;
  locationSource?: PickupLocationSource;
}

export interface PickupDetailsValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePickupDetails(input: PickupDetailsValidationInput): PickupDetailsValidationResult {
  if (!input.address || !input.date || !input.timeSlot || !input.region) {
    return {
      isValid: false,
      error: 'Please fill in all pickup details including region.',
    };
  }

  if (input.locationSource !== 'google_autocomplete' || !input.placeId) {
    return {
      isValid: false,
      error: 'Please select your pickup address from Google suggestions.',
    };
  }

  return { isValid: true };
}
