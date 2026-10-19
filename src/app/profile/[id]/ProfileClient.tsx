"use client";

import { User, MapPin, GraduationCap, Star, BookOpen, Clock, Heart, Share2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { createReport } from "@/src/app/auth/actions";
import { Button } from "@/src/components/ui/Button";

interface ProfileClientProps {
  profile: any;
  skills: any[];
  reviews: any[];
}

export default function ProfileClient({ profile, skills, reviews }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("skills");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createReport(formData);
    if (result.success) {
      setReportSuccess(true);
      setTimeout(() => {
        setIsReportModalOpen(false);
        setReportSuccess(false);
      }, 2000);
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
              <div className="w-32 h-32 rounded-3xl bg-blue-100 mx-auto mb-6 flex items-center justify-center text-blue-600 text-4xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  profile.full_name?.substring(0, 2).toUpperCase() || "U"
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{profile.full_name}</h1>
              <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5 mb-6">
                <GraduationCap size={16} />
                {profile.university || "Sinh viên"}
              </p>
              
              <div className="grid grid-cols-2 gap-2 py-6 border-y border-slate-100 mb-6">
                <div>
                  <span className="block text-lg font-bold text-slate-900">{skills.filter(s => s.type === 'teaching').length}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dạy</span>
                </div>
                <div>
                  <span className="block text-lg font-bold text-slate-900">{reviews.length}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Đánh giá</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Nhắn tin
                </button>
                <div className="flex gap-2">
                  <button className="flex-grow py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center gap-2">
                    <Heart size={18} />
                    Lưu
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-200">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100"
                    title="Báo cáo vi phạm"
                  >
                    <AlertTriangle size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Giới thiệu</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {profile.bio || "Người dùng này chưa có lời giới thiệu."}
              </p>
            </div>
          </div>

          {/* Right: Content Tabs */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-1 p-1 bg-white rounded-2xl border border-slate-200 w-fit shadow-sm">
              <button 
                onClick={() => setActiveTab("skills")}
                className={cn(
                  "px-6 py-2.5 text-sm font-bold rounded-xl transition-all",
                  activeTab === "skills" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Kỹ năng chia sẻ
              </button>
              <button 
                onClick={() => setActiveTab("reviews")}
                className={cn(
                  "px-6 py-2.5 text-sm font-bold rounded-xl transition-all",
                  activeTab === "reviews" ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Đánh giá ({reviews.length})
              </button>
            </div>

            <div className="space-y-6">
              {activeTab === "skills" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {skills.length > 0 ? skills.map((skill) => (
                    <div key={skill.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider",
                          skill.type === 'teaching' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        )}>
                          {skill.categories?.name || "Kỹ năng"}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star size={14} fill="currentColor" />
                          {skill.rating || "5.0"}
                        </div>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {skill.title}
                      </h4>
                      <Link 
                        href={`/skill/${skill.id}`}
                        className="w-full flex items-center justify-center py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  )) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 font-medium">
                       Người dùng này chưa có kỹ năng công khai nào.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                   {reviews.length > 0 ? reviews.map((review) => (
                     <div key={review.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden text-xs">
                               {review.reviewer?.avatar_url ? <img src={review.reviewer.avatar_url} className="w-full h-full object-cover" /> : "R"}
                            </div>
                            <span className="text-sm font-bold text-slate-900">{review.reviewer?.full_name || "Người học"}</span>
                          </div>
                          <div className="flex gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} />)}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{review.comment}"
                        </p>
                     </div>
                   )) : (
                     <div className="py-12 text-center text-slate-400 font-medium">
                        Chưa có đánh giá nào cho người dùng này.
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Báo cáo vi phạm</h3>
            </div>

            {reportSuccess ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  <Star size={32} fill="currentColor" />
                </div>
                <p className="text-slate-900 font-bold text-lg">Đã gửi báo cáo!</p>
                <p className="text-slate-500 text-sm">Cảm ơn bạn đã đóng góp xây dựng cộng đồng.</p>
              </div>
            ) : (
              <form onSubmit={handleReport} className="space-y-4">
                <input type="hidden" name="reportedId" value={profile.id} />
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lý do</label>
                  <select 
                    name="reason" 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  >
                    <option value="">Chọn lý do...</option>
                    <option value="Spam">Spam / Quấy rối</option>
                    <option value="Inappropriate Content">Nội dung không phù hợp</option>
                    <option value="Fake Profile">Hồ sơ giả mạo</option>
                    <option value="Scam">Lừa đảo</option>
                    <option value="Other">Lý do khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Chi tiết</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={4}
                    placeholder="Mô tả chi tiết vi phạm..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 resize-none"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full py-6 rounded-2xl shadow-lg shadow-blue-100">Gửi báo cáo</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
