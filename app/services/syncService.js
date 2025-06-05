"use client"

import { store } from '../Store/store';
import { setOnlineStatus } from '../Store/slices/userSlice';
import { setLoading, setNotification } from '../Store/slices/uiSlice';
import { getSession } from 'next-auth/react';

class SyncService {
  constructor() {
    this.syncQueue = [];
    this.isSyncing = false;
    this.syncInterval = null;

    if (typeof window !== 'undefined') {
      // Check initial status using both navigator.onLine and network connectivity test
      this.checkConnectivity();
      
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
      
      // Periodically check actual connectivity
      setInterval(() => this.checkConnectivity(), 30000);
      
      this.startPeriodicSync();
    }
  }

  async checkConnectivity() {
    try {
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache',
      });
      store.dispatch(setOnlineStatus(response.ok));
    } catch (error) {
      store.dispatch(setOnlineStatus(false));
    }
  }
  
  startPeriodicSync() {
    // Clear any existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Sync every 5 minutes (adjust as needed)
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncWithServer();
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  handleOnline() {
    store.dispatch(setOnlineStatus(true));
    this.syncWithServer();
    this.startPeriodicSync();
  }

  handleOffline() {
    store.dispatch(setOnlineStatus(false));
    this.stopPeriodicSync();
  }

  async syncWithServer() {
    if (this.isSyncing || (typeof navigator !== 'undefined' && !navigator.onLine)) return;

    this.isSyncing = true;
    store.dispatch(setLoading(true));

    try {
      const session = await getSession();
      if (!session?.user?.id) {
        throw new Error('Not authenticated');
      }

      const state = store.getState();
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: session.user.id,
          xp: state.user.xp,
          money: state.user.money,
          level: state.user.level,
          rank: state.user.rank,
          personalData: state.user.personalData,
          profession: state.user.profession,
          tasks: state.tasks,
          flashCards: state.flashcards,
          streaks: state.streaks.streaks,
          streakHistory: state.streaks.history
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Sync failed with status: ${response.status}`);
      }

      const data = await response.json();
      store.dispatch(setNotification({
        type: 'success',
        message: 'Data synchronized successfully'
      }));
    } catch (error) {
      console.error('Sync error:', error);
      store.dispatch(setNotification({
        type: 'error',
        message: error.message || 'Failed to sync data'
      }));
    } finally {
      this.isSyncing = false;
      store.dispatch(setLoading(false));
    }
  }
}

export const syncService = new SyncService();