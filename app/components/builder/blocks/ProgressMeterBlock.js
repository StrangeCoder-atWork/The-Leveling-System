import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function ProgressMeterBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const { theme } = useTheme();
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((config.current / config.max) * 100));
  
  const handleConfigChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    const newConfig = {
      ...config,
      [e.target.name]: value
    };
    onConfigChange(newConfig);
  };
  
  const getColorClass = () => {
    switch(config.color) {
      case 'blue': return 'from-blue-500 to-blue-700';
      case 'green': return 'from-green-500 to-green-700';
      case 'red': return 'from-red-500 to-red-700';
      case 'purple': return 'from-purple-500 to-purple-700';
      case 'yellow': return 'from-yellow-500 to-yellow-700';
      default: return 'from-blue-500 to-blue-700';
    }
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
          <h3 className="text-white text-lg font-medium mb-2">{config.title || 'Progress Meter'}</h3>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white">{config.current}</span>
              <span className="text-white">{config.max}</span>
            </div>
            
            <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full bg-gradient-to-r ${getColorClass()}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-white text-lg font-bold">{progressPercentage}%</span>
              {config.showLabel && (
                <p className="text-gray-400 text-sm mt-1">{config.label || 'Progress'}</p>
              )}
            </div>
            
            {config.showControls && (
              <div className="flex justify-center space-x-2 mt-3">
                <motion.button
                  onClick={() => {
                    if (config.current > 0) {
                      onConfigChange({
                        ...config,
                        current: config.current - 1
                      });
                    }
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={config.current <= 0}
                >
                  -
                </motion.button>
                <motion.button
                  onClick={() => {
                    if (config.current < config.max) {
                      onConfigChange({
                        ...config,
                        current: config.current + 1
                      });
                    }
                  }}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={config.current >= config.max}
                >
                  +
                </motion.button>
                <motion.button
                  onClick={() => {
                    onConfigChange({
                      ...config,
                      current: 0
                    });
                  }}
                  className="px-3 py-1 bg-red-700/80 hover:bg-red-600/80 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={config.title || ''} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                placeholder="Progress Meter"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Value</label>
                <input 
                  type="number" 
                  name="current" 
                  value={config.current} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  min="0"
                  max={config.max}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Maximum Value</label>
                <input 
                  type="number" 
                  name="max" 
                  value={config.max} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  min="1"
                />
              </div>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
              <select 
                name="color" 
                value={config.color || 'blue'} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="showLabel" 
                  name="showLabel" 
                  checked={config.showLabel} 
                  onChange={(e) => handleConfigChange({
                    target: {
                      name: 'showLabel',
                      value: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                <label htmlFor="showLabel" className="text-sm font-medium text-gray-300">Show Label</label>
              </div>
            </div>
            
            {config.showLabel && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Label Text</label>
                <input 
                  type="text" 
                  name="label" 
                  value={config.label || ''} 
                  onChange={handleConfigChange}
                  className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                  placeholder="Progress"
                />
              </div>
            )}
            
            <div className="mb-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="showControls" 
                  name="showControls" 
                  checked={config.showControls} 
                  onChange={(e) => handleConfigChange({
                    target: {
                      name: 'showControls',
                      value: e.target.checked
                    }
                  })}
                  className="mr-2"
                />
                <label htmlFor="showControls" className="text-sm font-medium text-gray-300">Show Controls</label>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}