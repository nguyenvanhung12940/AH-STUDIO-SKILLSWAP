"use client";

import { BookOpen, Users, Star, MessageSquare, Search, Filter, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Cộng đồng SkillSwap</h1>
          <p className="text-slate-600 leading-relaxed">Nơi sinh viên kết nối, chia sẻ kinh nghiệm và cùng nhau phát triển các dự án thực tế.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Chủ đề thảo luận</h3>
              <nav className="space-y-1">
                {[
                  { name: "Tất cả", count: 124 },
                  { name: "Kinh nghiệm học tập", count: 42 },
                  { name: "Dự án sinh viên", count: 28 },
                  { name: "Cơ hội việc làm", count: 35 },
                  { name: "Giải trí & Đời sống", count: 19 },
                ].map((cat) => (
                  <button key={cat.name} className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all">
                    {cat.name}
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-400 font-bold">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-3xl text-white">
              <h3 className="font-bold mb-4">Bạn có câu hỏi?</h3>
              <p className="text-xs text-blue-100 leading-relaxed mb-6">
                Đặt câu hỏi cho cộng đồng và nhận được câu trả lời từ các sinh viên ưu tú.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all">
                Đăng bài ngay
              </button>
            </div>
          </aside>

          {/* Discussion List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
               <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Tìm kiếm thảo luận..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
               </div>
               <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors border border-slate-100">
                  <Filter size={18} />
               </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-900">Sinh viên {i}</span>
                        <span className="text-[10px] text-slate-400">• 2 giờ trước</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        Làm sao để cân bằng giữa việc học và đi làm thêm?
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6">
                        Chào các bạn, mình đang gặp khó khăn trong việc quản lý thời gian giữa việc học ở trường và làm part-time. Các bạn có tip nào hay không?
                      </p>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <MessageSquare size={16} />
                          12 bình luận
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Users size={16} />
                          24 quan tâm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
