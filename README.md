# Hướng dẫn triển khai MVP SkillSwap

Tài liệu này hướng dẫn bạn cách triển khai dự án SkillSwap từ môi trường phát triển lên môi trường thử nghiệm công khai để người khác có thể truy cập.

## 🛠 Công nghệ sử dụng
- **Frontend:** Next.js 15+ (App Router)
- **Styling:** Tailwind CSS & Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **AI:** Google Gemini API (cho các tính năng thông minh nếu có)
- **Hosting:** Vercel (Khuyên dùng cho Next.js)

---

## 📋 Bước 1: Chuẩn bị tài khoản
Bạn cần chuẩn bị các tài khoản sau (tất cả đều có gói miễn phí):
1. [GitHub](https://github.com/): Để lưu trữ mã nguồn.
2. [Supabase](https://supabase.com/): Để quản lý Cơ sở dữ liệu và Xác thực người dùng.
3. [Vercel](https://vercel.com/): Để chạy website.

---

## 🗄 Bước 2: Thiết lập Supabase (Database & Auth)
1. Đăng nhập vào Supabase và tạo một **New Project**.
2. Đặt tên dự án là `SkillSwap` và lưu lại **Database Password**.
3. **Chạy Migration:**
   - Vào mục **SQL Editor** trong Dashboard của Supabase.
   - Mở các file trong thư mục `supabase/migrations/` theo thứ tự (từ `00...00` đến `00...02`).
   - Copy nội dung từng file và nhấn **Run** để tạo các bảng (Users, Skills, Swaps, Notifications, v.v.).
4. **Lấy API Keys:**
   - Vào **Project Settings** > **API**.
   - Copy `Project URL` và `anon public key`. Bạn sẽ cần chúng ở bước sau.

---

## 🚀 Bước 3: Đưa mã nguồn lên GitHub
1. Tạo một repository mới trên GitHub (để ở chế độ Private nếu muốn bảo mật).
2. Đẩy mã nguồn từ máy tính của bạn lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit SkillSwap MVP"
   git branch -M main
   git remote add origin <URL_REPOSITORY_CỦA_BẠN>
   git push -u origin main
   ```

---

## 🌐 Bước 4: Triển khai lên Vercel
1. Đăng nhập vào Vercel bằng tài khoản GitHub.
2. Nhấn **Add New** > **Project** và chọn repository `SkillSwap` vừa upload.
3. **Cấu hình Biến môi trường (Environment Variables):**
   Trong mục **Environment Variables**, thêm các biến sau:
   - `NEXT_PUBLIC_SUPABASE_URL`: (Lấy từ Supabase API Settings)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Lấy từ Supabase API Settings)
   - `GEMINI_API_KEY`: (Lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey))
4. Nhấn **Deploy**. Chờ khoảng 1-2 phút để Vercel xây dựng website.

---

## 🔑 Bước 5: Cấu hình xác thực (Auth Redirect)
Sau khi Vercel cấp cho bạn một URL (ví dụ: `https://skillswap-xyz.vercel.app`), bạn cần quay lại Supabase để cấu hình:
1. Vào **Authentication** > **URL Configuration**.
2. Tại **Site URL**, điền URL của Vercel vào.
3. Tại **Redirect URLs**, thêm: `https://skillswap-xyz.vercel.app/auth/callback`.

---

## 🧪 Bước 6: Kiểm tra sau triển khai
Truy cập vào URL công khai và thực hiện các bước sau:
1. **Đăng ký tài khoản mới:** Đảm bảo email xác nhận được gửi (hoặc dùng OTP).
2. **Tạo hồ sơ:** Thêm kỹ năng "Dạy" và "Học".
3. **Tìm kiếm:** Kiểm tra xem dữ liệu từ Database có hiển thị đúng không.
4. **Gửi yêu cầu:** Thử kết nối với một tài khoản khác để kiểm tra tính năng ghép cặp.

## 🛠 Xử lý lỗi thường gặp
- **Lỗi 500 khi vào Dashboard:** Kiểm tra xem bạn đã chạy đủ các file migration SQL chưa.
- **Không đăng nhập được:** Kiểm tra `Site URL` trong Supabase Auth đã khớp với URL của Vercel chưa.
- **Dữ liệu không cập nhật:** Đảm bảo các biến môi trường trên Vercel không có khoảng trắng thừa.

---
*Chúc bạn triển khai thành công SkillSwap!*
