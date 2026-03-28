'use client';

import { useState, useCallback } from "react";
import { Search, MapPin, CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { HostelDoc } from "@/types/firestore";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect } from "react";

export type HostelSelection = HostelDoc | { name: string; isCustom: boolean; id?: string; location?: string; verified?: boolean; points?: number; totalWasteRecycled?: number };

export function HostelSearch({ onSelect }: { onSelect?: (h: HostelSelection) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HostelDoc[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<HostelSelection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetch(`/api/hostels/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then((data: HostelDoc[]) => setResults(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Could not load results. Please try again.");
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSelect = useCallback((hostel: HostelSelection) => {
    setSelectedHostel(hostel);
    setQuery("");
    setResults([]);
    if (onSelect) onSelect(hostel);
  }, [onSelect]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-green-600 transition-colors" />
          )}
        </div>
        <Input
          type="text"
          placeholder="Search for your hostel or location..."
          className="h-14 pl-12 pr-4 rounded-2xl border-border focus-visible:ring-green-600 shadow-lg shadow-slate-100/50 text-lg font-medium"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-50 w-full mt-2 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-sm text-red-600 font-medium"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {!error && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
          >
            <ul className="divide-y divide-slate-100">
               {/* Manual Option */}
               <li 
                 className="p-4 bg-slate-50 hover:bg-green-50 cursor-pointer transition-colors group border-b border-slate-100"
                 onClick={() => handleSelect({ name: query, isCustom: true })}
               >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg group-hover:bg-white transition-colors">
                      <Sparkles className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">Register &ldquo;{query}&rdquo;</p>
                      <p className="text-xs text-slate-500 mt-1">If your hostel is not listed below</p>
                    </div>
                  </div>
               </li>

              {results.map((hostel) => (
                <li
                  key={hostel.id}
                  className="p-4 hover:bg-green-50 cursor-pointer transition-colors group"
                  onClick={() => handleSelect(hostel)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                        <MapPin className="h-5 w-5 text-muted-foreground group-hover:text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{hostel.name}</p>
                        <p className="text-sm text-muted-foreground font-medium">{hostel.location}</p>
                      </div>
                    </div>
                    {hostel.verified && (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {!error && !isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute z-50 w-full mt-2 p-8 bg-card rounded-2xl border border-border shadow-xl text-center"
          >
             <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-300" />
             </div>
             <p className="text-lg font-black text-slate-900 leading-tight">No verified hubs for &ldquo;{debouncedQuery}&rdquo;</p>
             <p className="text-sm text-slate-500 mt-2 mb-6">No problem! You can still track your personal impact by creating a custom hub.</p>
             
             <button 
                onClick={() => handleSelect({ name: query, isCustom: true })}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
             >
                <Sparkles className="h-4 w-4" /> Create "{query}" Hub
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedHostel && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-600 rounded-2xl text-white flex items-center justify-between shadow-xl shadow-green-200"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-200" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-200">
                {('isCustom' in selectedHostel && selectedHostel.isCustom) ? 'Custom Hub' : 'Verified Hub'}
              </p>
              <p className="text-lg font-black">{selectedHostel.name}</p>
              <p className="text-xs text-green-200 font-medium">
                {selectedHostel.location || "Location pending"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
              {(selectedHostel.points || 0).toLocaleString()} pts
            </span>
            <button
              onClick={() => setSelectedHostel(null)}
              className="text-xs font-bold uppercase tracking-wider bg-green-500 hover:bg-green-400 px-3 py-1.5 rounded-lg transition-colors shadow-inner"
            >
              Change
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
