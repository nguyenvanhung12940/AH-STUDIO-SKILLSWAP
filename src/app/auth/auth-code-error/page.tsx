"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function AuthCodeError() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lỗi xác thực</h1>
          <p className="text-slate-500 mb-8">
            Đã có lỗi xảy ra trong quá trình xác thực tài khoản. Vui lòng thử lại sau hoặc đăng nhập bằng phương thức khác.
          </p>
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Quay lại đăng nhập
            </Link>
            <Link
              href="/"
              className="block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
