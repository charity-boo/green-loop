'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Weight, Check, Delete } from 'lucide-react';

interface WeightEntryProps {
    onConfirm: (weight: number) => void;
    isSubmitting?: boolean;
}

export function WeightEntry({ onConfirm, isSubmitting }: WeightEntryProps) {
    const [weight, setWeight] = useState('');

    const handleConfirm = () => {
        const numericWeight = parseFloat(weight);
        if (!isNaN(numericWeight) && numericWeight > 0) {
            onConfirm(numericWeight);
        }
    };

    const addToWeight = (num: string) => {
        if (num === '.' && weight.includes('.')) return;
        if (weight.length >= 6) return; // Prevent excessively long inputs
        setWeight(prev => prev + num);
    };

    const clearWeight = () => setWeight('');
    const backspace = () => setWeight(prev => prev.slice(0, -1));

    return (
        <Card className="p-8 bg-white dark:bg-[#064e3b]/20 border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-emerald-500/10 rounded-2xl">
                    <Weight className="text-[#10b981] w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Log Scale Weight</h3>
                    <p className="text-slate-400 dark:text-emerald-100/40 text-[10px] font-black uppercase tracking-widest mt-1">Ndagani Field-Scale (Kilograms)</p>
                </div>
            </div>

            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-[#10b981]/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Input
                    type="number"
                    value={weight}
                    placeholder="0.00"
                    className="text-6xl h-28 text-center bg-slate-50 dark:bg-emerald-950/40 border-slate-100 dark:border-emerald-800/30 text-[#10b981] font-black focus:ring-0 rounded-3xl relative z-10"
                    readOnly
                />
                <span className="absolute right-10 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 dark:text-emerald-900/50 z-10 uppercase tracking-tighter">
                    KG
                </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                    <Button
                        key={num}
                        variant="ghost"
                        onClick={() => addToWeight(num.toString())}
                        className="h-20 text-3xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-800/10 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-white font-black rounded-2xl transition-all active:scale-95"
                    >
                        {num}
                    </Button>
                ))}
                <Button
                    variant="ghost"
                    onClick={backspace}
                    className="h-20 text-red-400 hover:text-white hover:bg-red-500 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl transition-all"
                >
                    <Delete className="w-8 h-8" />
                </Button>
            </div>

            <Button
                onClick={handleConfirm}
                disabled={isSubmitting || !weight || parseFloat(weight) <= 0}
                className="w-full h-20 text-2xl font-black bg-[#10b981] hover:bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30 group rounded-[1.5rem] transition-all active:scale-[0.98]"
            >
                {isSubmitting ? (
                    <span className="animate-pulse tracking-widest font-black">VALIDATING...</span>
                ) : (
                    <div className="flex items-center justify-center gap-4 uppercase tracking-tighter">
                        Confirm Payload
                        <Check className="w-8 h-8 group-hover:scale-125 transition-transform" />
                    </div>
                )}
            </Button>
        </Card>
    );
}
