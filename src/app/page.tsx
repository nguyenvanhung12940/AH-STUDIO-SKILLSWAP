import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
                <Sparkles size={14} />
                <span>Nền tảng trao đổi kỹ năng #1 cho sinh viên</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                Dạy những gì bạn <span className="text-blue-600">biết</span>,<br />
                Học những gì bạn <span className="text-purple-600">cần</span>.
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-900">
                SkillSwap giúp bạn kết nối với hàng nghìn sinh viên khác để trao đổi kiến thức hoàn toàn miễn phí. Phát triển bản thân thông qua sự chia sẻ.
              </p>
              <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <Link
                  href="/explore"
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200/50 flex items-center gap-2"
                >
                  Khám phá kỹ năng
                  <ArrowRight size={18} />
                </Link>
                <Link
                  href="/how-it-works"
                  className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center gap-2"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
              
              <div className="mt-12 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  <span className="text-slate-900 font-bold">500+</span> sinh viên đang tham gia
                </p>
              </div>
            </div>
            
            <div className="relative lg:h-[600px] hidden lg:block animate-in fade-in zoom-in duration-1000">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-purple-100/50 rounded-3xl -rotate-2" />
              <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                <div className="absolute top-12 left-12 p-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 max-w-[200px] z-10 animate-bounce-slow">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 size={16} />
                     </div>
                     <span className="text-xs font-bold text-slate-900">Kỹ năng mới</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium">Bạn đã hoàn thành buổi học "Thiết kế Figma" với An.</p>
                </div>
                
                <div className="absolute bottom-12 right-12 p-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 max-w-[200px] z-10">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        AI
                     </div>
                     <span className="text-xs font-bold text-slate-900">Yêu cầu mới</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium">Minh muốn học "Lập trình Python" từ bạn.</p>
                   <button className="mt-2 w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg">Chấp nhận</button>
                </div>

                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <BookOpen size={120} className="text-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tại sao nên chọn SkillSwap?</h2>
            <p className="text-slate-600">Chúng tôi tạo ra một môi trường học tập cộng đồng, nơi mỗi người đều có giá trị để chia sẻ.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-blue-50 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cộng đồng sinh viên</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Kết nối với những người cùng chí hướng từ các trường đại học khác nhau.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-purple-50 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trao đổi 1-1</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Học tập trực tiếp thông qua các buổi hướng dẫn riêng tư, hiệu quả và tập trung.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 hover:bg-pink-50 transition-colors group">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hồ sơ năng lực</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Xây dựng profile chuyên nghiệp với các đánh giá thực tế từ người học.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl" />
             
             <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng để bắt đầu hành trình mới?</h2>
             <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
               Tham gia cùng 500+ sinh viên ngay hôm nay và bắt đầu trao đổi kỹ năng của bạn. Hoàn toàn miễn phí.
             </p>
             <div className="flex flex-wrap justify-center gap-4">
               <Link href="/register" className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg">
                 Đăng ký thành viên
               </Link>
               <Link href="/explore" className="px-8 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all border border-blue-500">
                 Xem các kỹ năng
               </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
