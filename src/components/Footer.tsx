import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                SkillSwap
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              Nền tảng trao đổi kỹ năng hàng đầu cho sinh viên Việt Nam. Học hỏi, kết nối và phát triển bản thân mỗi ngày.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/explore" className="hover:text-blue-600 transition-colors">Tìm kỹ năng</Link></li>
              <li><Link href="/profile" className="hover:text-blue-600 transition-colors">Người hướng dẫn</Link></li>
              <li><Link href="/community" className="hover:text-blue-600 transition-colors">Cộng đồng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Điều khoản</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Bảo mật</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs text-center md:text-left">
            © {new Date().getFullYear()} SkillSwap. Phát triển bởi nhóm Sinh viên Khởi nghiệp.
          </p>
          <div className="flex gap-6 text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Facebook</a>
            <a href="#" className="hover:text-slate-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
