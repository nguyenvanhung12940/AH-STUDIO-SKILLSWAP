"use client";

import { useState } from "react";
import { Star, Clock, ShieldCheck, MessageSquare, ChevronLeft, Share2, Heart, X, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { createExchangeRequest } from "@/src/app/auth/actions";
import { cn } from "@/src/lib/utils";

interface SkillDetailClientProps {
  skill: any;
  currentUser: any;
  myTeaching: any[];
}

export default function SkillDetailClient({ skill, currentUser, myTeaching }: SkillDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSendRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("receiverId", skill.profiles.id);
    formData.append(skill.type === "teaching" ? "learningSkillId" : "teachingSkillId", skill.id);
    
    const result = await createExchangeRequest(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Yêu cầu đã được gửi thành công!");
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(null);
      }, 2000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-8 transition-colors font-medium">
          <ChevronLeft size={16} />
          Quay lại khám phá
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  {skill.categories?.name || "Kỹ năng"}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                  <Star size={16} fill="currentColor" />
                  {skill.rating || "5.0"} ({skill.reviews_count || 0} đánh giá)
                </div>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-6">{skill.title}</h1>
              
              <div className="flex flex-wrap gap-6 py-6 border-y border-slate-100 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="text-slate-400" size={20} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Loại kỹ năng</span>
                    <span className="text-sm font-bold text-slate-700">
                      {skill.type === "teaching" ? "Người này dạy" : "Họ muốn học"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" size={20} />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Xác minh</span>
                    <span className="text-sm font-bold text-slate-700">Đã xác thực SV</span>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-widest">Mô tả</h3>
                <div className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {skill.description || "Chưa có mô tả chi tiết."}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-widest">Thông tin người chia sẻ</h3>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden border border-blue-100">
                   {skill.profiles?.avatar_url ? <img src={skill.profiles.avatar_url} className="w-full h-full object-cover" /> : skill.profiles?.full_name?.substring(0, 1)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-slate-900">{skill.profiles?.full_name}</h4>
                    <Link href={`/profile/${skill.profiles?.id}`} className="text-sm text-blue-600 font-bold hover:underline">
                      Xem hồ sơ
                    </Link>
                  </div>
                  <p className="text-sm text-slate-500 mb-4">{skill.profiles?.university || "Sinh viên"}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">{skill.profiles?.bio || "Chưa có lời giới thiệu."}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-24">
              <div className="space-y-3">
                {currentUser?.id !== skill.profiles.id ? (
                  <Button onClick={() => setIsModalOpen(true)} className="w-full py-4 text-base" size="lg">
                    {skill.type === "teaching" ? "Gửi yêu cầu học" : "Đề xuất dạy"}
                  </Button>
                ) : (
                  <Link href="/dashboard/skills" className="block w-full">
                    <Button variant="outline" className="w-full py-4 text-base" size="lg">Quản lý kỹ năng</Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full py-4 text-base flex items-center gap-2">
                  <MessageSquare size={18} />
                  Nhắn tin hỏi thêm
                </Button>
              </div>
              
              <div className="mt-6 flex items-center justify-between pt-6 border-t border-slate-100">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-500 transition-colors">
                  <Heart size={16} /> Lưu
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                  <Share2 size={16} /> Chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal logic */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                   Gửi lời mời trao đổi
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
             </div>

             <form onSubmit={handleSendRequest} className="p-8 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 text-sm">
                    <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                    <p>{success}</p>
                  </div>
                )}

                <div className="space-y-4">
                   <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
                      <span className="text-[10px] text-blue-400 font-bold uppercase block mb-1">Kỹ năng mục tiêu:</span>
                      <span className="text-blue-700 font-bold text-lg">{skill.title}</span>
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">
                        {skill.type === "teaching" ? "Bạn muốn dạy lại kỹ năng nào?" : "Bạn muốn học kỹ năng nào?"}
                     </label>
                     <select 
                       name={skill.type === "teaching" ? "teachingSkillId" : "learningSkillId"} 
                       required
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-medium"
                     >
                       <option value="">Chọn kỹ năng của bạn...</option>
                       {myTeaching.map((s: any) => (
                         <option key={s.id} value={s.id}>{s.title}</option>
                       ))}
                     </select>
                     {myTeaching.length === 0 && (
                       <p className="text-[10px] text-amber-600 font-bold mt-1 ml-1">* Bạn chưa có kỹ năng {skill.type === "teaching" ? "để dạy" : "muốn học"} nào công khai.</p>
                     )}
                   </div>

                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-widest ml-1">Lời nhắn</label>
                     <textarea 
                       name="message"
                       rows={3}
                       placeholder="Chào bạn, mình rất ấn tượng với profile của bạn..."
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                     ></textarea>
                   </div>
                </div>

                <div className="flex gap-4">
                   <Button type="button" variant="outline" className="flex-grow" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                   <Button type="submit" className="flex-grow" isLoading={isLoading} disabled={myTeaching.length === 0 && skill.type === "teaching"}>Gửi yêu cầu</Button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
