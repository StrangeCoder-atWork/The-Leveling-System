// lib/aiAgent.js

// Get user profile from localStorage
export const getUserProfile = () => {
  if (typeof window === "undefined") return null;

  const userId = localStorage.getItem('currentUserId');
  if (!userId) return null;

  try {
    const userData = JSON.parse(localStorage.getItem(`userState_${userId}`)) || {};
    const tasksData = JSON.parse(localStorage.getItem(`tasksState_${userId}`)) || {};

    const personal = userData.personalData || {};

    return {
      name: personal.name || "User",
      age: personal.age || null,
      goal: personal.goal || "Not set",
      personality: personal.personality || "Not specified",
      favoriteSubject: personal.favoriteSubject || "Not specified",
      weakAreas: personal.weakAreas || [],
      preferredMotivation: personal.preferredMotivation || "Balanced",
      currentMood: personal.currentMood || "Neutral",
      streak: userData.streak || 0,
      XP: userData.xp || 0,
      level: userData.level || 1,
      rank: userData.rank || "E-Rank",
      completedTasks: Object.values(tasksData).filter(task => task?.completed).length,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Ask AI Agent (ZEYN) for a personalized response
export async function askAgentPersonalized(type, { message, conversation, ...userProfile }) {
  const apiUrl = '/api/agent/';
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
      const shouldRetry = retryCount < retryLimit && (
        error.message.toLowerCase().includes('network') ||
        error.message.toLowerCase().includes('failed')
      );

      if (shouldRetry) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        return makeRequest();
      }

      console.error('askAgentPersonalized failed:', error.message);
      throw error;
    }
  }

  return makeRequest();
}
