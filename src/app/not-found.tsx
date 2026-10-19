import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang | SkillSwap",
  description: "Trang bạn đang tìm kiếm không tồn tại trên SkillSwap.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-bounce-slow">
        <span className="text-4xl font-bold">404</span>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Ối! Trang này không tồn tại</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Có vẻ như đường dẫn bạn đang truy cập đã bị thay đổi hoặc không còn hoạt động. Hãy quay về trang chủ để tiếp tục khám phá nhé!
      </p>
      <a
        href="/"
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
      >
        Quay về Trang chủ
      </a>
    </div>
  );
}
