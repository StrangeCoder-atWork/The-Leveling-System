import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SavePageModal({ onSave, onCancel, initialName = '', initialIcon = '📄' }) {
  const [pageName, setPageName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  
  const commonIcons = ['📄', '📝', '📊', '📈', '📚', '⏱️', '🎮', '🎯', '🧠', '💡', '🔥', '❄️', '🌊', '🌳', '🌙', '⚡', '🚀', '🎨', '🎭', '🎵'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pageName.trim()) {
      onSave(pageName, icon);
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gray-900 rounded-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Save Page</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Page Name</label>
            <input 
              type="text" 
              value={pageName} 
              onChange={(e) => setPageName(e.target.value)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded"
              placeholder="My Awesome Page"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">Page Icon</label>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {commonIcons.map((emoji, index) => (
                <motion.button
                  key={index}
                  type="button"
                  className={`text-2xl p-2 rounded ${icon === emoji ? 'bg-purple-700/50' : 'bg-gray-800 hover:bg-gray-700'}`}
                  onClick={() => setIcon(emoji)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}