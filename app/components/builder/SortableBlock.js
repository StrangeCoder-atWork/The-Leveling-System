import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import TimerBlock from './blocks/TimerBlock';
import AIChatBlock from './blocks/AIChatBlock';
import XPTrackerBlock from './blocks/XPTrackerBlock';
import ProgressMeterBlock from './blocks/ProgressMeterBlock';
import FlashcardsBlock from './blocks/FlashcardsBlock';
import AudioPlayerBlock from './blocks/AudioPlayerBlock';
import AnimationBlock from './blocks/AnimationBlock';

export default function SortableBlock({ id, block, onRemove, onConfigure }) {
  const [showConfig, setShowConfig] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case 'timer':
        return <TimerBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'aiChat':
        return <AIChatBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'xpTracker':
        return <XPTrackerBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'progressMeter':
        return <ProgressMeterBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'flashcards':
        return <FlashcardsBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'audioPlayer':
        return <AudioPlayerBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      case 'animation':
        return <AnimationBlock config={block.config} onConfigChange={(config) => onConfigure(config)} />;
      default:
        return <div className="p-4 text-white">Unknown block type: {block.type}</div>;
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-gray-800/70 border border-gray-700/50 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)' }}
    >
      <div className="bg-gray-900/50 p-2 flex justify-between items-center cursor-move" {...attributes} {...listeners}>
        <div className="flex items-center">
          <span className="text-white font-medium">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block
          </span>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className="p-1 text-gray-400 hover:text-white"
          >
            ⚙️
          </button>
          <button 
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      </div>
      
      {renderBlockContent()}
      
      {showConfig && (
        <div className="p-3 bg-gray-900/50 border-t border-gray-700/50">
          <h4 className="text-sm font-medium text-white mb-2">Block Configuration</h4>
          {/* Render configuration options based on block type */}
          {/* This would be implemented in each block component */}
        </div>
      )}
    </motion.div>
  );
}