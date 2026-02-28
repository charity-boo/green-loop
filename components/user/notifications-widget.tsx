"use client";

import { motion } from "framer-motion";
import { Bell, AlertTriangle, CalendarCheck } from "lucide-react";

// Future: wire to Firestore user notifications sub-collection with onSnapshot
const MOCK_NOTIFICATIONS = [
    {
        id: "n1",
        type: "warning",
        title: "Missed Pickup",
        body: "Your scheduled pickup on Feb 15 was not collected.",
        time: "2 days ago",
    },
    {
        id: "n2",
        type: "info",
        title: "Upcoming Pickup",
        body: "Your next pickup is scheduled for tomorrow morning.",
        time: "Just now",
    },
    {
        id: "n3",
        type: "info",
        title: "Campaign Reminder",
        body: "Plastic-Free February ends in 3 days — log your waste!",
        time: "1 hour ago",
    },
];

const iconMap = {
    warning: { Icon: AlertTriangle, style: "text-red-500 bg-red-50" },
    info: { Icon: CalendarCheck, style: "text-blue-500 bg-blue-50" },
};

export default function NotificationsWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
        >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
                <Bell className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-black text-slate-900">Notifications</h4>
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                    {MOCK_NOTIFICATIONS.length}
                </span>
            </div>
            <ul className="divide-y divide-slate-50">
                {MOCK_NOTIFICATIONS.map((n, i) => {
                    const { Icon, style } = iconMap[n.type as keyof typeof iconMap] ?? iconMap.info;
                    return (
                        <motion.li
                            key={n.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.06 }}
                            className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                        >
                            <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style}`}>
                                <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-slate-900">{n.title}</p>
                                <p className="text-[11px] text-slate-500 leading-snug">{n.body}</p>
                                <p className="text-[10px] text-slate-300 mt-0.5 font-medium">{n.time}</p>
                            </div>
                        </motion.li>
                    );
                })}
            </ul>
        </motion.div>
    );
}
