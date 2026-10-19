"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Video, MapPin, MoreVertical, ChevronLeft, ChevronRight, Plus, X, AlertCircle, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { createBooking, updateBookingStatus, submitReview } from "@/src/app/auth/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface ScheduleClientProps {
  initialBookings: any[];
  acceptedRequests: any[];
  currentUserId: string;
}

export default function ScheduleClient({ initialBookings, acceptedRequests, currentUserId }: ScheduleClientProps) {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await createBooking(formData);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsBookingModalOpen(false);
      router.refresh();
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "completed" | "cancelled") => {
    if (!confirm(`Bạn có chắc muốn đánh dấu buổi học này là ${status === 'completed' ? 'hoàn thành' : 'đã hủy'}?`)) return;
    setIsLoading(true);
    const result = await updateBookingStatus(id, status);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleOpenReview = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitReview(formData);
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsReviewModalOpen(false);
      router.refresh();
      setIsLoading(false);
    }
  };

  const upcoming = initialBookings.filter(b => b.status === "upcoming");
  const history = initialBookings.filter(b => b.status !== "upcoming");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lịch học của tôi</h1>
          <p className="text-slate-500 text-sm">Quản lý thời gian học tập và trao đổi kỹ năng.</p>
        </div>
        <Button onClick={() => setIsBookingModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} /> Đặt lịch mới
        </Button>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sắp tới ({upcoming.length})</h3>
        {upcoming.length > 0 ? upcoming.map((booking) => {
          const partner = booking.request.sender_id === currentUserId ? booking.request.receiver : booking.request.sender;
          return (
            <div key={booking.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all shadow-sm">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                  <span className="text-[10px] font-bold uppercase">{new Date(booking.start_at).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                  <span className="text-xl font-bold">{new Date(booking.start_at).getDate()}</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">
                    {booking.request.sender_id === currentUserId ? booking.request.learning_skill?.title : booking.request.teaching_skill?.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} />
                      {new Date(booking.start_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.end_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium capitalize">
                      {booking.location?.toLowerCase().includes('http') ? <Video size={14} /> : <MapPin size={14} />}
                      {booking.location || 'Chưa xác định'}
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600 overflow-hidden shrink-0">
                         {partner.avatar_url ? <img src={partner.avatar_url} className="w-full h-full object-cover" /> : partner.full_name?.substring(0,1)}
                      </div>
                      Cùng với <span className="text-slate-900 font-bold">{partner.full_name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={() => handleUpdateStatus(booking.id, "completed")} className="bg-green-600 hover:bg-green-700 shadow-green-100" size="sm">
                   Hoàn thành
                </Button>
                <Button onClick={() => handleUpdateStatus(booking.id, "cancelled")} variant="outline" className="text-red-500 border-red-100 hover:bg-red-50" size="sm">
                   Hủy lịch
                </Button>
              </div>
            </div>
          );
        }) : (
           <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-medium">Chưa có lịch học nào sắp tới.</p>
           </div>
        )}

        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pt-6">Lịch sử</h3>
        {history.length > 0 ? history.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-80">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                <span className="text-[10px] font-bold uppercase">{new Date(booking.start_at).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                <span className="text-xl font-bold">{new Date(booking.start_at).getDate()}</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">
                   {booking.request.sender_id === currentUserId ? booking.request.learning_skill?.title : booking.request.teaching_skill?.title}
                </h4>
                <div className="flex items-center gap-2">
                   <span className={cn(
                     "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                     booking.status === "completed" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                   )}>
                      {booking.status === "completed" ? "Đã hoàn thành" : "Đã hủy"}
                   </span>
                </div>
              </div>
            </div>
            {booking.status === "completed" && (
               <Button onClick={() => handleOpenReview(booking)} size="sm">Đánh giá</Button>
            )}
          </div>
        )) : (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
             <p className="text-slate-400 text-sm">Lịch sử trống.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 text-lg">Đặt lịch học mới</h3>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
             </div>
             <form onSubmit={handleCreateBooking} className="p-8 space-y-6">
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex gap-2"><AlertCircle size={18} /> {error}</div>}
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">Chọn yêu cầu đã chấp nhận</label>
                      <select name="requestId" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
                         <option value="">Chọn một trao đổi...</option>
                         {acceptedRequests.map(req => {
                           const partnerName = req.sender_id === currentUserId ? req.receiver.full_name : req.sender.full_name;
                           return <option key={req.id} value={req.id}>Trao đổi với {partnerName}</option>
                         })}
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Bắt đầu</label>
                        <input name="startAt" type="datetime-local" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Kết thúc</label>
                        <input name="endAt" type="datetime-local" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase">Địa điểm / Link họp</label>
                      <input name="location" placeholder="Thư viện, Google Meet link, ..." required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                   </div>
                </div>
                <div className="flex gap-4">
                   <Button type="button" variant="outline" className="flex-grow" onClick={() => setIsBookingModalOpen(false)}>Hủy</Button>
                   <Button type="submit" className="flex-grow" isLoading={isLoading}>Lưu lịch hẹn</Button>
                </div>
             </form>
           </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && selectedBooking && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Đánh giá buổi học</h3>
                  <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
               </div>
               <form onSubmit={handleSubmitReview} className="p-8 space-y-6">
                  {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex gap-2"><AlertCircle size={18} /> {error}</div>}
                  <input type="hidden" name="bookingId" value={selectedBooking.id} />
                  <input type="hidden" name="revieweeId" value={selectedBooking.request.sender_id === currentUserId ? selectedBooking.request.receiver_id : selectedBooking.request.sender_id} />
                  
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Điểm đánh giá (1-5)</label>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map(v => (
                              <label key={v} className="relative cursor-pointer">
                                 <input type="radio" name="rating" value={v} required className="peer sr-only" />
                                 <Star className="text-slate-200 peer-checked:text-amber-500 transition-colors" fill="currentColor" size={32} />
                              </label>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nhận xét</label>
                        <textarea name="comment" rows={3} required placeholder="Bạn cảm thấy buổi học thế nào? Kiến thức có ích không?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <Button type="button" variant="outline" className="flex-grow" onClick={() => setIsReviewModalOpen(false)}>Hủy</Button>
                     <Button type="submit" className="flex-grow" isLoading={isLoading}>Gửi đánh giá</Button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
