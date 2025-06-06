import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function AudioPlayerBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(config.volume || 0.5);
  const audioRef = useRef(null);
  const { theme } = useTheme();
  
  const audioSources = {
    focus: '/sounds/focus.mp3',
    relax: '/sounds/relax.mp3',
    nature: '/sounds/nature.mp3',
    rain: '/sounds/rain.mp3',
    fire: '/sounds/fire.mp3',
    custom: config.customUrl || ''
  };
  
  useEffect(() => {
    // Update audio source when config changes
    if (audioRef.current) {
      const source = audioSources[config.playlist] || '';
      if (audioRef.current.src !== source && source) {
        audioRef.current.src = source;
        audioRef.current.load();
      }
      
      // Update volume
      audioRef.current.volume = config.volume;
      setVolume(config.volume);
    }
  }, [config.playlist, config.customUrl, config.volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (config.loop) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Error playing audio:', err));
        setIsPlaying(true);
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [config.loop]);
  
  const handleConfigChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : 
                 e.target.type === 'range' ? parseFloat(e.target.value) : 
                 e.target.value;
    
    const newConfig = {
      ...config,
      [e.target.name]: value
    };
    onConfigChange(newConfig);
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Error playing audio:', err));
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    
    const newConfig = {
      ...config,
      volume: newVolume
    };
    onConfigChange(newConfig);
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <audio ref={audioRef} src={audioSources[config.playlist]} preload="metadata" />
        
        <div className="mb-4">
          <h3 className="text-white text-lg font-medium mb-2">{config.title || 'Audio Player'}</h3>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-center mb-4">
              <motion.button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-purple-600/80 hover:bg-purple-700/80 text-white rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </motion.button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                value={currentTime} 
                onChange={handleSeek}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #9333ea ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%)`
                }}
              />
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414-9.9m-2.828 9.9a9 9 0 010-12.728" />
              </svg>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume} 
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #9333ea ${volume * 100}%, #374151 ${volume * 100}%)`
                }}
              />
            </div>
            
            {config.showPlaylistName && (
              <div className="mt-3 text-center">
                <span className="text-gray-400 text-sm">
                  {config.playlist === 'custom' ? 'Custom Track' : config.playlist.charAt(0).toUpperCase() + config.playlist.slice(1)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end">
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showConfig ? 'Hide Settings' : 'Settings'}
          </motion.button>
        </div>
        
        {showConfig && (
          <motion.div 
            className="mt-4 w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Audio Track</label>
              <select 
                name="playlist" 
                value={config.playlist} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              >
                <option value="focus">Focus Ambient</option>
                <option value="meditation">Meditation</option>
                <option value="nature">Nature Sounds</option>
                <option value="lofi">Lo-Fi Beats</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>
            
            {config.playlist === 'custom' && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Custom Audio URL</label>
                <input 
                  type="text" 
                  name="customUrl" 
                  value={config.customUrl || ''} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  placeholder="https://example.com/audio.mp3"
                />
              </div>
            )}
            
            <div className="mb-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="loop" 
                  checked={config.loop} 
                  onChange={handleConfigChange}
                  className="bg-gray-700/50 text-purple-600 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Loop Audio</span>
              </label>
            </div>
            
            <div className="mb-2">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  name="autoplay" 
                  checked={config.autoplay} 
                  onChange={handleConfigChange}
                  className="bg-gray-700/50 text-purple-600 rounded"
                />
                <span className="text-sm font-medium text-gray-300">Autoplay</span>
              </label>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}