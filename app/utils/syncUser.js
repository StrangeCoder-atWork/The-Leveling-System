'use client';
import { store } from '../Store/store';
import { setLoading, setNotification } from '../Store/slices/uiSlice';

export async function syncUserDataIfOnline() {
  if (typeof window !== "undefined" && navigator.onLine) {
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return;
    
    store.dispatch(setLoading(true));
    
    try {
      // Get data from Redux store instead of localStorage
      const state = store.getState();
      
      const res = await fetch("/api/sync", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          xp: state.user.xp || 0, 
          money: state.user.money || 0, 
          level: state.user.level || 1, 
          rank: state.user.rank || "E", 
          personalData: state.user.personalData || {}, 
          profession: state.user.profession || "Student", 
          title: state.user.title || null,
          tasks: state.tasks, 
          flashCards: state.flashcards,
          streaks: state.streaks.streaks || {
            workout: 0,
            study: 0,
            work: 0,
            other: 0
          },
          streakHistory: state.streaks.history || {}
        }) 
      });
      
      const data = await res.json();
      console.log("Sync status:", data.message);
      store.dispatch(setNotification({ type: 'success', message: 'Data synchronized successfully' }));
    } catch (err) {
      console.error("Error syncing user data:", err);
      store.dispatch(setNotification({ type: 'error', message: `Sync failed: ${err.message}` }));
    } finally {
      store.dispatch(setLoading(false));
    }
  }
}