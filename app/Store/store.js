import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tasksReducer from './slices/tasksSlice';
import flashcardsReducer from './slices/flashcardsSlice';
import streaksReducer from './slices/streaksSlice';
import uiReducer from './slices/uiSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

// Load state from localStorage
const loadState = () => {
  if (typeof window === 'undefined') return {};
  
  const userId = localStorage.getItem('currentUserId');
  if (!userId) return {};
  
  try {
    const userState = localStorage.getItem(`userState_${userId}`);
    const tasksState = localStorage.getItem(`tasksState_${userId}`);
    const flashcardsState = localStorage.getItem(`flashcardsState_${userId}`);
    const streaksState = localStorage.getItem(`streaksState_${userId}`);
    
    return {
      user: userState ? JSON.parse(userState) : undefined,
      tasks: tasksState ? JSON.parse(tasksState) : undefined,
      flashcards: flashcardsState ? JSON.parse(flashcardsState) : undefined,
      streaks: streaksState ? JSON.parse(streaksState) : undefined
    };
  } catch (e) {
    console.error('Error loading state from localStorage:', e);
    return {};
  }
};

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
    flashcards: flashcardsReducer,
    streaks: streaksReducer,
    ui: uiReducer
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});