'use client';
import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  useEffect(() => {
    // Create a singleton audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      // Add to DOM to maintain reference
      audioRef.current.id = 'global-theme-audio';
      document.body.appendChild(audioRef.current);
      
      // Handle page visibility changes to prevent audio stopping
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && audioRef.current.paused) {
          audioRef.current.play().catch(err => {
            console.log('Audio play prevented by browser. User interaction required.');
          });
        }
      });
    }
    
    // Change audio source when theme changes
    if (currentTheme.audio && audioRef.current.src !== currentTheme.audio) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = currentTheme.audio;
      
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.log('Audio play prevented by browser. User interaction required.');
        });
      }
    }
    
    // Add a play button that users can click to start audio
    // (browsers require user interaction to play audio)
    const playButton = document.getElementById('theme-audio-play-button');
    if (!playButton) {
      const button = document.createElement('button');
      button.id = 'theme-audio-play-button';
      button.innerHTML = '🔊';
      button.style.position = 'fixed';
      button.style.bottom = '20px';
      button.style.right = '20px';
      button.style.zIndex = '9999';
      button.style.width = '40px';
      button.style.height = '40px';
      button.style.borderRadius = '50%';
      button.style.backgroundColor = 'rgba(0,0,0,0.5)';
      button.style.color = 'white';
      button.style.border = 'none';
      button.style.cursor = 'pointer';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.style.fontSize = '20px';
      
      button.addEventListener('click', () => {
        if (audioRef.current.paused) {
          audioRef.current.play();
          button.innerHTML = '🔊';
        } else {
          audioRef.current.pause();
          button.innerHTML = '🔇';
        }
      });
      
      document.body.appendChild(button);
    }
    
    return () => {
      // Don't remove the audio element on component unmount
      // to maintain continuous playback
    };
  }, [theme, currentTheme]);
  
  return null; // This component doesn't render anything visible
}