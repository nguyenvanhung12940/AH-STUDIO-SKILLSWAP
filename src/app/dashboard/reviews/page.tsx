import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import ReviewsClient from "./ReviewsClient";

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Fetch reviews where the user is the reviewee (someone gave them a review)
  const { data: reviewsReceived } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id (full_name, avatar_url),
      booking:booking_id (
        request:request_id (
          teaching_skill:teaching_skill_id (title),
          learning_skill:learning_skill_id (title)
        )
      )
    `)
    .eq("reviewee_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate average rating
  const avgRating = reviewsReceived && reviewsReceived.length > 0
    ? (reviewsReceived.reduce((acc, r) => acc + r.rating, 0) / reviewsReceived.length).toFixed(1)
    : "0.0";

  return (
    <ReviewsClient 
      reviews={reviewsReceived || []} 
      avgRating={avgRating}
      count={reviewsReceived?.length || 0}
    />
  );
}
