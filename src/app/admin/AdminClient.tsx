"use client";

import { useState } from "react";
import { LayoutGrid, Shield, Users, BookOpen, AlertCircle, Trash2, CheckCircle2, MoreVertical } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { updateReportStatus } from "@/src/app/auth/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface AdminClientProps {
  stats: {
    users: number;
    skills: number;
    bookings: number;
    reports: number;
  };
  recentUsers: any[];
  reports: any[];
}

export default function AdminClient({ stats, recentUsers, reports }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const handleUpdateReport = async (id: string, status: string) => {
    const result = await updateReportStatus(id, status);
    if (result.error) alert(result.error);
    else router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
               <Shield size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AdminPanel</span>
          </div>
          
          <nav className="space-y-1">
            {[
              { id: "dashboard", name: "Tổng quan", icon: LayoutGrid },
              { id: "users", name: "Người dùng", icon: Users },
              { id: "reports", name: "Báo cáo", icon: AlertCircle },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow p-6 sm:p-10">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản trị Hệ thống</h1>
            <p className="text-slate-500 text-sm">Chào mừng quay lại, Admin.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-500">
               Server Status: <span className="text-green-600">Online</span>
             </div>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
               {[
                 { label: "Tổng người dùng", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                 { label: "Kỹ năng đăng tải", value: stats.skills, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
                 { label: "Buổi học thành công", value: stats.bookings, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
                 { label: "Báo cáo mới", value: stats.reports, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
               ].map((stat) => (
                 <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
                       <stat.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{stat.label}</span>
                    <span className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value.toLocaleString()}</span>
                 </div>
               ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Người dùng mới gia nhập</h3>
                  <Button size="sm" variant="ghost">Xem tất cả</Button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <tr>
                           <th className="px-6 py-4">Họ và tên</th>
                           <th className="px-6 py-4">Trường</th>
                           <th className="px-6 py-4">Ngày cập nhật</th>
                           <th className="px-6 py-4">Quyền</th>
                           <th className="px-6 py-4 text-right">Thao tác</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-sm">
                        {recentUsers.map((user) => (
                           <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 overflow-hidden">
                                       {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user.full_name?.substring(0, 1)}
                                    </div>
                                    <span className="font-bold text-slate-900">{user.full_name}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{user.university || "---"}</td>
                              <td className="px-6 py-4 text-slate-500">{new Date(user.updated_at).toLocaleDateString('vi-VN')}</td>
                              <td className="px-6 py-4">
                                 <span className={cn(
                                   "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                   user.role === 'admin' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                 )}>
                                   {user.role}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-20 text-center">
              <Users size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500">Chức năng quản lý chi tiết người dùng đang được phát triển.</p>
           </div>
        )}

        {activeTab === "reports" && (
           <div className="space-y-6">
              {reports.map((report) => (
                 <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className={cn(
                               "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                               report.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
                             )}>
                               {report.status}
                             </span>
                             <span className="text-xs text-slate-400">{new Date(report.created_at).toLocaleString('vi-VN')}</span>
                          </div>
                          <h4 className="font-bold text-slate-900">{report.reason}</h4>
                       </div>
                       {report.status === 'pending' && (
                          <div className="flex gap-2">
                             <Button size="sm" onClick={() => handleUpdateReport(report.id, 'resolved')}>Xong</Button>
                             <Button size="sm" variant="ghost" onClick={() => handleUpdateReport(report.id, 'dismissed')}>Bỏ qua</Button>
                          </div>
                       )}
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{report.description}</p>
                    <div className="flex items-center gap-6 text-xs font-medium text-slate-400">
                       <span>Người báo cáo: <span className="text-slate-900 font-bold">{report.reporter?.full_name}</span></span>
                       <span>Đối tượng: <span className="text-slate-900 font-bold">{report.reported?.full_name}</span></span>
                    </div>
                 </div>
              ))}
              {reports.length === 0 && (
                 <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400">Không có báo cáo nào.</p>
                 </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
}
