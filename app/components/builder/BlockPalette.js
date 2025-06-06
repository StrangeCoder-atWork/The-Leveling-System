import React from 'react';
import { motion } from 'framer-motion';

export default function BlockPalette({ onAddBlock }) {
  const blockTypes = [
    { id: 'timer', name: 'Timer', icon: '⏳', description: 'Focus, countdown, or productivity timer' },
    { id: 'aiChat', name: 'AI Chat', icon: '🤖', description: 'Custom AI assistant for guidance' },
    { id: 'xpTracker', name: 'XP Tracker', icon: '📈', description: 'Track XP and rewards for tasks' },
    { id: 'progressMeter', name: 'Progress Meter', icon: '📊', description: 'Visual progress indicator' },
    { id: 'flashcards', name: 'Flashcards', icon: '📋', description: 'Spaced repetition learning cards' },
    { id: 'audioPlayer', name: 'Audio Player', icon: '🔊', description: 'Ambient sounds and music' },
    { id: 'animation', name: 'Animation', icon: '✨', description: 'Decorative animated elements' },
  ];

  return (
    <div className="bg-gray-900/80 rounded-lg p-4">
      <h3 className="text-xl font-bold text-white mb-4">Block Palette</h3>
      <div className="space-y-2">
        {blockTypes.map(block => (
          <motion.div
            key={block.id}
            className="bg-gray-800/50 hover:bg-gray-700/50 p-3 rounded cursor-pointer"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(124, 58, 237, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddBlock(block.id)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{block.icon}</span>
              <div>
                <h4 className="text-white font-medium">{block.name}</h4>
                <p className="text-gray-400 text-sm">{block.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}