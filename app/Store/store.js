import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tasksReducer from './slices/tasksSlice';
import flashcardsReducer from './slices/flashcardsSlice';
import streaksReducer from './slices/streaksSlice';
import uiReducer from './slices/uiSlice';
import { localStorageMiddleware } from './middleware/localStorageMiddleware';

// Load state from localStorage
// Enhance error handling in loadState
const loadState = () => {
  if (typeof window === 'undefined') return {};
  
  const userId = localStorage.getItem('currentUserId');
  if (!userId) return {};
  
  try {
    const states = ['user', 'tasks', 'flashcards', 'streaks'].reduce((acc, key) => {
      try {
        const state = localStorage.getItem(`${key}State_${userId}`);
        acc[key] = state ? JSON.parse(state) : undefined;
      } catch (e) {
        console.error(`Error parsing ${key} state:`, e);
        acc[key] = undefined;
      }
      return acc;
    }, {});
    
    return states;
  } catch (e) {
    console.error('Error loading state:', e);
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
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(localStorageMiddleware),
});