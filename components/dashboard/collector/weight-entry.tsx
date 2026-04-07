'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Delete } from 'lucide-react';

interface WeightEntryProps {
    onConfirm: (weight: number) => void;
    isSubmitting?: boolean;
}

export function WeightEntry({ onConfirm, isSubmitting }: WeightEntryProps) {
    const [weight, setWeight] = useState('');

    // Trigger onConfirm automatically when weight changes
    const updateWeight = (newWeightStr: string) => {
        setWeight(newWeightStr);
        const numericWeight = parseFloat(newWeightStr);
        if (!isNaN(numericWeight) && numericWeight > 0) {
            onConfirm(numericWeight);
        } else {
            onConfirm(0); // Invalid state
        }
    };

    const addToWeight = (num: string) => {
        if (num === '.' && weight.includes('.')) return;
        if (weight.length >= 6) return;
        updateWeight(weight + num);
    };

    const backspace = () => updateWeight(weight.slice(0, -1));

    return (
        <Card className="p-6 bg-transparent border-none shadow-none">
            <div className="relative mb-8">
                <Input
                    type="text"
                    value={weight}
                    placeholder="0.0"
                    className="text-6xl h-24 text-center bg-white border-slate-200 text-slate-900 font-black focus:ring-emerald-500/20 rounded-2xl relative z-10 shadow-sm"
                    readOnly
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400 z-10 uppercase tracking-widest">
                    KG
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
                    <Button
                        key={num}
                        variant="outline"
                        onClick={() => addToWeight(num.toString())}
                        disabled={isSubmitting}
                        className="h-16 text-2xl bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-bold rounded-xl transition-all active:scale-95 shadow-sm"
                    >
                        {num}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    onClick={backspace}
                    disabled={isSubmitting}
                    className="h-16 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 bg-slate-50 border-slate-200 rounded-xl transition-all active:scale-95 shadow-sm"
                >
                    <Delete className="w-6 h-6" />
                </Button>
            </div>
        </Card>
    );
}
