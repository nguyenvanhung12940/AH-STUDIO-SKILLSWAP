import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageRequestsClient from "./ManageRequestsClient";

export default async function RequestsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // Fetch received requests
  const { data: received } = await supabase
    .from("exchange_requests")
    .select(`
      *,
      sender:sender_id (*),
      learning_skill:learning_skill_id (title),
      teaching_skill:teaching_skill_id (title)
    `)
    .eq("receiver_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch sent requests
  const { data: sent } = await supabase
    .from("exchange_requests")
    .select(`
      *,
      receiver:receiver_id (*),
      learning_skill:learning_skill_id (title),
      teaching_skill:teaching_skill_id (title)
    `)
    .eq("sender_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <ManageRequestsClient 
      received={received || []} 
      sent={sent || []} 
    />
  );
}
