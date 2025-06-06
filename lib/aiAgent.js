
export const getUserProfile = () => {
  const userId = localStorage.getItem("currentUserId");
  if (!userId) return null;

  try {
    const userData = JSON.parse(localStorage.getItem(`userState_${userId}`));
    const tasksData = JSON.parse(localStorage.getItem(`tasksState_${userId}`));

    return {
      name: userData.personalData?.name || "User",
      age: userData.personalData?.age || null,
      goal: userData.personalData?.goal || "Not set",
      personality: userData.personalData?.personality || "Not specified",
      favoriteSubject: userData.personalData?.favoriteSubject || "Not specified",
      weakAreas: userData.personalData?.weakAreas || [],
      streak: userData.streak || 0,
      XP: userData.xp || 0,
      level: userData.level || 1,
      rank: userData.rank || "E-Rank",
      completedTasks: Object.values(tasksData || {}).filter((t) => t.completed).length,
      preferredMotivation: userData.personalData?.preferredMotivation || "Balanced",
      currentMood: userData.personalData?.currentMood || "Neutral",
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
};


export async function askAgentPersonalized(section, userProfile) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, userProfile, message: userProfile.message || "" }),
    });

    return await res.json();
  } catch (err) {
    console.error("askAgentPersonalized error:", err);
    return {
      title: "Error",
      message: "Connection disrupted. Retry when stable.",
      error: true,
    };
  }
}