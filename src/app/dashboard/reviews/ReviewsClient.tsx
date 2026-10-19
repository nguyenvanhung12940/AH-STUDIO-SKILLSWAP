"use client";

import { Star, MessageSquare, ThumbsUp, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ReviewsClientProps {
  reviews: any[];
  avgRating: string;
  count: number;
}

export default function ReviewsClient({ reviews, avgRating, count }: ReviewsClientProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Đánh giá & Phản hồi</h1>
          <p className="text-slate-500 text-sm">Xem những gì học viên nói về các buổi học của bạn.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <Star className="text-amber-500" fill="currentColor" size={20} />
          <span className="text-xl font-bold text-slate-900">{avgRating}</span>
          <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
          <span className="text-slate-300 mx-1 text-xs">|</span>
          <span className="text-slate-500 text-xs font-bold">{count} đánh giá</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reviews.map((review) => {
          // Determine which skill title to show
          // If the reviewer gave a review to the current user, the skill is what the current user was teaching
          const skillTitle = review.booking?.request?.teaching_skill?.title || "Kỹ năng trao đổi";
          
          return (
            <div key={review.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 hover:border-blue-200 transition-all group shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-sm font-bold overflow-hidden shrink-0 border border-blue-100">
                    {review.reviewer.avatar_url ? (
                      <img src={review.reviewer.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      review.reviewer.full_name?.substring(0, 1)
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.reviewer.full_name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "text-amber-500" : "text-slate-200"} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-2">
                  Buổi học: {skillTitle}
                </span>
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                  <ThumbsUp size={14} />
                  Cảm ơn đánh giá
                </button>
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  Phản hồi <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="text-slate-200" size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Chưa có đánh giá nào</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Hoàn thành các buổi học để nhận được những phản hồi đầu tiên từ cộng đồng.</p>
        </div>
      )}
    </div>
  );
}
