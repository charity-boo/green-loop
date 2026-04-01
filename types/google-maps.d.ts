declare namespace google.maps {
  function importLibrary(name: string, opts?: unknown): Promise<unknown>;

  interface PlacesLibrary {
    AutocompleteSessionToken: new () => google.maps.places.AutocompleteSessionToken;
    AutocompleteSuggestion: {
      fetchAutocompleteSuggestions: (
        request: google.maps.places.AutocompleteRequest
      ) => Promise<{ suggestions: google.maps.places.AutocompleteSuggestion[] }>;
    };
    Place: new (request: { id: string }) => google.maps.places.Place;
  }
}

declare namespace google.maps.places {
  interface AddressComponent {
    long_name?: string;
    short_name?: string;
    longText?: string;
    shortText?: string;
    types: string[];
  }

  interface FormattableText {
    text: string;
  }

  interface Place {
    id?: string;
    formattedAddress?: string;
    addressComponents?: AddressComponent[];
    location?: {
      lat: () => number;
      lng: () => number;
    };
    fetchFields: (request: { fields: string[] }) => Promise<{ place: Place }>;
  }

  interface PlacePrediction {
    placeId: string;
    text: FormattableText;
    mainText?: FormattableText;
    secondaryText?: FormattableText;
    toPlace: () => Place;
  }

  interface AutocompleteSuggestion {
    placePrediction?: PlacePrediction;
  }

  class AutocompleteSessionToken {}

  interface AutocompleteRequest {
    input: string;
    includedRegionCodes?: string[];
    sessionToken?: AutocompleteSessionToken;
  }
}
