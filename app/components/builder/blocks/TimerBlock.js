import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function TimerBlock({ config, onConfigChange }) {
  const [time, setTime] = useState(config.duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const { theme } = useTheme();
  
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Trigger completion event/reward here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, time]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(config.duration * 60);
  };
  
  const handleConfigChange = (e) => {
    const newConfig = {
      ...config,
      [e.target.name]: e.target.name === 'duration' ? parseInt(e.target.value) : e.target.value
    };
    onConfigChange(newConfig);
    
    // Update timer if duration changes
    if (e.target.name === 'duration' && !isRunning) {
      setTime(parseInt(e.target.value) * 60);
    }
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className={`text-4xl font-bold mb-4 ${isRunning ? 'text-green-400' : 'text-white'}`}
          animate={{ scale: isRunning ? [1, 1.05, 1] : 1 }}
          transition={{ repeat: isRunning ? Infinity : 0, duration: 2 }}
        >
          {formatTime(time)}
        </motion.div>
        
        <div className="flex space-x-2">
          {!isRunning ? (
            <motion.button
              onClick={handleStart}
              className="px-4 py-2 bg-green-600/80 hover:bg-green-700/80 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start
            </motion.button>
          ) : (
            <motion.button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-600/80 hover:bg-yellow-700/80 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pause
            </motion.button>
          )}
          
          <motion.button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
          
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Configure
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Timer Duration (minutes)</label>
              <input 
                type="number" 
                name="duration" 
                value={config.duration} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                min="1"
                max="120"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Timer Type</label>
              <select 
                name="type" 
                value={config.type} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              >
                <option value="focus">Focus</option>
                <option value="countdown">Countdown</option>
                <option value="productivity">Productivity</option>
              </select>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">XP Reward on Completion</label>
              <input 
                type="number" 
                name="reward" 
                value={config.reward || 0} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                min="0"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}