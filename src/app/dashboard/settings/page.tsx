"use client";

import { useState, useEffect } from "react";
import { User, GraduationCap, FileText, Camera, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updateProfile } from "@/src/app/auth/actions";
import { createClient } from "@/src/utils/supabase/client";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
      // Refresh local profile state
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();
      setProfile(data);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt tài khoản</h1>
        <p className="text-slate-500 text-sm">Cập nhật thông tin cá nhân và hồ sơ năng lực của bạn.</p>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden border-4 border-white shadow-md">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.full_name?.substring(0, 2).toUpperCase() || "HA"
                )}
              </div>
              <button type="button" className="absolute bottom-0 right-0 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-blue-600 transition-all">
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Ảnh đại diện</h4>
              <p className="text-xs text-slate-500 mb-3">Sử dụng ảnh thật để tăng sự tin tưởng.</p>
              <input 
                name="avatarUrl" 
                type="url" 
                defaultValue={profile?.avatar_url || ""}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                Họ và tên
              </label>
              <input
                name="fullName"
                type="text"
                required
                defaultValue={profile?.full_name || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                <GraduationCap size={16} className="text-slate-400" />
                Trường đại học
              </label>
              <input
                name="university"
                type="text"
                required
                defaultValue={profile?.university || ""}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
              <FileText size={16} className="text-slate-400" />
              Giới thiệu bản thân
            </label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={profile?.bio || ""}
              placeholder="Chia sẻ một chút về bản thân, sở thích và mục tiêu trao đổi kỹ năng của bạn..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving && <Loader2 size={18} className="animate-spin" />}
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
