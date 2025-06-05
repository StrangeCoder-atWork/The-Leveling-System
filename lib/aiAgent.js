// lib/userProfile.js

export const getUserProfile = () => {
  if (typeof window === "undefined") return null; // localStorage only in browser

  const userId = localStorage.getItem('currentUserId');
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
      completedTasks: Object.values(tasksData || {}).filter(task => task.completed).length,
      preferredMotivation: userData.personalData?.preferredMotivation || "Balanced",
      currentMood: userData.personalData?.currentMood || "Neutral"
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};
// lib/aiAgent.js

// Simulate an API call to AI backend for personalized chat response
export async function askAgentPersonalized(type, { message, conversation, ...userProfile }) {
  // For example, your backend URL for AI calls
  const apiUrl = '/api/ai/chat';

  // Build the payload including user profile and conversation
  const payload = {
    type, // e.g., 'chat'
    message,
    conversation,
    userProfile,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Assuming your API returns { message: "AI reply" }
    return data;
  } catch (error) {
    console.error('Error in askAgentPersonalized:', error);
    throw error;
  }
}
