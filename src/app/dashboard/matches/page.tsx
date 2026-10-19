import { createClient } from "@/src/utils/supabase/server";
import { redirect } from "next/navigation";
import MatchesClient from "./MatchesClient";

export default async function MatchesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  // 1. Get my skills
  const { data: mySkills } = await supabase
    .from("user_skills")
    .select("*, categories:category_id (name)")
    .eq("profile_id", user.id);

  const myTeaching = mySkills?.filter(s => s.type === "teaching") || [];
  const myLearning = mySkills?.filter(s => s.type === "learning") || [];

  const myTeachingIds = myTeaching.map(s => s.category_id).filter(Boolean);
  const myLearningIds = myLearning.map(s => s.category_id).filter(Boolean);

  // 2. Find potential matches
  if (myTeachingIds.length === 0 && myLearningIds.length === 0) {
    return (
      <MatchesClient 
        matches={[]} 
        myTeaching={myTeaching}
        myLearning={myLearning}
      />
    );
  }

  // Matches where:
  // - They teach what I want to learn
  // - OR They want to learn what I teach
  const { data: potentialSkills } = await supabase
    .from("user_skills")
    .select(`
      *,
      profiles:profile_id (*),
      categories:category_id (name)
    `)
    .neq("profile_id", user.id)
    .eq("status", "active")
    .or(`category_id.in.(${[...myTeachingIds, ...myLearningIds].join(",")})`);

  // 3. Process matches in memory (for MVP flexibility)
  const userMatches: Record<string, any> = {};

  potentialSkills?.forEach(skill => {
    const pid = skill.profiles.id;
    if (!userMatches[pid]) {
      userMatches[pid] = {
        profile: skill.profiles,
        teaching: [],
        learning: [],
        score: 0,
        reasons: []
      };
    }

    if (skill.type === "teaching") {
      userMatches[pid].teaching.push(skill);
      // Do I want to learn this?
      if (myLearningIds.includes(skill.category_id)) {
        userMatches[pid].score += 2;
        userMatches[pid].reasons.push(`Họ dạy "${skill.title}" mà bạn muốn học`);
      }
    } else {
      userMatches[pid].learning.push(skill);
      // Do I teach this?
      if (myTeachingIds.includes(skill.category_id)) {
        userMatches[pid].score += 2;
        userMatches[pid].reasons.push(`Họ muốn học "${skill.title}" mà bạn có thể dạy`);
      }
    }
  });

  const matches = Object.values(userMatches)
    .filter((m: any) => m.score > 0)
    .sort((a: any, b: any) => b.score - a.score);

  return (
    <MatchesClient 
      matches={matches} 
      myTeaching={myTeaching}
      myLearning={myLearning}
    />
  );
}
