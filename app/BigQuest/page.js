"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAgentPersonalized } from '@/lib/aiAgent';
import { getUserProfile } from '@/lib/aiAgent';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function BigQuestPage() {
  const [quests, setQuests] = useState([]);
  const [questType, setQuestType] = useState('weekly'); // 'weekly', 'monthly', 'custom'
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    // Load quests from localStorage
    const savedQuests = JSON.parse(localStorage.getItem('bigQuests') || '[]');
    setQuests(savedQuests);
  }, []);

  const createQuest = async (questData) => {
    // Get user profile
    const userProfile = getUserProfile();
    
    try {
      // Get AI-calculated rewards
      const aiResponse = await askAgentPersonalized('BigQuest', {
        ...userProfile,
        questData
      });
  
      const newQuest = {
        id: Date.now().toString(),
        ...questData,
        rewards: aiResponse.rewards || { xp: 100, money: 50, penalty: 25 },
        progress: Array(questData.duration).fill(false), // Array of completion status for each day
        createdAt: new Date().toISOString()
      };
  
      const updatedQuests = [...quests, newQuest];
      setQuests(updatedQuests);
      localStorage.setItem('bigQuests', JSON.stringify(updatedQuests));
    } catch (error) {
      console.error('Error creating quest:', error);
      // Create quest with default rewards if AI fails
      const newQuest = {
        id: Date.now().toString(),
        ...questData,
        rewards: { xp: 100, money: 50, penalty: 25 },
        progress: Array(questData.duration).fill(false),
        createdAt: new Date().toISOString()
      };
      
      const updatedQuests = [...quests, newQuest];
      setQuests(updatedQuests);
      localStorage.setItem('bigQuests', JSON.stringify(updatedQuests));
    }
  };

  const markDayComplete = (questId, dayIndex) => {
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user has already marked a day today for this quest
    const lastMarkedDate = localStorage.getItem(`lastMarked_${questId}`);
    
    if (lastMarkedDate === today) {
      alert('You can only mark one day as complete per day for each quest!');
      return;
    }
    
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId) {
        const newProgress = [...quest.progress];
        // Only allow marking as complete, not uncompleting
        if (!newProgress[dayIndex]) {
          newProgress[dayIndex] = true;
          
          // Store the date when this was marked
          localStorage.setItem(`lastMarked_${questId}`, today);
          
          // Award XP and money to the user
          const userState = JSON.parse(localStorage.getItem('userState_' + localStorage.getItem('currentUserId')) || '{}');
          if (userState) {
            userState.xp = (userState.xp || 0) + (quest.rewards.xp || 0);
            userState.money = (userState.money || 0) + (quest.rewards.money || 0);
            localStorage.setItem('userState_' + localStorage.getItem('currentUserId'), JSON.stringify(userState));
          }
        }
        return { ...quest, progress: newProgress };
      }
      return quest;
    });
    
    setQuests(updatedQuests);
    localStorage.setItem('bigQuests', JSON.stringify(updatedQuests));
  };

  const deleteQuest = (questId) => {
    const updatedQuests = quests.filter(quest => quest.id !== questId);
    setQuests(updatedQuests);
    localStorage.setItem('bigQuests', JSON.stringify(updatedQuests));
  };

  return (
    <div 
      className="min-h-screen p-6"
      style={{
        backgroundImage: `url(${currentTheme.backgroundImage || '/bg3.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm p-6">
        <h1 className="text-3xl font-bold text-white mb-8">🏆 Big Quests</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <QuestCreationForm onSubmit={createQuest} questType={questType} setQuestType={setQuestType} />
          </div>
          
          <div className="lg:col-span-2">
            <QuestList quests={quests} onMarkDay={markDayComplete} onDelete={deleteQuest} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestCreationForm({ onSubmit, questType, setQuestType }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 7,
    difficulty: 'medium' // 'easy', 'medium', 'hard'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;
    
    onSubmit({
      ...formData,
      type: questType,
      startDate: new Date().toISOString()
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      duration: questType === 'weekly' ? 7 : questType === 'monthly' ? 30 : 14,
      difficulty: 'medium'
    });
  };

  useEffect(() => {
    // Update duration based on quest type
    setFormData(prev => ({
      ...prev,
      duration: questType === 'weekly' ? 7 : questType === 'monthly' ? 30 : prev.duration
    }));
  }, [questType]);

  return (
    <motion.div 
      className="bg-gray-800 rounded-xl p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-4">Create New Quest</h2>
      
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${questType === 'weekly' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setQuestType('weekly')}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 rounded ${questType === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setQuestType('monthly')}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded ${questType === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setQuestType('custom')}
        >
          Custom
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Quest Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            placeholder="Complete Physics Assignment"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded h-24"
            placeholder="Describe your quest and what you hope to achieve..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 mb-2">Duration (days)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              min="1"
              max="90"
              disabled={questType !== 'custom'}
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        
        <motion.button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Create Quest
        </motion.button>
      </form>
    </motion.div>
  );
}

function QuestList({ quests, onMarkDay, onDelete }) {
  if (quests.length === 0) {
    return (
      <motion.div 
        className="bg-gray-800 rounded-xl p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl text-gray-400">No quests yet. Create your first big quest!</h3>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Quests</h2>
      
      <AnimatePresence>
        {quests.map(quest => (
          <motion.div 
            key={quest.id}
            className="bg-gray-800 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                  <p className="text-gray-400 mt-1">{quest.description}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded text-sm ${quest.difficulty === 'easy' ? 'bg-green-900 text-green-300' : quest.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
                    {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
                  </span>
                  
                  <button
                    onClick={() => onDelete(quest.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-400">
                    {quest.progress.filter(Boolean).length} / {quest.progress.length} days
                  </span>
                </div>
                
                <div className="bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full"
                    style={{ width: `${(quest.progress.filter(Boolean).length / quest.progress.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-gray-300 mb-2">Daily Tracking</h4>
                <div className="flex flex-wrap gap-2">
                  {quest.progress.map((completed, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-md flex items-center justify-center ${completed ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'}`}
                      onClick={() => onMarkDay(quest.id, index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between">
                <div>
                  <span className="text-gray-400">Rewards:</span>
                  <div className="flex space-x-4 mt-1">
                    <span className="text-yellow-400">{quest.rewards.xp} XP</span>
                    <span className="text-green-400">{quest.rewards.money} 💰</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400">Penalty:</span>
                  <div className="mt-1">
                    <span className="text-red-400">{quest.rewards.penalty} 💰</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

