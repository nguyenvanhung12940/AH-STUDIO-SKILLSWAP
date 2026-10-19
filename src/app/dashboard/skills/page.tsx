import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageSkillsClient from "./ManageSkillsClient";

export default async function ManageSkillsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // Fetch user skills
  const { data: skills } = await supabase
    .from("user_skills")
    .select(`
      *,
      categories:category_id (id, name)
    `)
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch categories for the "Add Skill" form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <ManageSkillsClient 
      initialSkills={skills || []} 
      categories={categories || []} 
    />
  );
}
