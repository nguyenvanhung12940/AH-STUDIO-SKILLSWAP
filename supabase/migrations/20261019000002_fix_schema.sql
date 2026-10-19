-- Add role to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Fix bookings table to use start_at and end_at
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='scheduled_at') THEN
        ALTER TABLE bookings DROP COLUMN scheduled_at;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bookings' AND column_name='duration_minutes') THEN
        ALTER TABLE bookings DROP COLUMN duration_minutes;
    END IF;
END $$;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- Update existing rows if any
UPDATE bookings SET start_at = NOW(), end_at = NOW() + interval '1 hour' WHERE start_at IS NULL;

ALTER TABLE bookings ALTER COLUMN start_at SET NOT NULL;
ALTER TABLE bookings ALTER COLUMN end_at SET NOT NULL;

-- Add a constraint to ensure end_at is after start_at
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_time_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_time_check CHECK (end_at > start_at);

-- Add 'cancelled' to exchange_requests status
ALTER TABLE exchange_requests DROP CONSTRAINT IF EXISTS exchange_requests_status_check;
ALTER TABLE exchange_requests ADD CONSTRAINT exchange_requests_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled'));

-- 8. Trigger to update user_skills rating
CREATE OR REPLACE FUNCTION update_skill_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_skill_id UUID;
    req_record RECORD;
    book_record RECORD;
BEGIN
    -- Get booking and request info
    SELECT * INTO book_record FROM bookings WHERE id = NEW.booking_id;
    SELECT * INTO req_record FROM exchange_requests WHERE id = book_record.request_id;

    -- Determine which skill was reviewed
    IF NEW.reviewer_id = req_record.sender_id THEN
        -- Sender is reviewing receiver, so receiver's skill (learning_skill_id for sender)
        target_skill_id := req_record.learning_skill_id;
    ELSE
        -- Receiver is reviewing sender, so sender's skill (teaching_skill_id for sender)
        target_skill_id := req_record.teaching_skill_id;
    END IF;

    IF target_skill_id IS NOT NULL THEN
        UPDATE user_skills
        SET 
            rating = (
                SELECT AVG(r.rating) 
                FROM reviews r
                JOIN bookings b ON r.booking_id = b.id
                JOIN exchange_requests er ON b.request_id = er.id
                WHERE (er.teaching_skill_id = target_skill_id OR er.learning_skill_id = target_skill_id)
                AND r.reviewee_id = (SELECT profile_id FROM user_skills WHERE id = target_skill_id)
            ),
            reviews_count = (
                SELECT COUNT(*) 
                FROM reviews r
                JOIN bookings b ON r.booking_id = b.id
                JOIN exchange_requests er ON b.request_id = er.id
                WHERE (er.teaching_skill_id = target_skill_id OR er.learning_skill_id = target_skill_id)
                AND r.reviewee_id = (SELECT profile_id FROM user_skills WHERE id = target_skill_id)
            )
        WHERE id = target_skill_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_review_submitted ON reviews;
CREATE TRIGGER on_review_submitted
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE PROCEDURE update_skill_rating();
