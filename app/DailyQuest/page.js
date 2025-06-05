'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import TimeGrid from '../components/TimeGrid';
import TaskCreationPanel from '../components/TaskCreationPanel';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, updateTask, setTasks } from '../Store/slices/tasksSlice';

// Dynamically import components that aren't needed immediately
const XPCalculator = dynamic(() => import('../components/XPCalculator'), {
  loading: () => <div className="p-4">Loading calculator...</div>,
  ssr: false, // Disable server-side rendering if not needed
});

const AISuggestions = dynamic(() => import('../components/AISuggestions'), {
  loading: () => <div className="p-4">Loading suggestions...</div>,
  ssr: false,
});
import './dailyQuest.css';

// Debounce function definition
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Theme intro animations using framer-motion
const themeIntroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -50,
    transition: { 
      duration: 0.5, 
      ease: "easeIn" 
    } 
  }
};

// Remove the theme intro animations (around line 30-45)
// Delete this entire themeIntroVariants block

export default function DailyQuestPage() {
  const dispatch = useDispatch();
  const reduxTasks = useSelector(state => state.tasks.tasks);
  
  const calculateStats = useCallback((taskList) => {
    const completed = taskList.filter(task => task.completed).length;
    const xp = taskList.reduce((sum, task) => sum + (task.completed ? (task.xp || 0) : 0), 0);
    const money = taskList.reduce((sum, task) => sum + (task.completed ? (task.money || 0) : 0), 0);
    
    return { completed, xp, money };
  }, []);
  
  const [view, setView] = useState('day'); // 'day', '3day', 'week'
  const [tasks, setTasks] = useState([]);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const { theme, changeTheme } = useTheme();
  const current = themes[theme];
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [totalMoney, setTotalMoney] = useState(0);
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
  const [habits, setHabits] = useState([]);
  // Remove these state variables
  // const [showThemeIntro, setShowThemeIntro] = useState(false);
  // const [previousTheme, setPreviousTheme] = useState(null);
  
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Your filtering logic here
      return true; // Replace with actual filtering
    });
  }, [tasks]);
  
  useEffect(() => {
    // Load tasks from Redux store first, then fallback to localStorage
    const userId = localStorage.getItem('currentUserId');
    const tasksArray = Object.values(reduxTasks);
    
    if (tasksArray.length > 0) {
      setTasks(tasksArray);
    } else {
      // Fallback to localStorage if Redux store is empty
      const tasksData = JSON.parse(localStorage.getItem(`tasksState_${userId}`) || '{}');
      const localTasksArray = Array.isArray(tasksData.tasks) ? tasksData.tasks : [];
      setTasks(localTasksArray);
      
      // Also update Redux store with localStorage data
      dispatch(setTasks(localTasksArray.reduce((obj, task) => {
        obj[task.id] = task;
        return obj;
      }, {})));
    }
    
    // Calculate stats
    const statsTasksArray = tasksArray.length > 0 ? tasksArray : [];
    const { completed, xp, money } = calculateStats(statsTasksArray);
    setCompletedTasks(completed);
    setTotalXP(xp);
    setTotalMoney(money);

    // Load streak data for AI suggestions
    const streakData = JSON.parse(localStorage.getItem(`streakData_${userId}`) || '{ "currentStreak": 0, "longestStreak": 0 }');
    setStreakData(streakData);

    // Load habits for AI suggestions
    const habits = JSON.parse(localStorage.getItem(`habits_${userId}`) || '[]');
    setHabits(habits);
  }, [calculateStats, dispatch, reduxTasks]);

  // Track theme changes to show intro
  

  const handleTaskCreate = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    
    // Save to localStorage and Redux
    const userId = localStorage.getItem('currentUserId');
    localStorage.setItem(`tasksState_${userId}`, JSON.stringify({ tasks: updatedTasks }));
    dispatch(addTask(newTask));
    
    // Update database with XP and money values
    if (userId) {
      fetch('/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          task: {
            ...newTask,
            xp: Number(newTask.xp) || 0,
            money: Number(newTask.money) || 0
          }
        })
      })
      .catch(error => console.error('Error saving task to database:', error));
    }
    
    setShowTaskPanel(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    
    // Use the debounced save for localStorage
    const userId = localStorage.getItem('currentUserId');
    debouncedSave(userId, updatedTasks);
    
    // Update Redux immediately
    dispatch(updateTask(updatedTask));
    
    // Update database with XP and money values
    if (userId) {
      fetch('/api/tasks/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          task: {
            ...updatedTask,
            xp: Number(updatedTask.xp) || 0,
            money: Number(updatedTask.money) || 0
          }
        })
      })
      .catch(error => console.error('Error updating task in database:', error));
    }
  };

  const handleTaskComplete = (taskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    const updatedTasks = tasks.map(task => task.id === taskId ? updatedTask : task);
    
    setTasks(updatedTasks);
    
    // Recalculate stats
    const { completed, xp, money } = calculateStats(updatedTasks);
    setCompletedTasks(completed);
    setTotalXP(xp);
    setTotalMoney(money);
    
    // Save to localStorage AND update Redux store
    const userId = localStorage.getItem('currentUserId');
    localStorage.setItem(`tasksState_${userId}`, JSON.stringify({ tasks: updatedTasks }));
    dispatch(updateTask(updatedTask));
  };

  // Handle grid cell click to create a task
  const handleGridCellClick = (time) => {
    setSelectedTime(time);
    setShowTaskPanel(true);
  };

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce((userId, data) => {
      localStorage.setItem(`tasksState_${userId}`, JSON.stringify({ tasks: data }));
    }, 300),
    []
  );
  
  // Get theme story content for intro
  const getThemeIntroContent = () => {
    if (!current) return { title: '', description: '', story: '' };
    
    const themeKey = theme;
    const formattedTitle = themeKey.replace('_', ' ');
    
    return {
      title: formattedTitle,
      description: current.description || '',
      story: current.story || ''
    };
  };
  
  const themeContent = getThemeIntroContent();
  
  return (
    <div 
      className={`min-h-screen pt-16 ${current.main}`}
      style={{
        backgroundImage: current.backgroundImage ? `url(${current.backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {current.vid && (
        <video
          src={current.vid}
          autoPlay
          loop
          muted
          className={`${current.mythical || ''} absolute top-0 left-0 min-h-screen min-w-screen object-cover z-0`}
        >
        </video>
      )}
      
      {/* Remove the Theme Intro Animation section (around line 270-320) */}
      {/* Delete the entire AnimatePresence block with showThemeIntro */}
      
      {/* Add min-h-screen to this div */}
      <div className="min-h-screen bg-black/50 backdrop-blur-sm p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Daily Quests</h1>
            <div className="flex space-x-2">
              <button 
                onClick={() => setView('day')}
                className={`px-4 py-2 rounded-md ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}
              >
                Day
              </button>
              <button 
                onClick={() => setView('3day')}
                className={`px-4 py-2 rounded-md ${view === '3day' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}
              >
                3 Days
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white'}`}
              >
                Week
              </button>
            </div>
          </div>
          
          {/* Stats Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-white/70 mb-1">Completed Tasks</p>
                <p className="text-2xl font-bold text-white">{completedTasks} / {tasks.length}</p>
                
                {/* Level indicator with filling animation */}
                <div className="w-full h-3 bg-white/20 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    className="h-full level-indicator"
                    initial={{ width: 0 }}
                    animate={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 mb-1">XP Gained</p>
                <p className="text-2xl font-bold text-green-400">+{totalXP} XP</p>
              </div>
              
              <div className="text-center">
                <p className="text-white/70 mb-1">Money Earned</p>
                <p className="text-2xl font-bold text-yellow-400">+{totalMoney} 🪙</p>
              </div>
            </div>
            
            {/* XP Calculator Button */}
            <div className="mt-4 text-center flex justify-center gap-4">
              <button 
                onClick={() => {
                  setSelectedTime(new Date().toISOString());
                  setShowTaskPanel(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Add New Task
              </button>
              <button
                onClick={() => {
                  // Find and click the XP calculator button
                  const xpCalculator = document.getElementById('xp-calculator');
                  if (xpCalculator) xpCalculator.click();
                }}
                className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-md text-white font-medium hover:from-yellow-700 hover:to-yellow-600 transition-all duration-300"
              >
                Calculate XP
              </button>
            </div>
            
            {/* XP Calculator (visible but with opacity 0) */}
            <div className="mt-2">
              <XPCalculator 
                id="xp-calculator" 
                onCalculate={(rewards) => {
                  if (rewards) {
                    setTotalXP(prev => prev + (rewards.xp || 0));
                    setTotalMoney(prev => prev + (rewards.money || 0));
                  }
                }} 
              />
            </div>
          </div>
          
          {/* Time Grid with Tasks */}
          <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden h-[calc(100vh-300px)]">
            <TimeGrid 
              view={view} 
              tasks={tasks} 
              onTaskComplete={handleTaskComplete}
              onCellClick={handleGridCellClick}
              onTaskUpdate={handleTaskUpdate}
            />
          </div>

          {/* AI Suggestions Panel */}
          <AISuggestions streakData={streakData} habits={habits} />
        </div>
      </div>
      
      {/* Task Creation Panel */}
      {showTaskPanel && (
        <motion.div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900 rounded-lg w-full max-w-md p-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Create New Task</h2>
            <TaskCreationPanel 
              time={selectedTime}
              onTaskCreate={handleTaskCreate} 
              onCancel={() => setShowTaskPanel(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Remove the getThemeIntroContent function (around line 230-240)
// Delete the entire getThemeIntroContent function and themeContent constant

