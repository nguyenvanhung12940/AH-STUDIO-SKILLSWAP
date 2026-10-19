"use client";

import { LayoutDashboard, BookOpen, MessageSquare, Calendar, Star, Settings, User, Bell, ChevronRight, Clock, Plus, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { logout } from "@/src/app/auth/actions";
import { createClient } from "@/src/utils/supabase/client";
import NotificationBell from "@/src/components/NotificationBell";

const SIDEBAR_LINKS = [
  { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { name: "Ghép cặp", href: "/dashboard/matches", icon: Sparkles },
  { name: "Kỹ năng của tôi", href: "/dashboard/skills", icon: BookOpen },
  { name: "Yêu cầu trao đổi", href: "/dashboard/requests", icon: MessageSquare, badge: 2 },
  { name: "Lịch học", href: "/dashboard/schedule", icon: Calendar },
  { name: "Đánh giá", href: "/dashboard/reviews", icon: Star },
  { name: "Cài đặt", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        const { count } = await supabase
          .from("exchange_requests")
          .select("*", { count: 'exact', head: true })
          .eq("receiver_id", user.id)
          .eq("status", "pending");
        setPendingCount(count || 0);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <div className="h-full flex flex-col p-4">
          <div className="mb-8 px-2">
            <div className="flex items-center gap-3 mb-6 pt-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.substring(0, 2).toUpperCase() || "HA"
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                  {profile?.full_name || "Đang tải..."}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                  {profile?.university || "Sinh viên"}
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-1 flex-grow">
            {SIDEBAR_LINKS.map((link) => {
              const badge = link.href === "/dashboard/requests" ? pendingCount : 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all group",
                    pathname === link.href ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} />
                    {link.name}
                  </div>
                  {badge > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      pathname === link.href ? "bg-white text-blue-600" : "bg-blue-100 text-blue-600"
                    )}>
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <form action={logout}>
              <button type="submit" className="flex items-center gap-3 p-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={18} />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0">
          <h2 className="text-lg font-bold text-slate-900">
            {SIDEBAR_LINKS.find(l => l.href === pathname)?.name || "Bảng điều khiển"}
          </h2>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <Link href="/dashboard/settings" className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
               {profile?.avatar_url && <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />}
            </Link>
          </div>
        </header>
        
        <div className="p-6 sm:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
