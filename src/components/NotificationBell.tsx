"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, Inbox } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";
import { markNotificationAsRead } from "@/src/app/auth/actions";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    
    setNotifications(data || []);
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel("notifications_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-400 hover:text-slate-600 relative rounded-xl hover:bg-slate-50 transition-all"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] text-white font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
               <h4 className="font-bold text-slate-900 text-sm">Thông báo</h4>
               <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Mới nhất</span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
               {notifications.length > 0 ? (
                 notifications.map((n) => (
                   <div 
                    key={n.id} 
                    className={cn(
                      "p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group relative",
                      !n.is_read && "bg-blue-50/30"
                    )}
                    onClick={() => handleMarkAsRead(n.id)}
                   >
                      {!n.is_read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-full" />}
                      <Link href={n.link || "#"} onClick={() => setIsOpen(false)}>
                        <h5 className="text-xs font-bold text-slate-900 mb-1">{n.title}</h5>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                        <span className="text-[9px] text-slate-400 mt-2 block font-medium">
                          {new Date(n.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · {new Date(n.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </Link>
                      {!n.is_read && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                          className="absolute right-2 top-4 p-1 text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Check size={14} />
                        </button>
                      )}
                   </div>
                 ))
               ) : (
                 <div className="p-12 text-center">
                    <Inbox className="mx-auto text-slate-200 mb-3" size={32} />
                    <p className="text-xs text-slate-400 font-medium">Chưa có thông báo nào</p>
                 </div>
               )}
            </div>
            
            {notifications.length > 0 && (
              <Link 
                href="/dashboard/notifications" 
                className="block p-3 text-center text-[11px] font-bold text-blue-600 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả thông báo
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
