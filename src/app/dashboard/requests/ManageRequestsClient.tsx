"use client";

import { useState } from "react";
import { MessageSquare, Clock, Check, X, User, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { updateRequestStatus, cancelRequest } from "@/src/app/auth/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface ManageRequestsClientProps {
  received: any[];
  sent: any[];
}

export default function ManageRequestsClient({ received, sent }: ManageRequestsClientProps) {
  const [activeTab, setActiveTab] = useState("received");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
    setIsLoading(true);
    const result = await updateRequestStatus(requestId, status);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleCancel = async (requestId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy yêu cầu này?")) return;
    setIsLoading(true);
    const result = await cancelRequest(requestId);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsLoading(false);
  };

  const currentData = activeTab === "received" ? received : sent;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yêu cầu trao đổi</h1>
          <p className="text-slate-500 text-sm">Quản lý các lời mời trao đổi kỹ năng từ cộng đồng.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab("received")}
          className={cn(
            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all",
            activeTab === "received" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Lời mời nhận được ({received.length})
        </button>
        <button 
          onClick={() => setActiveTab("sent")}
          className={cn(
            "px-6 py-2.5 text-sm font-bold rounded-lg transition-all",
            activeTab === "sent" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Lời mời đã gửi ({sent.length})
        </button>
      </div>

      <div className="space-y-6">
        {currentData.length > 0 ? currentData.map((req) => (
          <div key={req.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg hover:shadow-slate-200/30 transition-all">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0">
                     {activeTab === "received" 
                       ? (req.sender?.avatar_url ? <img src={req.sender.avatar_url} className="w-full h-full object-cover" /> : req.sender?.full_name?.substring(0, 1))
                       : (req.receiver?.avatar_url ? <img src={req.receiver.avatar_url} className="w-full h-full object-cover" /> : req.receiver?.full_name?.substring(0, 1))
                     }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 truncate max-w-[200px]">
                         {activeTab === "received" ? req.sender?.full_name : req.receiver?.full_name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• {new Date(req.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {req.message && (
                      <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mb-4 italic line-clamp-2">
                        "{req.message}"
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="px-3 py-1.5 bg-blue-50 rounded-xl flex items-center gap-2">
                        <span className="text-[10px] text-blue-400 font-bold uppercase">Học kỹ năng:</span>
                        <span className="text-xs font-bold text-blue-700">{req.learning_skill?.title || "N/A"}</span>
                      </div>
                      <div className="px-3 py-1.5 bg-purple-50 rounded-xl flex items-center gap-2">
                        <span className="text-[10px] text-purple-400 font-bold uppercase">Dạy lại:</span>
                        <span className="text-xs font-bold text-purple-700">{req.teaching_skill?.title || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 shrink-0">
                  {req.status === "pending" ? (
                    activeTab === "received" ? (
                      <>
                        <Button 
                          onClick={() => handleAction(req.id, "accepted")}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-green-100" 
                          size="sm"
                          isLoading={isLoading}
                        >
                          <Check size={16} /> Chấp nhận
                        </Button>
                        <Button 
                          onClick={() => handleAction(req.id, "rejected")}
                          variant="outline" 
                          className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 border-red-100" 
                          size="sm"
                          isLoading={isLoading}
                        >
                          <X size={16} /> Từ chối
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => handleCancel(req.id)}
                        variant="outline" 
                        className="flex items-center gap-2 text-slate-500 hover:bg-slate-50 border-slate-200" 
                        size="sm"
                        isLoading={isLoading}
                      >
                        <X size={16} /> Hủy yêu cầu
                      </Button>
                    )
                  ) : (
                    <div className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2",
                      req.status === "accepted" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {req.status === "accepted" ? <Check size={14} /> : <X size={14} />}
                      {req.status === "accepted" ? "Đã chấp nhận" : "Đã từ chối"}
                    </div>
                  )}
                  <Link href={`/profile/${activeTab === "received" ? req.sender?.id : req.receiver?.id}`}>
                    <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
                      <User size={16} /> Hồ sơ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-medium">Bạn chưa có yêu cầu nào trong mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
