// lib/userProfile.js

export const getUserProfile = () => {
  if (typeof window === "undefined") return null; 

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
  const apiUrl = '/api/ai/chat';
  const retryLimit = 3;
  let retryCount = 0;

  const payload = {
    section: type,
    userProfile: {
      ...userProfile,
      message,
      conversation
    }
  };

  async function makeRequest() {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        throw new Error('AI service endpoint not found');
      }

      if (response.status === 405) {
        throw new Error('Invalid request method');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`AI API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (retryCount < retryLimit && (error.message.includes('network') || error.message.includes('failed'))) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return makeRequest();
      }
      throw error;
    }
  }

  return makeRequest();
}
