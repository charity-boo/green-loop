"use client";

import Link from "next/link";
import { Scan, Users, Star, BookOpen, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActionHub() {
    const actions = [
        {
            title: "AI Classifier",
            description: "Identify waste",
            icon: Scan,
            href: "/learning-hub",
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Community",
            description: "Refer & Earn",
            icon: Users,
            href: "/community",
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Redeem",
            description: "Get Vouchers",
            icon: Star,
            href: "/rewards",
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            title: "Green Tips",
            description: "Learn more",
            icon: BookOpen,
            href: "/tips",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4 h-full">
            {actions.map((action, index) => (
                <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="h-full"
                >
                    <Link
                        href={action.href}
                        className="group relative flex flex-col justify-between h-full p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 active:scale-[0.98]"
                    >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.bg} ${action.color} mb-4`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        
                        <div>
                            <h4 className="font-black text-slate-900 tracking-tight leading-tight">{action.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {action.description}
                            </p>
                        </div>

                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="h-4 w-4 text-slate-300" />
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
