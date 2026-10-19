"use client";

import { useState, useTransition } from "react";
import { Search, Star, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface ExploreClientProps {
  initialSkills: any[];
  categories: any[];
  initialQuery: string;
  initialCategory: string;
}

export default function ExploreClient({
  initialSkills,
  categories,
  initialQuery,
  initialCategory,
}: ExploreClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (initialCategory !== "Tất cả") params.set("category", initialCategory);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleCategoryChange = (catName: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (catName !== "Tất cả") params.set("category", catName);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Khám phá kỹ năng</h1>
          <p className="text-slate-600">Tìm kiếm những người bạn cùng trao đổi kiến thức và phát triển bản thân.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <form onSubmit={handleSearch} className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm kỹ năng, công nghệ..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange("Tất cả")}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                initialCategory === "Tất cả"
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
              )}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.name)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                  initialCategory === cat.name
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className={cn("transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100")}>
          {initialSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {initialSkills.map((skill) => (
                <div key={skill.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                        {skill.categories?.name || "Kỹ năng"}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-900">{skill.rating || "5.0"}</span>
                      </div>
                    </div>
                    
                    <Link href={`/skill/${skill.id}`}>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {skill.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">
                      {skill.description || "Không có mô tả."}
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                           {skill.profiles?.avatar_url ? (
                             <img src={skill.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <span className="text-[10px] font-bold text-blue-600">
                               {skill.profiles?.full_name?.substring(0, 1) || "U"}
                             </span>
                           )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{skill.profiles?.full_name || "Người dùng"}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{skill.profiles?.university || "Sinh viên"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/skill/${skill.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all group-hover:bg-blue-600 group-hover:text-white"
                  >
                    Xem chi tiết
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-slate-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-slate-500">Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
              <button 
                onClick={() => handleCategoryChange("Tất cả")}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
