"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Save, Loader2, CheckCircle2, Search } from "lucide-react";
import AddressAutocomplete from "@/components/location/address-autocomplete";
import { validateCollectorLocationSelection } from "@/lib/location/collector-location-validation";

interface LocationSectionProps {
  initialAddress?: string | null;
  initialCounty?: string | null;
  initialRegion?: string | null;
  initialPlaceId?: string | null;
  initialLocationSource?: "manual" | "gps" | "google_autocomplete" | null;
}

export default function LocationSection({
  initialAddress,
  initialCounty,
  initialRegion,
  initialPlaceId,
  initialLocationSource,
}: LocationSectionProps) {
  const [county, setCounty] = useState(initialCounty ?? "");
  const [region, setRegion] = useState(initialRegion ?? "");
  const [searchValue, setSearchValue] = useState(initialAddress ?? "");
  const [placeId, setPlaceId] = useState<string | null>(initialPlaceId ?? null);
  const [locationSource, setLocationSource] = useState<"manual" | "gps" | "google_autocomplete">(
    initialLocationSource ?? "manual"
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    };
  }, []);

  const mapQuery =
    region && county
      ? `${region}, ${county}, Kenya`
      : county
      ? `${county}, Kenya`
      : "Kenya";

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  async function handleSave() {
    const validation = validateCollectorLocationSelection({
      address: searchValue,
      county,
      region,
      placeId,
      locationSource,
    });
    if (!validation.isValid) {
      setError(validation.error ?? "Invalid location details.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: searchValue,
          county,
          region,
          placeId,
          locationSource,
        }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save location. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
          <MapPin className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Your Location</p>
          <h3 className="text-base font-black text-slate-900 leading-tight">Service Area</h3>
        </div>
      </div>

      {/* Map */}
      <div className="relative mx-4 h-52 rounded-2xl overflow-hidden border border-slate-100">
        <iframe
          key={mapQuery}
          title="Your Service Area Map"
          src={mapSrc}
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
        />
        {region && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wider">
            {region}
          </div>
        )}
      </div>

      {/* Selects & Actions */}
      <div className="px-6 py-5 space-y-4">
        {/* Google Autocomplete */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] flex items-center gap-1.5">
            <Search className="h-2.5 w-2.5" /> Search Your Address
          </label>
          <AddressAutocomplete
            value={searchValue}
            onManualChange={(nextAddress) => {
              setSearchValue(nextAddress);
              setCounty("");
              setRegion("");
              setPlaceId(null);
              setLocationSource("manual");
            }}
            onSelectAddress={(selection) => {
              setSearchValue(selection.address);
              setPlaceId(selection.placeId);
              setLocationSource(selection.source);
              setCounty(selection.county ?? "");
              setRegion(selection.region ?? "");
              setSaved(false);
              setError("");
            }}
            placeholder="Search for your street or building..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-[10px] text-slate-400 font-medium italic">
            Tip: choose from Google suggestions to update your location.
          </p>
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !county || !region || !placeId || locationSource !== "google_autocomplete"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-black text-white transition-colors"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Location
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
