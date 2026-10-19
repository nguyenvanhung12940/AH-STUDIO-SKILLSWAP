"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Code, Globe, AlertCircle, Eye, EyeOff } from "lucide-react";
import { login, signInWithOAuth } from "@/src/app/auth/actions";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    const result = await signInWithOAuth(provider);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 transition-transform hover:scale-105 active:scale-95">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            SkillSwap
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Mừng bạn quay trở lại!</h1>
        <p className="text-slate-500 mt-2">Đăng nhập để tiếp tục hành trình học hỏi.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">Email sinh viên</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              name="email"
              type="email"
              required
              placeholder="name@university.edu.vn"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 ml-1">
            <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
            <span className="text-xs text-slate-400 font-bold cursor-not-allowed">
              Quên mật khẩu?
            </span>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:bg-white focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-1 pb-2">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">Ghi nhớ đăng nhập</label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.98]"
        >
          {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-8 relative text-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <span className="relative px-4 bg-white text-xs text-slate-400 uppercase font-bold tracking-widest">Hoặc đăng nhập bằng</span>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700 active:scale-[0.98] disabled:opacity-50"
        >
          <Globe size={18} className="text-blue-500" />
          Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700 active:scale-[0.98] disabled:opacity-50"
        >
          <Code size={18} className="text-slate-900" />
          GitHub
        </button>
      </div>

      <p className="mt-10 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-10 h-[600px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
