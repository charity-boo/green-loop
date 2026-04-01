"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchPlaceDetailsNew } from '@/lib/location/google-place-details';
import { mapGoogleAddressToCoverage } from '@/lib/location/google-place-mapper';
import { loadGoogleMapsPlacesScript } from '@/lib/location/load-google-maps';

type Prediction = {
  placeId: string;
  mainText: string;
  secondaryText: string;
};

export type AddressSelection = {
  address: string;
  placeId: string | null;
  latitude: number | null;
  longitude: number | null;
  county: string | null;
  region: string | null;
  source: 'google_autocomplete';
};

interface AddressAutocompleteProps {
  value: string;
  onManualChange: (nextAddress: string) => void;
  onSelectAddress: (selection: AddressSelection) => void;
  placeholder?: string;
  className?: string;
  allowManualInput?: boolean;
}

export default function AddressAutocomplete({
  value,
  onManualChange,
  onSelectAddress,
  placeholder = 'Enter pickup address',
  className,
  allowManualInput = true,
}: AddressAutocompleteProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [showPredictions, setShowPredictions] = useState(false);
  const placesLibraryRef = useRef<google.maps.PlacesLibrary | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const activeQueryIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(value, 300);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    loadGoogleMapsPlacesScript(apiKey)
      .then(async () => {
        if (!window.google?.maps?.importLibrary) {
          console.error('Google Places script loaded but importLibrary is unavailable.');
          return;
        }

        const placesLib = (await window.google.maps.importLibrary('places')) as google.maps.PlacesLibrary;
        placesLibraryRef.current = placesLib;
      })
      .catch((error) => {
        console.error('Google Places failed to initialize:', error);
      });
  }, []);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (!placesLibraryRef.current) {
      return;
    }

    const queryId = ++activeQueryIdRef.current;
    const runLookup = async () => {
      try {
        setIsLoading(true);
        const placesLib = placesLibraryRef.current;
        if (!placesLib) return;

        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
        }

        if (!placesLib.AutocompleteSuggestion?.fetchAutocompleteSuggestions) {
          setPredictions([]);
          setShowPredictions(false);
          return;
        }

        const { suggestions } = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: debouncedSearchTerm,
          includedRegionCodes: ['ke'],
          sessionToken: sessionTokenRef.current as google.maps.places.AutocompleteSessionToken,
        });

        if (queryId !== activeQueryIdRef.current) return;

        const nextPredictions = suggestions
          .map((suggestion: google.maps.places.AutocompleteSuggestion) => suggestion.placePrediction)
          .filter((prediction): prediction is google.maps.places.PlacePrediction => Boolean(prediction))
          .map((prediction: google.maps.places.PlacePrediction) => ({
            placeId: prediction.placeId,
            mainText: prediction.mainText?.text ?? prediction.text.text,
            secondaryText: prediction.secondaryText?.text ?? '',
          }));

        setPredictions(nextPredictions);
        setShowPredictions(nextPredictions.length > 0);
      } catch (error) {
        if (queryId === activeQueryIdRef.current) {
          setPredictions([]);
          setShowPredictions(false);
        }
        console.error('Failed to fetch place suggestions:', error);
      } finally {
        if (queryId === activeQueryIdRef.current) {
          setIsLoading(false);
        }
      }
    };

    void runLookup();
  }, [debouncedSearchTerm]);

  const handleSelect = async (prediction: Prediction) => {
    setIsFetchingDetails(true);
    setShowPredictions(false);

    try {
      const place = await fetchPlaceDetailsNew(placesLibraryRef.current, prediction.placeId);
      if (!place) {
        return;
      }
      const coverage = mapGoogleAddressToCoverage(place.addressComponents);

      onSelectAddress({
        address: place.address ?? prediction.mainText,
        placeId: place.placeId ?? prediction.placeId ?? null,
        latitude: place.latitude,
        longitude: place.longitude,
        county: coverage.county,
        region: coverage.region,
        source: 'google_autocomplete',
      });
      sessionTokenRef.current = null;
    } catch (error) {
      console.error('Failed to fetch place details:', error);
    } finally {
        setIsFetchingDetails(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="relative" ref={containerRef}>
      <Input
        type="text"
        value={value}
        onChange={(event) => {
          if (allowManualInput) onManualChange(event.target.value);
        }}
        onFocus={() => setShowPredictions(predictions.length > 0)}
        onClick={() => setShowPredictions(predictions.length > 0)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
        readOnly={!allowManualInput}
      />
      <AnimatePresence>
        {(showPredictions && predictions.length > 0) || isLoading || isFetchingDetails ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-500/10"
          >
            <div className="py-2">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Searching...</span>
                </div>
              )}
              {isFetchingDetails && (
                <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Getting details...</span>
                </div>
              )}
                {!isLoading && !isFetchingDetails &&
                  predictions.map((prediction) => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      onClick={() => void handleSelect(prediction)}
                      className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-emerald-50 transition-colors focus:bg-emerald-100 focus:outline-none"
                    >
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
                     <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">{prediction.mainText}</span>
                        {prediction.secondaryText ? (
                          <span className="text-xs text-slate-500">{prediction.secondaryText}</span>
                        ) : null}
                     </div>
                   </button>
                 ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
