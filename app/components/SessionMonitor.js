'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { syncService } from '../services/syncService';

export default function SessionMonitor() {
  const { data: session, status } = useSession();
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Update last activity time on user interaction
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);
    
    // Check for inactivity every minute
    const inactivityCheck = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      
      // If inactive for more than 30 minutes and logged in, sync data
      if (inactiveTime > 30 * 60 * 1000 && status === 'authenticated') {
        syncService.syncWithServer();
      }
    }, 60 * 1000);
    
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(inactivityCheck);
    };
  }, [lastActivity, status]);
  
  return null; // This component doesn't render anything
}