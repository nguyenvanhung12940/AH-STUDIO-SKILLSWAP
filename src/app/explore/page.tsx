import { createClient } from "@/src/utils/supabase/server";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const category = params.category || "Tất cả";

  const supabase = await createClient();

  // 1. Fetch Categories
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // 2. Fetch Skills (teaching only for discovery usually, or both?)
  // Let's fetch all active teaching skills for discovery
  let query = supabase
    .from("user_skills")
    .select(`
      *,
      profiles:profile_id (full_name, avatar_url, university),
      categories:category_id (name)
    `)
    .eq("status", "active")
    .eq("type", "teaching");

  if (category !== "Tất cả") {
    query = query.eq("categories.name", category);
  }

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: skills, error } = await query.order("created_at", { ascending: false });

  return (
    <ExploreClient 
      initialSkills={skills || []} 
      categories={categories || []}
      initialQuery={q}
      initialCategory={category}
    />
  );
}
