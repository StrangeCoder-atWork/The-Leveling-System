import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useSelector } from 'react-redux';

export default function XPTrackerBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const { theme } = useTheme();
  const { xp, level } = useSelector(state => state.user);
  
  // Calculate XP progress for current level
  const xpForCurrentLevel = level * 700;
  const xpForNextLevel = (level + 1) * 700;
  const currentLevelXP = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, Math.round((currentLevelXP / xpNeededForNextLevel) * 100));
  
  // Calculate progress towards goal
  const goalProgress = Math.min(100, Math.round((config.current / config.goal) * 100));
  
  const handleConfigChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    const newConfig = {
      ...config,
      [e.target.name]: value
    };
    onConfigChange(newConfig);
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h3 className="text-white text-lg font-medium mb-2">{config.title || 'XP Tracker'}</h3>
          
          {/* Level Progress */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-3 rounded-lg border border-indigo-500/20 mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white">Level {level}</span>
              <span className="text-sm text-white">{currentLevelXP}/{xpNeededForNextLevel} XP</span>
            </div>
            
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">Current</span>
              <span className="text-xs text-gray-400">Next Level: {level + 1}</span>
            </div>
          </div>
          
          {/* Goal Progress */}
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white">{config.goalTitle || 'Goal Progress'}</span>
              <span className="text-sm text-white">{config.current}/{config.goal} {config.unit || 'points'}</span>
            </div>
            
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">Reward: {config.reward} XP</span>
              <motion.button
                onClick={() => {
                  if (config.current >= config.goal) {
                    // In a real implementation, this would update the user's XP
                    alert(`Congratulations! You earned ${config.reward} XP!`);
                    // Reset progress
                    onConfigChange({
                      ...config,
                      current: 0
                    });
                  } else {
                    alert('Goal not yet reached!');
                  }
                }}
                className={`px-3 py-1 rounded text-xs ${config.current >= config.goal ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'}`}
                whileHover={config.current >= config.goal ? { scale: 1.05 } : {}}
                whileTap={config.current >= config.goal ? { scale: 0.95 } : {}}
              >
                Claim Reward
              </motion.button>
            </div>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={config.title || ''} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                placeholder="XP Tracker"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Goal Title</label>
              <input 
                type="text" 
                name="goalTitle" 
                value={config.goalTitle || ''} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                placeholder="Goal Progress"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Goal</label>
                <input 
                  type="number" 
                  name="goal" 
                  value={config.goal} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Progress</label>
                <input 
                  type="number" 
                  name="current" 
                  value={config.current} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  min="0"
                  max={config.goal}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Unit</label>
                <input 
                  type="text" 
                  name="unit" 
                  value={config.unit || ''} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  placeholder="points"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">XP Reward</label>
                <input 
                  type="number" 
                  name="reward" 
                  value={config.reward} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  min="1"
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}