import { Calendar } from "lucide-react";

interface ImpactHeroProps {
    userName: string;
    nextPickup?: string | null;
}

export default function ImpactHero({ userName, nextPickup }: ImpactHeroProps) {
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {userName}</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
                {today}
                {nextPickup && (
                    <span className="text-green-600 font-semibold ml-2 inline-flex items-center gap-1.5">
                        <span className="text-slate-300">•</span>
                        <Calendar className="w-3.5 h-3.5" />
                        Next Pickup: {nextPickup}
                    </span>
                )}
            </p>
        </div>
    );
}
