"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Loader2, X, BookOpen, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { addSkill, deleteSkill } from "@/src/app/auth/actions";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface ManageSkillsClientProps {
  initialSkills: any[];
  categories: any[];
}

export default function ManageSkillsClient({ initialSkills, categories }: ManageSkillsClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillType, setSkillType] = useState<"teaching" | "learning">("teaching");

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) return;
    
    setIsLoading(true);
    const result = await deleteSkill(id);
    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setIsLoading(false);
  };

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("type", skillType);
    
    const result = await addSkill(formData);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setIsModalOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý kỹ năng</h1>
          <p className="text-slate-500 text-sm">Danh sách các kỹ năng bạn đang chia sẻ hoặc muốn học.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={18} />
          Thêm kỹ năng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialSkills.map((skill) => (
          <div key={skill.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-200 transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                  skill.type === "teaching" ? "bg-green-50 text-green-600" : "bg-purple-50 text-purple-600"
                )}>
                  {skill.type === "teaching" ? "Dạy kỹ năng" : "Muốn học"}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(skill.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{skill.title}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 mb-4">{skill.description || "Không có mô tả."}</p>
              
              <div className="flex items-center gap-4 mt-6">
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Danh mục: {skill.categories?.name || "Khác"}</span>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
               <span>Rating: {skill.rating || "—"}</span>
               <span>{skill.reviews_count || 0} reviews</span>
            </div>
          </div>
        ))}
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-blue-200 transition-all group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-all">Thêm kỹ năng khác</span>
        </button>
      </div>

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Thêm kỹ năng mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddSkill} className="p-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="flex p-1 bg-slate-100 rounded-xl">
                 <button 
                    type="button"
                    onClick={() => setSkillType("teaching")}
                    className={cn(
                      "flex-grow py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                      skillType === "teaching" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                 >
                   <Sparkles size={14} />
                   Dạy kỹ năng
                 </button>
                 <button 
                    type="button"
                    onClick={() => setSkillType("learning")}
                    className={cn(
                      "flex-grow py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                      skillType === "learning" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                 >
                   <BookOpen size={14} />
                   Muốn học
                 </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Tên kỹ năng</label>
                  <input
                    name="title"
                    required
                    placeholder="VD: Lập trình React, IELTS Speaking..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Danh mục</label>
                  <select
                    name="categoryId"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Chọn danh mục...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Mô tả chi tiết</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Mô tả kinh nghiệm hoặc những gì bạn muốn đạt được..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-grow"
                  onClick={() => setIsModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="flex-grow"
                  isLoading={isLoading}
                >
                  Lưu kỹ năng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
