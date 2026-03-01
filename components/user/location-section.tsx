"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Save, Loader2, CheckCircle2 } from "lucide-react";
import { KENYA_COUNTIES } from "@/lib/constants/regions";

interface LocationSectionProps {
  initialCounty?: string | null;
  initialRegion?: string | null;
}

export default function LocationSection({ initialCounty, initialRegion }: LocationSectionProps) {
  const [county, setCounty] = useState(initialCounty ?? "");
  const [region, setRegion] = useState(initialRegion ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const selectedCounty = KENYA_COUNTIES.find((c) => c.value === county);
  const subRegions = selectedCounty?.subRegions ?? [];
  const selectedSubRegion = subRegions.find((r) => r.value === region);

  const mapQuery =
    selectedSubRegion && selectedCounty
      ? `${selectedSubRegion.label},${selectedCounty.label},Kenya`
      : selectedCounty
      ? `${selectedCounty.label},Kenya`
      : "Kenya";

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  function handleCountyChange(val: string) {
    setCounty(val);
    setRegion("");
    setSaved(false);
    setError("");
  }

  async function handleSave() {
    if (!county || !region) {
      setError("Please select both a county and a service area.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ county, region }),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
        {selectedSubRegion && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-700 uppercase tracking-wider">
            {selectedSubRegion.label}
          </div>
        )}
      </div>

      {/* Selects & Actions */}
      <div className="px-6 py-5 space-y-3">
        {/* County */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">County</label>
          <select
            value={county}
            onChange={(e) => handleCountyChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select county…</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sub-region */}
        {county && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em]">Service Area</label>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setSaved(false);
                setError("");
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select area…</option>
              {subRegions.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Error */}
        {error && <p className="text-xs text-red-500">{error}</p>}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || !county || !region}
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
