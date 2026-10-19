"use client";

import { useState } from "react";
import { User, Sparkles, ArrowRight, MessageSquare, CheckCircle2, AlertCircle, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { createExchangeRequest } from "@/src/app/auth/actions";
import { cn } from "@/src/lib/utils";

interface MatchesClientProps {
  matches: any[];
  myTeaching: any[];
  myLearning: any[];
}

export default function MatchesClient({ matches, myTeaching, myLearning }: MatchesClientProps) {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [teachingSkillId, setTeachingSkillId] = useState("");
  const [learningSkillId, setLearningSkillId] = useState("");

  const handleOpenModal = (match: any) => {
    setSelectedMatch(match);
    setError(null);
    setSuccess(null);
    setIsModalOpen(true);
    // Pre-select if only one option
    if (match.teaching.length === 1) setLearningSkillId(match.teaching[0].id);
    if (myTeaching.length === 1) setTeachingSkillId(myTeaching[0].id);
  };

  const handleSendRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("receiverId", selectedMatch.profile.id);
    
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Gợi ý ghép cặp</h1>
        <p className="text-slate-500 text-sm">Dựa trên những gì bạn dạy và muốn học, đây là những người phù hợp nhất.</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <div key={match.profile.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-all">
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                   <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden shrink-0 border border-blue-100">
                      {match.profile.avatar_url ? <img src={match.profile.avatar_url} className="w-full h-full object-cover" /> : match.profile.full_name?.substring(0, 1)}
                   </div>
                   <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 truncate">{match.profile.full_name}</h3>
                        <div className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                           <Sparkles size={10} fill="currentColor" /> Match {match.score * 10}%
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{match.profile.university || "Sinh viên"}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-8">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Vì sao phù hợp?</span>
                      <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                        {match.reasons.map((reason: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                             <CheckCircle2 size={14} className="text-green-500 shrink-0 mt-0.5" />
                             {reason}
                          </li>
                        ))}
                      </ul>
                   </div>
                </div>

                <div className="flex gap-3">
                   <Link href={`/profile/${match.profile.id}`} className="flex-grow">
                      <Button variant="outline" className="w-full">Xem hồ sơ</Button>
                   </Link>
                   <Button onClick={() => handleOpenModal(match)} className="flex-grow">Trao đổi ngay</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <User size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa tìm thấy người phù hợp</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Hãy thêm nhiều kỹ năng hơn vào hồ sơ của bạn để hệ thống có thể gợi ý chính xác hơn.</p>
          <Link href="/dashboard/skills" className="inline-block mt-6">
             <Button>Quản lý kỹ năng</Button>
          </Link>
        </div>
      )}

      {/* Request Modal */}
      {isModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-600" />
                  Gửi yêu cầu trao đổi
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>

            <form onSubmit={handleSendRequest} className="p-8 space-y-6">
               {error && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                   <AlertCircle size={18} className="shrink-0" />
                   <p>{error}</p>
                 </div>
               )}
               {success && (
                 <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 text-sm">
                   <CheckCircle2 size={18} className="shrink-0" />
                   <p>{success}</p>
                 </div>
               )}

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Bạn muốn học kỹ năng nào?</label>
                    <select 
                      name="learningSkillId" 
                      required
                      value={learningSkillId}
                      onChange={(e) => setLearningSkillId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Chọn kỹ năng của {selectedMatch.profile.full_name}...</option>
                      {selectedMatch.teaching.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Bạn có thể dạy lại kỹ năng nào?</label>
                    <select 
                      name="teachingSkillId" 
                      required
                      value={teachingSkillId}
                      onChange={(e) => setTeachingSkillId(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Chọn kỹ năng của bạn...</option>
                      {myTeaching.map((s: any) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Lời nhắn (Tùy chọn)</label>
                    <textarea 
                      name="message"
                      rows={3}
                      placeholder="Chào bạn, mình rất muốn trao đổi kỹ năng với bạn vì..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    ></textarea>
                  </div>
               </div>

               <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-grow" onClick={() => setIsModalOpen(false)}>Hủy</Button>
                  <Button type="submit" className="flex-grow" isLoading={isLoading}>Gửi yêu cầu</Button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
