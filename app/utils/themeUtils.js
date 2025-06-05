'use client';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export function useThemeAudio() {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  useEffect(() => {
    // Stop any currently playing audio
    const existingAudio = document.getElementById('theme-audio');
    if (existingAudio) {
      existingAudio.pause();
      existingAudio.remove();
    }
    
    // Create and play new theme audio
    if (currentTheme.audio) {
      const audio = new Audio(currentTheme.audio);
      audio.id = 'theme-audio';
      audio.loop = true;
      audio.volume = 0.3;
      document.body.appendChild(audio);
      
      // Play audio (may require user interaction first due to browser policies)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Audio autoplay prevented. User interaction required.');
        });
      }
      
      return () => {
        audio.pause();
        audio.remove();
      };
    }
  }, [theme, currentTheme]);
  
  return currentTheme;
}

export function getThemeBackground(currentTheme) {
  return {
    backgroundImage: currentTheme.backgroundVideo 
      ? 'none' 
      : `url(${currentTheme.backgroundImage || '/bg3.jpg'})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };
}

export function ThemeBackgroundVideo({ currentTheme }) {
  if (!currentTheme.backgroundVideo) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-[-1]">
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute min-w-full min-h-full object-cover"
      >
        <source src={currentTheme.backgroundVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
}