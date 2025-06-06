import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useSelector } from 'react-redux';

export default function XPTrackerBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [currentXP, setCurrentXP] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const { theme } = useTheme();
  const { xp: userXP } = useSelector(state => state.user);
  
  // Use user's actual XP if available, otherwise use the tracked XP
  const displayXP = userXP || currentXP;
  
  // Calculate progress towards goal
  const progressPercentage = Math.min(100, Math.round((displayXP / config.goal) * 100));
  
  const handleAddXP = () => {
    // Increment by 10 or a custom amount
    const newXP = currentXP + 10;
    setCurrentXP(newXP);
    
    // Check if goal reached
    if (newXP >= config.goal && !showReward) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };
  
  const handleReset = () => {
    setCurrentXP(0);
    setShowReward(false);
  };
  
  const handleConfigChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
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
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-white">XP Progress</span>
            <span className="text-sm text-white">{displayXP}/{config.goal} XP</span>
          </div>
          
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <motion.button
            onClick={handleAddXP}
            className="flex-1 px-4 py-2 bg-purple-600/80 hover:bg-purple-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add XP
          </motion.button>
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
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.button>
        </div>
        
        {showReward && (
          <motion.div 
            className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <span className="text-yellow-300 font-bold">Goal Reached! 🎉</span>
            <p className="text-white">You earned {config.reward} XP reward!</p>
          </motion.div>
        )}
        
        {showConfig && (
          <motion.div 
            className="w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">XP Goal</label>
              <input 
                type="number" 
                name="goal" 
                value={config.goal} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                min="1"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">XP Reward</label>
              <input 
                type="number" 
                name="reward" 
                value={config.reward} 
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