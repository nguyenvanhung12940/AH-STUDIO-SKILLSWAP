-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  university TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. User Skills Table (Kỹ năng có thể dạy và muốn học)
CREATE TABLE user_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('teaching', 'learning')) NOT NULL,
  status TEXT CHECK (status IN ('active', 'draft')) DEFAULT 'active',
  rating FLOAT DEFAULT 0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exchange Requests Table (Yêu cầu trao đổi)
CREATE TABLE exchange_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  teaching_skill_id UUID REFERENCES user_skills(id) ON DELETE SET NULL, -- Kỹ năng người gửi muốn dạy
  learning_skill_id UUID REFERENCES user_skills(id) ON DELETE SET NULL, -- Kỹ năng người gửi muốn học
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings Table (Lịch học)
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES exchange_requests(id) ON DELETE CASCADE NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  location TEXT, -- 'Online' hoặc địa điểm thực tế
  meeting_link TEXT,
  status TEXT CHECK (status IN ('upcoming', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews Table (Đánh giá)
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reports Table (Báo cáo)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Mọi người xem được profile công khai, chỉ chủ sở hữu mới được sửa
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Mọi người xem được, chỉ admin mới được sửa (giả định admin role)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

-- User Skills: Xem các skill active, chỉ chủ sở hữu mới được CRUD
CREATE POLICY "Skills are viewable by everyone" ON user_skills FOR SELECT USING (status = 'active' OR auth.uid() = profile_id);
CREATE POLICY "Users can insert own skills" ON user_skills FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own skills" ON user_skills FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can delete own skills" ON user_skills FOR DELETE USING (auth.uid() = profile_id);

-- Exchange Requests: Chỉ người gửi và người nhận mới xem được
CREATE POLICY "Users can view own exchange requests" ON exchange_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert exchange requests" ON exchange_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own exchange requests" ON exchange_requests FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Bookings: Chỉ người liên quan mới xem được
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM exchange_requests 
    WHERE exchange_requests.id = request_id 
    AND (exchange_requests.sender_id = auth.uid() OR exchange_requests.receiver_id = auth.uid())
  )
);

-- Reviews: Mọi người xem được, chỉ người học mới được tạo review cho buổi học của mình
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert reviews for their bookings" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Seeding Categories
INSERT INTO categories (name) VALUES 
('Lập trình'), 
('Thiết kế'), 
('Ngoại ngữ'), 
('Marketing'), 
('Kỹ năng mềm'), 
('Âm nhạc'), 
('Nấu ăn');

-- Trigger tự động tạo profile khi có user mới đăng ký qua Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
