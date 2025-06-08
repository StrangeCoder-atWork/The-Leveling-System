'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DraggableTask from './DraggableTask';

export default function TimeGrid({ view, tasks, onTaskComplete, onCellClick, onTaskUpdate }) {
  const gridRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isTaskBeingDragged, setIsTaskBeingDragged] = useState(false);
  const autoScrollInterval = useRef(null);
  
  // Generate time slots based on view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  // Generate day headers based on view
  const generateDayHeaders = () => {
    const days = ['Today'];
    
    if (view === '3day' || view === 'week') {
      const today = new Date();
      for (let i = 1; i < (view === '3day' ? 3 : 7); i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        days.push(nextDay.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
      }
    }
    
    return days;
  };

  // Handle cell click to create a task
  const handleCellClick = (timeSlot, dayIndex) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const today = new Date();
    
    // Set the correct time
    today.setHours(hours, minutes, 0, 0);
    
    // Adjust the day if needed
    if (dayIndex > 0) {
      today.setDate(today.getDate() + dayIndex);
    }
    
    if (onCellClick) {
      onCellClick(today.toISOString());
    }
  };

  // Auto-scroll function for drag operations
  const startAutoScroll = (direction) => {
    if (autoScrollInterval.current) return;
    
    setIsAutoScrolling(true);
    autoScrollInterval.current = setInterval(() => {
      if (gridRef.current) {
        const scrollAmount = direction === 'up' ? -15 : 15;
        gridRef.current.scrollTop += scrollAmount;
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
      setIsAutoScrolling(false);
    }
  };

  // Handle mouse movement for auto-scrolling
  const handleMouseMove = (e) => {
    if (!gridRef.current || !isTaskBeingDragged) return;
    
    const gridRect = gridRef.current.getBoundingClientRect();
    const scrollThreshold = 60; // pixels from edge to trigger scroll
    
    if (e.clientY < gridRect.top + scrollThreshold) {
      startAutoScroll('up');
    } else if (e.clientY > gridRect.bottom - scrollThreshold) {
      startAutoScroll('down');
    } else {
      stopAutoScroll();
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopAutoScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopAutoScroll);
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  const timeSlots = generateTimeSlots();
  const dayHeaders = generateDayHeaders();

  return (
    // Update the container style to allow more scrolling space and ensure full height
    <div 
      className="relative overflow-x-auto overflow-y-auto h-full" 
      ref={gridRef}
      style={{ maxHeight: 'calc(100vh - 200px)' }} // Increased from 250px to 200px for more space
    > 
      <div className="min-w-[800px] min-h-[1440px]"> {/* Ensure full 24 hours (60px * 24) */}
        {/* Day Headers */}
        <div className="grid sticky top-0 z-20 bg-gray-900" style={{ 
          gridTemplateColumns: `80px repeat(${dayHeaders.length}, 1fr)`,
        }}>
          <div className="bg-gray-800 p-2 text-center text-white font-medium">Time</div>
          {dayHeaders.map((day, index) => (
            <div key={index} className="bg-gray-800 p-2 text-center text-white font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Time Grid */}
        <div className="relative">
          {timeSlots.map((time, timeIndex) => {
            // Add hour marker styling
            const isHourMarker = time.endsWith(':00');
            const isQuarterHour = time.endsWith(':15') || time.endsWith(':30') || time.endsWith(':45');
            return (
              <div 
                key={timeIndex} 
                className={`grid ${isHourMarker ? 'border-b border-gray-600' : isQuarterHour ? 'border-b border-gray-700/30' : ''}`}
                style={{ 
                  gridTemplateColumns: `80px repeat(${dayHeaders.length}, 1fr)`,
                  height: '60px', // 4x increased height
                }}
              >
                <div className={`p-1 text-center text-white/70 text-sm ${isHourMarker ? 'bg-gray-800 font-medium' : 'bg-gray-900'}`}>
                  {isHourMarker ? time : ''}
                </div>
                
                {dayHeaders.map((_, dayIndex) => (
                  <div 
                    key={dayIndex} 
                    className={`p-1 border-l border-gray-700 bg-gray-900/50 cursor-pointer hover:bg-gray-800/70 ${isHourMarker ? 'border-b border-gray-600' : ''}`}
                    onClick={() => handleCellClick(time, dayIndex)}
                    data-time={time}
                    data-day={dayIndex}
                  ></div>
                ))}
              </div>
            );
          })}
          
          {/* Tasks */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="relative w-full h-full">
              {tasks.map((task) => {
                // Calculate position based on task time
                const startTime = new Date(task.startTime);
                const endTime = task.endTime ? new Date(task.endTime) : new Date(startTime.getTime() + 15 * 60000); // Default 15 minutes
                
                // Skip tasks that don't belong to the current view
                const taskDate = new Date(startTime).setHours(0, 0, 0, 0);
                const today = new Date().setHours(0, 0, 0, 0);
                const dayDiff = Math.floor((taskDate - today) / (24 * 60 * 60 * 1000));
                
                if (view === 'day' && dayDiff !== 0) return null;
                if (view === '3day' && (dayDiff < 0 || dayDiff >= 3)) return null;
                if (view === 'week' && (dayDiff < 0 || dayDiff >= 7)) return null;
                
                // Calculate position
                const startHour = startTime.getHours() + startTime.getMinutes() / 60;
                const endHour = endTime.getHours() + endTime.getMinutes() / 60;
                const duration = endHour - startHour;
                
                // Calculate column based on day difference
                const column = dayDiff + 1; // +1 because first column is time labels
                
                // Calculate top position (15px per 15 minutes = 60px per hour)
                const top = startHour * 60;
                // Calculate height (15px per 15 minutes)
                const height = Math.max(60, duration * 60); // Minimum height of 60px
                
                // Calculate left position
                const gridWidth = gridRef.current ? gridRef.current.clientWidth - 80 : 0; // Total width minus time column
                const columnWidth = gridWidth / dayHeaders.length;
                const left = 80 + (columnWidth * (column - 1));
                
                return (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    style={{
                      position: 'absolute',
                      top: `${top}px`,
                      left: `${left}px`,
                      width: `${columnWidth}px`,
                      height: `${height}px`,
                      maxHeight: `${height}px`,
                      zIndex: 10,
                      pointerEvents: 'auto'
                    }}
                    onComplete={() => onTaskComplete(task.id)}
                    onUpdate={(updatedTask) => onTaskUpdate(updatedTask)}
                    gridView={view}
                    onDragStart={() => {
                      document.body.classList.add('dragging');
                      setIsTaskBeingDragged(true);
                    }}
                    onDragEnd={() => {
                      document.body.classList.remove('dragging');
                      setIsTaskBeingDragged(false);
                      stopAutoScroll();
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}