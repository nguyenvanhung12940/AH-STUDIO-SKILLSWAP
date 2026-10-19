import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (profileError || !profile) {
    return notFound();
  }

  // 2. Fetch User Skills
  const { data: skills } = await supabase
    .from("user_skills")
    .select(`
      *,
      categories:category_id (name)
    `)
    .eq("profile_id", id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // 3. Fetch Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      reviewer:reviewer_id (full_name, avatar_url)
    `)
    .eq("reviewee_id", id)
    .order("created_at", { ascending: false });

  return (
    <ProfileClient 
      profile={profile} 
      skills={skills || []} 
      reviews={reviews || []} 
    />
  );
}
