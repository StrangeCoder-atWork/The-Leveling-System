'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function DraggableTask({ task, style, onComplete, onUpdate, gridView, onDragStart, onDragEnd }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [isResizing, setIsResizing] = useState(false);
  const initialHeight = useRef(0);
  const initialY = useRef(0);
  const taskRef = useRef(null);
  
  // Motion values for tracking position
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Determine priority color
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle drag end to update task position
  const handleDragEnd = (event, info) => {
    // Calculate new position based on drag delta
    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime || new Date(startTime.getTime() + 15 * 60000));
    
    // Convert y movement to time (60px = 1 hour)
    const hoursDelta = info.offset.y / 60;
    const newStartTime = new Date(startTime.getTime() + hoursDelta * 60 * 60 * 1000);
    const newEndTime = new Date(endTime.getTime() + hoursDelta * 60 * 60 * 1000);
    
    // Reset motion values
    x.set(0);
    y.set(0);
    
    // Update the task with new times
    if (onUpdate) {
      onUpdate({
        ...task,
        startTime: newStartTime.toISOString(),
        endTime: newEndTime.toISOString()
      });
    }
    
    if (onDragEnd) onDragEnd();
  };

  // Handle resize start
  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    initialHeight.current = parseInt(style.height);
    initialY.current = e.clientY;
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Handle resize
  const handleResize = (e) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - initialY.current;
    const newHeight = Math.max(60, initialHeight.current + deltaY); // Minimum height of 60px
    
    // Update task end time based on new height
    const startTime = new Date(task.startTime);
    const minutesAdded = (newHeight / 60) * 60; // Convert height to minutes (60px = 1 hour)
    const newEndTime = new Date(startTime.getTime() + minutesAdded * 60000);
    
    // Update the task with new end time and height
    if (onUpdate) {
      onUpdate({
        ...task,
        endTime: newEndTime.toISOString()
      });
    }
  };

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  };

  return (
    // Update the drag constraints to allow dragging further down
    <motion.div 
      ref={taskRef}
      className={`task-container rounded-md ${task.completed ? 'bg-gray-700/80' : 'bg-gray-800/90'} backdrop-blur-sm p-2 shadow-lg`}
      style={style}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 1440 }} // Reverted to original value
      dragElastic={0.05} // Reduced elasticity for better control
      dragMomentum={false} // Disable momentum for precise positioning
      dragTransition={{ 
        bounceStiffness: 800, 
        bounceDamping: 30,
        power: 0.6 // Smoother drag
      }}
      whileDrag={{ 
        zIndex: 50,
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        scale: 1.02 // Slight scale effect while dragging
      }}
      onDragStart={(e) => {
        if (onDragStart) onDragStart();
        // Add a subtle transition class
        document.body.classList.add('dragging');
      }}
      onDragEnd={handleDragEnd}
      x={x}
      y={y}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 350
      }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Task Header */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor()}`}></div>
              <h3 className={`font-medium truncate ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                {task.title}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onComplete(task.id);
            }}
            className={`ml-2 flex-shrink-0 w-5 h-5 rounded-full border ${task.completed ? 'bg-green-500 border-green-600' : 'bg-transparent border-gray-500'} flex items-center justify-center transition-colors`}
          >
            {task.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Task Details - Only show if there's enough height */}
        {style.height && parseInt(style.height) > 60 && (
          <div className="text-xs text-gray-300 mt-1 overflow-hidden flex-1">
            {task.description && <p className="mb-1 line-clamp-2">{task.description}</p>}
            <div className="flex justify-between mt-auto pt-1">
              <div>
                <span className="text-green-400">+{task.xp || 0} XP</span>
                {task.money > 0 && <span className="ml-2 text-yellow-400">+{task.money || 0} 🪙</span>}
              </div>
              <div className="text-gray-400">
                {formatTime(task.startTime)}
              </div>
            </div>
          </div>
        )}
        
        {/* Resize handle */}
        <div 
          className="resize-handle absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize bg-transparent hover:bg-blue-500/30"
          onMouseDown={handleResizeStart}
        />
      </div>
    </motion.div>
  );
}