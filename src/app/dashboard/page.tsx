import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, MessageSquare, User, Star, Calendar, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch real stats
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Chào mừng, {profile?.full_name || 'Học viên'}!</h1>
        <p className="text-slate-500 text-sm">Hôm nay bạn muốn học thêm kỹ năng gì?</p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
         <div className="space-y-2">
            <h2 className="text-xl font-bold">Tìm người phù hợp với bạn?</h2>
            <p className="text-blue-100 text-sm opacity-90">Hệ thống đã tìm thấy những sinh viên có nhu cầu trao đổi trùng khớp với bạn.</p>
         </div>
         <Link href="/dashboard/matches">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 border-none whitespace-nowrap">Xem gợi ý ngay</Button>
         </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Buổi học hoàn thành", value: "0", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Kỹ năng đang dạy", value: "0", icon: Star, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Yêu cầu mới", value: "0", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Điểm uy tín", value: "5.0", icon: User, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className="text-xs text-slate-500 mt-1">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Lịch học sắp tới</h3>
          </div>
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <Calendar className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Bạn chưa có lịch học nào sắp tới.</p>
            <Link href="/explore" className="text-blue-600 font-bold text-sm mt-4 inline-block hover:underline">
               Khám phá các kỹ năng ngay
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Kỹ năng của tôi</h3>
            <Link href="/dashboard/skills" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              <Plus size={16} />
            </Link>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
             <p className="text-slate-400 text-sm">Bạn chưa đăng tải kỹ năng nào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
