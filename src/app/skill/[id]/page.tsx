import { createClient } from "@/src/utils/supabase/server";
import { notFound } from "next/navigation";
import SkillDetailClient from "./SkillDetailClient";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: skill, error } = await supabase
    .from("user_skills")
    .select(`
      *,
      profiles:profile_id (*),
      categories:category_id (name)
    `)
    .eq("id", id)
    .single();

  if (error || !skill) return notFound();

  const { data: { user } } = await supabase.auth.getUser();
  
  let myTeaching: any[] = [];
  if (user) {
    const { data } = await supabase
      .from("user_skills")
      .select("*")
      .eq("profile_id", user.id)
      .eq("type", "teaching");
    myTeaching = data || [];
  }

  return (
    <SkillDetailClient 
      skill={skill} 
      currentUser={user}
      myTeaching={myTeaching}
    />
  );
}
