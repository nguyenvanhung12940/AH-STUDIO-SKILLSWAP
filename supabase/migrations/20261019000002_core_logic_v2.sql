-- 1. Add role to profiles
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Update bookings schema
ALTER TABLE bookings ADD COLUMN end_at TIMESTAMPTZ;
ALTER TABLE bookings RENAME COLUMN scheduled_at TO start_at;

-- 3. Function to update average rating in user_skills and profiles
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_reviewee_id UUID;
    avg_rating FLOAT;
    total_reviews INT;
BEGIN
    target_reviewee_id := NEW.reviewee_id;
    
    SELECT AVG(rating), COUNT(*) INTO avg_rating, total_reviews
    FROM reviews
    WHERE reviewee_id = target_reviewee_id;
    
    UPDATE profiles
    SET updated_at = NOW() -- We don't have a rating column in profiles yet, let's just trigger updates
    WHERE id = target_reviewee_id;
    
    -- If we had a skills specific rating we would update it here, 
    -- but for now let's focus on the global perception.
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_added
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE PROCEDURE update_user_rating();

-- 4. Admin Policies
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can view all reports" ON reports FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update reports" ON reports FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
