"use client";

import { useState } from "react";
import { Inbox, Check, ArrowRight } from "lucide-react";
import { markNotificationAsRead } from "@/src/app/auth/actions";
import Link from "next/link";
import { cn } from "@/src/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationsClientProps {
  initialNotifications: any[];
}

export default function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id);
    if (!result.error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tất cả thông báo</h1>
        <p className="text-slate-500 text-sm">Theo dõi các cập nhật mới nhất từ cộng đồng SkillSwap.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors",
                  !n.is_read && "bg-blue-50/20"
                )}
              >
                <div className="flex-grow">
                   <div className="flex items-center gap-3 mb-1">
                      {!n.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                      <h4 className="font-bold text-slate-900">{n.title}</h4>
                   </div>
                   <p className="text-sm text-slate-600 mb-2">{n.message}</p>
                   <span className="text-xs text-slate-400 font-medium">
                      {new Date(n.created_at).toLocaleString('vi-VN')}
                   </span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {!n.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Đánh dấu đã đọc"
                    >
                      <Check size={20} />
                    </button>
                  )}
                  {n.link && (
                    <Link href={n.link}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        Xem chi tiết
                        <ArrowRight size={14} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center">
            <Inbox className="mx-auto text-slate-200 mb-4" size={64} />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Không có thông báo</h3>
            <p className="text-slate-500">Bạn hiện không có thông báo nào mới.</p>
          </div>
        )}
      </div>
    </div>
  );
}
