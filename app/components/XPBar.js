'use client';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function XPBar() {
  const { xp, level } = useSelector(state => state.user);
  
  // Calculate XP progress for current level
  const xpForCurrentLevel = level * 700;
  const xpForNextLevel = (level + 1) * 700;
  const currentLevelXP = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = Math.min(100, Math.round((currentLevelXP / xpNeededForNextLevel) * 100));
  
  return (
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
  );
}