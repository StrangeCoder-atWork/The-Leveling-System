'use client';
export const localStorageMiddleware = store => next => action => {
  // Ensure action is a plain object
  if (!action || typeof action !== 'object' || Array.isArray(action)) {
    console.error('Invalid action:', action);
    return next(action);
  }

  const result = next(action);
  const state = store.getState();
  const userId = localStorage.getItem('currentUserId');
  
  if (userId) {
    try {
      // Save all state slices to localStorage
      localStorage.setItem(`userState_${userId}`, JSON.stringify(state.user));
      localStorage.setItem(`tasksState_${userId}`, JSON.stringify(state.tasks));
      localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify(state.flashcards));
      localStorage.setItem(`streaksState_${userId}`, JSON.stringify(state.streaks));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  return result;
};