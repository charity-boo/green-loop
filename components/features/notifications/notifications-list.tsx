"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, CalendarCheck, Sparkles, AlertCircle, CheckCheck, Leaf, Clock, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { markNotificationsAsRead } from "@/lib/firebase/notifications";
import { Notification } from "@/lib/firebase/notifications";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatTime(n: Notification): string {
  if (!n.createdAt) return "";
  try {
    const date = n.createdAt.toDate ? n.createdAt.toDate() : new Date(n.createdAt as unknown as string);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "";
  }
}

const typeConfig: Record<string, { Icon: React.ComponentType<{ className?: string }>; label: string }> = {
  warning:         { Icon: AlertTriangle, label: "Warning" },
  alert:           { Icon: AlertCircle, label: "Alert" },
  "AI-suggestion": { Icon: Sparkles, label: "AI Suggestion" },
  info:            { Icon: CalendarCheck, label: "Information" },
  reward_earned:   { Icon: Leaf, label: "Reward" },
};

export default function NotificationsList() {
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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Inbox</h1>
          <p className="text-slate-500 font-medium">Your latest Green Loop updates and communications.</p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            variant="outline"
            size="sm"
            className="rounded-xl font-bold border-emerald-100 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
              <div className="h-24 bg-slate-100" />
              <div className="p-8 space-y-4">
                <div className="h-4 bg-slate-50 rounded w-1/4" />
                <div className="h-3 bg-slate-50 rounded w-full" />
                <div className="h-3 bg-slate-50 rounded w-2/3" />
                <div className="h-20 bg-emerald-50/30 rounded-2xl" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
          <div className="h-20 w-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-6">
            <Bell className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Your inbox is empty</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
            When you receive important updates about your waste pickups or rewards, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {notifications.map((n, i) => {
            const config = typeConfig[n.type] ?? typeConfig.info;
            const { Icon, label } = config;
            const isUnread = n.status === "unread";
            
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {isUnread && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" />
                )}
                
                <div className="rounded-[2rem] border border-slate-100 overflow-hidden bg-white shadow-xl shadow-slate-200/50">
                  {/* Email-like Header */}
                  <div className={`px-8 py-6 flex items-center justify-between ${isUnread ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-widest">{n.title}</h4>
                        <p className="text-emerald-100/60 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                      </div>
                    </div>
                    {isUnread && (
                      <Badge className="bg-white text-emerald-600 border-none font-black text-[10px] px-3 h-6 rounded-lg uppercase tracking-wider">
                        New Message
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-8 md:p-10">
                    <div className="max-w-2xl">
                      <p className="text-slate-900 font-bold text-lg mb-6">Hello {user?.displayName || 'there'},</p>
                      
                      <p className="text-slate-600 text-base leading-relaxed mb-8">
                        {n.message}
                      </p>

                      {/* Highlighted Summary Box (Email Style) */}
                      <div className="bg-emerald-50/50 border-l-4 border-emerald-500 rounded-2xl p-6 mb-8 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-emerald-700">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Received</span>
                          <span className="text-xs font-bold ml-auto">{formatTime(n)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-emerald-700">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Platform</span>
                          <span className="text-xs font-bold ml-auto">Green Loop {role}</span>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-50">
                        <p className="text-slate-400 text-sm font-medium">Best regards,</p>
                        <p className="text-emerald-600 font-black tracking-tight text-lg">The Green Loop Team</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Email-like Footer */}
                  <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                      © {new Date().getFullYear()} GREEN LOOP • ALL RIGHTS RESERVED
                    </p>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
