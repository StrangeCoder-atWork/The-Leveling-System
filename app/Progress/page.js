'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HabitCard from '../components/HabitCard';
import ProgressGraph from '../components/ProgressGraph';
import AISuggestions from '../components/AISuggestions';
import { incrementStreak, addHistoryEntry, setStreaks, setHistory } from '../Store/slices/streaksSlice';
import { setNotification } from '../Store/slices/uiSlice';

export default function ProgressPage() {
  const dispatch = useDispatch();
  const streakData = useSelector(state => state.streaks.streaks);
  const streakHistory = useSelector(state => state.streaks.history);
  const isOnline = useSelector(state => state.user.isOnline);
  const [habits, setHabits] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [userLevel, setUserLevel] = useState(1);
  const [userTitle, setUserTitle] = useState('');

  // Calculate title based on level and consistency
  const calculateTitle = (level, consistency) => {
    if (level < 10) return 'Novice';
    if (level < 20 && consistency > 0.7) return 'Dedicated Apprentice';
    if (level < 30 && consistency > 0.8) return 'Master of Routine';
    return 'Legendary Achiever';
  };

  // Load streak data from server if online
  useEffect(() => {
    const loadStreakData = async () => {
      if (isOnline) {
        try {
          const response = await fetch('/api/progress/streaks');
          if (response.ok) {
            const data = await response.json();
            dispatch(setStreaks(data.streaks));
            dispatch(setHistory(data.history));
          }
        } catch (error) {
          console.error('Failed to load streak data:', error);
        }
      }
    };

    loadStreakData();
  }, [dispatch, isOnline]);

  const markActivityDone = async (activity) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update Redux store
    dispatch(incrementStreak(activity));
    dispatch(addHistoryEntry({ activity, date: today, completed: true }));
    
    // Show notification
    dispatch(setNotification({ 
      type: 'success', 
      message: `${activity} streak updated! ${streakData[activity] + 1} days` 
    }));

    // Update server if online
    if (isOnline) {
      try {
        await fetch('/api/progress/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            activity,
            date: today,
            completed: true
          })
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  return (
    <motion.div 
      className="p-6 bg-neutral-950 min-h-screen page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Streak Section */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {Object.entries(streakData).map(([activity, streak], index) => (
            <motion.div
              key={activity}
              className="bg-gradient-to-br from-purple-900 to-indigo-900 p-4 rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-xl font-bold text-white capitalize">{activity}</h3>
              <p className="text-2xl text-yellow-400">{streak} days</p>
              <motion.button
                onClick={() => markActivityDone(activity)}
                className="mt-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mark Done
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Title and Level */}
      <div className="text-center mb-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 rounded-xl">
        <h2 className="text-3xl font-bold text-white">Level {userLevel}</h2>
        <p className="text-xl text-yellow-400">{userTitle}</p>
      </div>

      {/* Habit Tracker */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Habit Tracker</h2>
        <div className="grid gap-4">
          {habits.map(habit => (
            <HabitCard key={habit.id} habit={habit} onUpdate={updateHabit} />
          ))}
          {/* <AddHabitForm onAdd={addHabit} /> */}
        </div>
      </div>

      {/* Progress Graph */}
      <div className="bg-neutral-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-white mb-4">Progress Graph</h2>
        <ProgressGraph data={graphData} />
      </div>

      {/* AI Suggestions */}
      <AISuggestions streakData={streakData} habits={habits} />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Offline Mode - Your progress will sync when you're back online
        </div>
      )}
    </motion.div>
  );
}