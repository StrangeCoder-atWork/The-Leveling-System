import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function AudioPlayerBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(config.volume || 0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const { theme } = useTheme();
  
  // Available audio tracks
  const audioTracks = [
    { id: 'focus', name: 'Focus Music', path: '/sounds/focus.mp3' },
    { id: 'ambient', name: 'Ambient Sounds', path: '/sounds/ambient.mp3' },
    { id: 'nature', name: 'Nature Sounds', path: '/sounds/nature.mp3' },
    { id: 'rain', name: 'Rain Sounds', path: '/sounds/rain.mp3' },
    { id: 'lofi', name: 'Lo-Fi Beats', path: '/sounds/lofi.mp3' },
  ];
  
  // Find current track
  const currentTrack = audioTracks.find(track => track.id === config.track) || audioTracks[0];
  
  useEffect(() => {
    // Initialize audio element
    if (audioRef.current) {
      audioRef.current.volume = volume;
      
      // Event listeners
      const audio = audioRef.current;
      
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    onConfigChange({...config, volume: newVolume});
  };
  
  const handleTrackChange = (e) => {
    const newTrack = e.target.value;
    onConfigChange({...config, track: newTrack});
    // Reset player state
    setIsPlaying(false);
    setCurrentTime(0);
    // After a short delay, play the new track if it was playing before
    setTimeout(() => {
      if (isPlaying && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };
  
  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };
  
  // Format time in MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <audio 
          ref={audioRef} 
          src={currentTrack.path}
          preload="metadata"
        />
        
        <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">{currentTrack.name}</h3>
            <div className="text-xs text-gray-400">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </div>
          </div>
          
          <div className="mb-4">
            <input 
              type="range" 
              min="0" 
              max={duration || 0} 
              value={currentTime} 
              onChange={handleSeek}
              className="w-full accent-purple-500 bg-gray-700 h-2 rounded-full"
              step="0.1"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-purple-600/80 hover:bg-purple-700/80 text-white rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </motion.button>
              
              <div className="flex items-center ml-4">
                <span className="text-gray-400 mr-2">🔈</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-purple-500 bg-gray-700 h-2 rounded-full"
                />
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowConfig(!showConfig)}
              className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚙️
            </motion.button>
          </div>
        </div>
        
        {showConfig && (
          <motion.div 
            className="w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Audio Track</label>
              <select 
                name="track" 
                value={config.track || 'focus'} 
                onChange={handleTrackChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              >
                {audioTracks.map(track => (
                  <option key={track.id} value={track.id}>{track.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Auto-play</label>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="autoplay" 
                  checked={config.autoplay || false} 
                  onChange={(e) => onConfigChange({...config, autoplay: e.target.checked})}
                  className="mr-2 accent-purple-500"
                />
                <label htmlFor="autoplay" className="text-gray-300">Play automatically when page loads</label>
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Loop</label>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="loop" 
                  checked={config.loop || false} 
                  onChange={(e) => {
                    onConfigChange({...config, loop: e.target.checked});
                    if (audioRef.current) {
                      audioRef.current.loop = e.target.checked;
                    }
                  }}
                  className="mr-2 accent-purple-500"
                />
                <label htmlFor="loop" className="text-gray-300">Repeat track</label>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}