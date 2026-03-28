'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { HostelOnboarding } from "./hostel-onboarding";
import { MyHostelDashboard } from "./my-hostel-dashboard";
import { HostelSelection } from "./hostel-search";
import { Loader2 } from "lucide-react";

export function StudentView({ onManagerTabRequested }: { onManagerTabRequested: () => void }) {
  const [selection, setSelection] = useLocalStorage<HostelSelection | null>("gl_hostel_selection", null);
  const [hostel, setHostel] = useState<HostelSelection | null>(null);
  const [isLoading, setIsLoading] = useState(!!selection?.id && !selection?.isCustom);

  useEffect(() => {
    if (selection) {
      if (selection.id && !selection.isCustom) {
        setIsLoading(true);
        fetch(`/api/hostels/search?id=${selection.id}`)
          .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(data => {
            setHostel(data);
          })
          .catch(() => {
            // Fallback to local storage data if fetch fails
            setHostel(selection);
          })
          .finally(() => setIsLoading(false));
      } else {
        setHostel(selection);
        setIsLoading(false);
      }
    } else {
      setHostel(null);
      setIsLoading(false);
    }
  }, [selection]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your hub...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!selection ? (
        <motion.div
           key="onboarding"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           className="w-full"
        >
          <HostelOnboarding 
            onSelect={(h) => setSelection(h)} 
            onManagerTabRequested={onManagerTabRequested}
          />
        </motion.div>
      ) : (
        <motion.div
           key="dashboard"
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: 10 }}
           className="w-full"
        >
          <MyHostelDashboard 
            hostel={hostel} 
            onReset={() => {
              setSelection(null);
              setHostel(null);
            }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
