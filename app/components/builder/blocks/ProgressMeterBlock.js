import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function ProgressMeterBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [progress, setProgress] = useState(config.initialValue || 0);
  const { theme } = useTheme();
  
  const handleIncrement = () => {
    const newValue = Math.min(100, progress + (config.incrementStep || 10));
    setProgress(newValue);
  };
  
  const handleDecrement = () => {
    const newValue = Math.max(0, progress - (config.incrementStep || 10));
    setProgress(newValue);
  };
  
  const handleReset = () => {
    setProgress(config.initialValue || 0);
  };
  
  const handleConfigChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    const newConfig = {
      ...config,
      [e.target.name]: value
    };
    onConfigChange(newConfig);
  };
  
  // Determine color based on progress
  const getProgressColor = () => {
    if (progress < 30) return 'from-red-500 to-orange-500';
    if (progress < 70) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-emerald-500';
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
            <span className="text-sm text-white">{config.title || 'Progress'}</span>
            <span className="text-sm text-white">{progress}%</span>
          </div>
          
          <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getProgressColor()}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          <motion.button
            onClick={handleIncrement}
            className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </motion.button>
          <motion.button
            onClick={handleDecrement}
            className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            -
          </motion.button>
          <motion.button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-600/80 hover:bg-gray-700/80 text-white rounded"
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
        
        {showConfig && (
          <motion.div 
            className="w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={config.title || 'Progress'} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Initial Value (%)</label>
              <input 
                type="number" 
                name="initialValue" 
                value={config.initialValue || 0} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                min="0"
                max="100"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Increment Step</label>
              <input 
                type="number" 
                name="incrementStep" 
                value={config.incrementStep || 10} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                min="1"
                max="100"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}