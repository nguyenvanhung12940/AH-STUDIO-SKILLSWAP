import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Fetch bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      request:request_id (
        sender:sender_id (full_name, avatar_url),
        receiver:receiver_id (full_name, avatar_url),
        teaching_skill:teaching_skill_id (title),
        learning_skill:learning_skill_id (title)
      )
    `)
    .order("start_at", { ascending: true });

  // 2. Fetch accepted requests that don't have enough bookings (optional logic)
  // For now let's just fetch all accepted requests to allow booking new sessions
  const { data: acceptedRequests } = await supabase
    .from("exchange_requests")
    .select(`
      *,
      sender:sender_id (full_name),
      receiver:receiver_id (full_name),
      teaching_skill:teaching_skill_id (title),
      learning_skill:learning_skill_id (title)
    `)
    .eq("status", "accepted")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

  return (
    <ScheduleClient 
      initialBookings={bookings || []} 
      acceptedRequests={acceptedRequests || []}
      currentUserId={user.id}
    />
  );
}
