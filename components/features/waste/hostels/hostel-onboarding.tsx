'use client';

import { HostelSelection } from "./hostel-search";
import { HostelSearch } from "./hostel-search";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";

export function HostelOnboarding({ 
  onSelect, 
  onManagerTabRequested 
}: { 
  onSelect: (h: HostelSelection) => void;
  onManagerTabRequested: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="h-16 w-16 bg-green-100 rounded-3xl flex items-center justify-center mb-8 border border-green-200 shadow-sm"
        >
          <GraduationCap className="h-8 w-8 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find your campus home on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Green Loop.
            </span>
          </h2>
          <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
            Search for your hostel or enter its name manually to start tracking your impact immediately.
          </p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
        >
          <HostelSearch onSelect={onSelect} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl inline-flex flex-col sm:flex-row items-center gap-4"
          >
            <p className="text-sm text-slate-500 font-bold">
              Looking to register a new property?
            </p>
            <button 
              type="button" 
              onClick={onManagerTabRequested}
              className="text-white bg-slate-900 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Manager Registration
            </button>
          </motion.div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.2 }}
           className="mt-16 flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <Sparkles className="h-4 w-4 text-green-500" />
          <span>Eco-Warrior Hub Active</span>
          <Sparkles className="h-4 w-4 text-green-500" />
        </motion.div>
      </div>
    </div>
  );
}
