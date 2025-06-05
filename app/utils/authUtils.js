'use client';
import { signOut } from 'next-auth/react';
import { syncService } from '../services/syncService';

export const handleLogout = async () => {
  const userId = localStorage.getItem('currentUserId');
  if (userId) {
    // Save current state to server before logout
    await syncService.syncWithServer();
    
    // Don't remove the data - just remove the current user marker
    localStorage.removeItem('currentUserId');
  }
  signOut({ callbackUrl: '/login' });
};