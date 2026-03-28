import { Leaf, Award, Zap } from 'lucide-react';

interface ImpactHeroProps {
    userName: string;
    totalWeight: number;
    co2Saved: number;
    currentPoints: number;
}

export default function ImpactHero({ userName, totalWeight, co2Saved, currentPoints }: ImpactHeroProps) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {userName}</h1>
            <div className="flex flex-wrap items-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Waste</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{Math.round(totalWeight)}kg</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Eco-Points</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{currentPoints}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">CO2 Saved</p>
                        <p className="text-lg font-bold text-emerald-600 leading-none">{Math.round(co2Saved)}kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
