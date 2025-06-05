'use client';
import { motion } from 'framer-motion';

export default function Timeline({ tasks, currentDay = 0 }) {
  // Get today's date and format it
  const today = new Date();
  today.setDate(today.getDate() + currentDay);
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Filter tasks for the current day
  const todaysTasks = Object.values(tasks).filter(task => {
    const taskDate = new Date(task.startTime);
    return taskDate.toDateString() === today.toDateString();
  });
  
  // Sort tasks by start time
  todaysTasks.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // Calculate completion percentage
  const completionPercentage = todaysTasks.length > 0
    ? Math.round((todaysTasks.filter(t => t.completed).length / todaysTasks.length) * 100)
    : 0;
  
  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4 mb-6 border border-indigo-500/20">
      <h3 className="text-xl font-semibold text-white mb-3">{formattedDate}</h3>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${completionPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {/* Task timeline */}
      <div className="relative pl-8 space-y-4">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
        
        {todaysTasks.length > 0 ? (
          todaysTasks.map((task, index) => {
            const startTime = new Date(task.startTime);
            const formattedTime = startTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            
            return (
              <motion.div 
                key={task.id}
                className={`relative ${task.completed ? 'opacity-70' : 'opacity-100'}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline dot */}
                <div className={`absolute left-[-24px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {task.completed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : null}
                </div>
                
                {/* Task card */}
                <div className={`bg-gradient-to-r ${task.completed ? 'from-green-900/30 to-green-800/30 border-green-500/30' : 'from-blue-900/30 to-indigo-800/30 border-blue-500/30'} p-3 rounded-lg border`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{formattedTime}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-4 text-gray-400">
            No tasks scheduled for this day
          </div>
        )}
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'bg-green-500/20 text-green-300';
    case 'medium': return 'bg-yellow-500/20 text-yellow-300';
    case 'hard': return 'bg-red-500/20 text-red-300';
    default: return 'bg-blue-500/20 text-blue-300';
  }
}