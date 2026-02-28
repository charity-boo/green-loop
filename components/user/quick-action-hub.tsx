"use client";

import Link from "next/link";
import { Plus, Scan, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActionHub() {
    const actions = [
        {
            title: "Schedule Pickup",
            description: "Request a new collection",
            icon: Plus,
            href: "/schedule-pickup",
            primary: true,
        },
        {
            title: "AI Classifier",
            description: "Identify waste types",
            icon: Scan,
            href: "/learning-hub",
            primary: false,
        },
        {
            title: "Refer Neighbor",
            description: "Earn 500 points",
            icon: Users,
            href: "/community",
            primary: false,
        }
    ];

    return (
        <div className="grid grid-cols-1 gap-4">
            {actions.map((action, index) => (
                <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link
                        href={action.href}
                        className={`group flex items-center justify-between p-6 rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            action.primary 
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" 
                                : "bg-white border border-slate-100 text-slate-900 shadow-sm hover:shadow-md"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                action.primary ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
                            }`}>
                                <action.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-black tracking-tight">{action.title}</h4>
                                <p className={`text-xs font-medium ${action.primary ? "text-emerald-100" : "text-slate-400"}`}>
                                    {action.description}
                                </p>
                            </div>
                        </div>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1 ${
                            action.primary ? "bg-white/20" : "bg-slate-100"
                        }`}>
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
