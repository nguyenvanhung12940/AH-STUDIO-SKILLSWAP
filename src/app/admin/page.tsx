import { createClient } from "@/src/utils/supabase/server";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();

  // Fetch stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
  const { count: skillsCount } = await supabase.from("user_skills").select("*", { count: 'exact', head: true });
  const { count: bookingsCount } = await supabase.from("bookings").select("*", { count: 'exact', head: true }).eq("status", "completed");
  const { count: reportsCount } = await supabase.from("reports").select("*", { count: 'exact', head: true }).eq("status", "pending");

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(10);

  // Fetch reports
  const { data: reports } = await supabase
    .from("reports")
    .select("*, reporter:reporter_id(full_name), reported:reported_id(full_name)")
    .order("created_at", { ascending: false });

  return (
    <AdminClient 
      stats={{
        users: usersCount || 0,
        skills: skillsCount || 0,
        bookings: bookingsCount || 0,
        reports: reportsCount || 0
      }}
      recentUsers={recentUsers || []}
      reports={reports || []}
    />
  );
}
