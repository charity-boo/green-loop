"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, CalendarCheck, Sparkles, AlertCircle, CheckCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { markNotificationsAsRead } from "@/lib/firebase/notifications";
import { Notification } from "@/lib/firebase/notifications";
import { formatDistanceToNow } from "date-fns";

function formatTime(n: Notification): string {
  if (!n.createdAt) return "";
  try {
    const date = n.createdAt.toDate ? n.createdAt.toDate() : new Date(n.createdAt as unknown as string);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

const typeConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>; style: string }> = {
  warning:         { Icon: AlertTriangle,  style: "text-red-500 bg-red-50" },
  alert:           { Icon: AlertCircle,    style: "text-orange-500 bg-orange-50" },
  "AI-suggestion": { Icon: Sparkles,       style: "text-emerald-600 bg-emerald-50" },
  info:            { Icon: CalendarCheck,  style: "text-blue-500 bg-blue-50" },
};

export default function NotificationsWidget() {
  const { user, role } = useAuth();
  const { notifications, loading } = useNotifications(
    (role as "USER" | "COLLECTOR" | "ADMIN") ?? "USER",
    user?.uid
  );

  const unreadIds = notifications.filter((n) => n.status === "unread").map((n) => n.id);
  const unreadCount = unreadIds.length;

  const handleMarkAllRead = useCallback(async () => {
    if (unreadIds.length === 0) return;
    await markNotificationsAsRead(unreadIds);
  }, [unreadIds]);

  const displayNotifications = notifications.slice(0, 8);

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
        {unreadCount > 0 && (
          <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="px-5 py-8 flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-7 h-7 rounded-lg bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-2.5 bg-slate-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : displayNotifications.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <Bell className="h-6 w-6 text-slate-200 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-50">
          {displayNotifications.map((n, i) => {
            const config = typeConfig[n.type] ?? typeConfig.info;
            const { Icon, style } = config;
            const isUnread = n.status === "unread";
            return (
              <motion.li
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={`flex items-start gap-3 px-5 py-4 transition-colors ${isUnread ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-slate-50"}`}
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${style}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-black ${isUnread ? "text-slate-900" : "text-slate-600"}`}>{n.title}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{n.message}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5 font-medium">{formatTime(n)}</p>
                </div>
                {isUnread && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
