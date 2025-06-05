'use client';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const titles = [
  { id: 'novice', name: 'Novice', requirement: { level: 1 } },
  { id: 'apprentice', name: 'Apprentice', requirement: { level: 5 } },
  { id: 'adept', name: 'Adept', requirement: { level: 10 } },
  { id: 'expert', name: 'Expert', requirement: { level: 15 } },
  { id: 'master', name: 'Master', requirement: { level: 20 } },
  { id: 'grandmaster', name: 'Grandmaster', requirement: { level: 30 } },
  { id: 'legendary', name: 'Legendary', requirement: { level: 50 } },
  { id: 'mythical', name: 'Mythical', requirement: { level: 75 } },
  { id: 'godlike', name: 'Godlike', requirement: { level: 100 } },
  // Task-based titles
  { id: 'taskmaster', name: 'Taskmaster', requirement: { completedTasks: 50 } },
  { id: 'organizer', name: 'Master Organizer', requirement: { completedTasks: 100 } },
  { id: 'achiever', name: 'Ultimate Achiever', requirement: { completedTasks: 500 } },
  // Flashcard-based titles
  { id: 'scholar', name: 'Scholar', requirement: { flashcards: 20 } },
  { id: 'sage', name: 'Sage', requirement: { flashcards: 100 } },
  { id: 'enlightened', name: 'Enlightened', requirement: { flashcards: 300 } },
];

export default function UserTitle({ selectedTitle, onSelectTitle }) {
  const { level, xp } = useSelector(state => state.user);
  const tasks = useSelector(state => state.tasks);
  const flashcards = useSelector(state => state.flashcards);
  
  const [availableTitles, setAvailableTitles] = useState([]);
  
  useEffect(() => {
    // Calculate completed tasks
    const completedTasks = Object.values(tasks).filter(task => task.completed).length;
    
    // Calculate flashcards count
    const flashcardsCount = Object.values(flashcards).length;
    
    // Filter available titles based on requirements
    const available = titles.filter(title => {
      if (title.requirement.level && level >= title.requirement.level) return true;
      if (title.requirement.completedTasks && completedTasks >= title.requirement.completedTasks) return true;
      if (title.requirement.flashcards && flashcardsCount >= title.requirement.flashcards) return true;
      return false;
    });
    
    setAvailableTitles(available);
  }, [level, tasks, flashcards]);
  
  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-4 rounded-xl border border-indigo-500/20 mb-4">
      <h3 className="text-xl font-semibold text-white mb-3">Your Titles</h3>
      
      {availableTitles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableTitles.map(title => (
            <button
              key={title.id}
              onClick={() => onSelectTitle(title.id)}
              className={`px-3 py-1 rounded-full text-sm ${selectedTitle === title.id 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              {title.name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No titles available yet. Level up to earn titles!</p>
      )}
    </div>
  );
}