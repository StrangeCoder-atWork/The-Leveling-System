'use client';
export const localStorageMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  const userId = localStorage.getItem('currentUserId');
  
  if (userId) {
    // Save all state slices to localStorage
    localStorage.setItem(`userState_${userId}`, JSON.stringify(state.user));
    localStorage.setItem(`tasksState_${userId}`, JSON.stringify(state.tasks));
    localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify(state.flashcards));
    localStorage.setItem(`streaksState_${userId}`, JSON.stringify(state.streaks));
    
    // Log to verify data is being saved
    console.log('Saved user state to localStorage:', state.user);
  }
  
  return result;
};