"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import FlashCardGrid from '../components/FlashCardGrid';
import FlashCardCreatePanel from '../components/FlashCardCreatePanel';
import AIGeneratorPanel from '../components/AIGeneratorPanel';
import { updateUserDataLocallyAndSync } from '../utils/syncUtils';
import { askAgentPersonalized, getUserProfile } from '@/lib/aiAgent';
import GroupSelector from '../components/GroupSelector';

import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';
import { setFlashcards } from '../Store/slices/flashcardsSlice';

export default function FlashCardPage() {
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const theme = useTheme();
  const current = themes[theme['theme']];
  const dispatch = useDispatch();
  const flashcards = useSelector(state => state.flashcards.flashcards);

  // Load user profile and flashcards
  useEffect(() => {
    setUserProfile(getUserProfile());
    
    // Load flashcards from localStorage
    const userId = localStorage.getItem('currentUserId');
    const flashcardsData = JSON.parse(localStorage.getItem(`flashcardsState_${userId}`) || '{}');
    
    if (flashcardsData.flashcards) {
      dispatch(setFlashcards(flashcardsData.flashcards));
      
      // Extract groups and subgroups
      const groupsMap = {};
      const subgroupsMap = {};
      
      Object.values(flashcardsData.flashcards).forEach(card => {
        if (card.groupId) {
          const [groupId, subgroupId] = card.groupId.split('/');
          
          if (!groupsMap[groupId]) {
            groupsMap[groupId] = { id: groupId, name: groupId };
          }
          
          if (subgroupId) {
            if (!subgroupsMap[groupId]) {
              subgroupsMap[groupId] = {};
            }
            if (!subgroupsMap[groupId][subgroupId]) {
              subgroupsMap[groupId][subgroupId] = { id: subgroupId, name: subgroupId };
            }
          }
        }
      });
      
      setGroups(Object.values(groupsMap));
      setSubgroups(subgroupsMap);
    }
    
    // Check if there are cards due for review
    const now = new Date();
    const allCards = flashcardsData.flashcards || {};
    const dueCards = Object.values(allCards).filter(card => {
      if (!card.nextReview) return false;
      return new Date(card.nextReview) <= now;
    });
    
    setShowReviewButton(dueCards.length > 0);
  }, [dispatch]);

  // AI Generation
  const generateCards = async (topic) => {
    try {
      const aiResponse = await askAgentPersonalized('FlashCard', {
        ...userProfile,
        topic
      });
      
      if (aiResponse.cards && Array.isArray(aiResponse.cards)) {
        const newCards = {};
        const groupId = selectedGroup || 'AI_Generated';
        const subgroupId = selectedSubgroup || topic.replace(/\s+/g, '_');
        const fullGroupId = selectedSubgroup ? `${groupId}/${subgroupId}` : groupId;
        
        // Add group if it doesn't exist
        if (!groups.find(g => g.id === groupId)) {
          setGroups([...groups, { id: groupId, name: groupId }]);
        }
        
        // Add subgroup if it doesn't exist
        if (subgroupId && (!subgroups[groupId] || !subgroups[groupId][subgroupId])) {
          const updatedSubgroups = { ...subgroups };
          if (!updatedSubgroups[groupId]) {
            updatedSubgroups[groupId] = {};
          }
          updatedSubgroups[groupId][subgroupId] = { id: subgroupId, name: subgroupId };
          setSubgroups(updatedSubgroups);
        }
        
        aiResponse.cards.forEach(card => {
          const id = `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          newCards[id] = {
            id,
            question: card.question,
            answer: card.answer,
            groupId: fullGroupId,
            createdAt: new Date().toISOString(),
            lastReviewed: null,
            nextReview: new Date().toISOString(), // Review immediately
            difficulty: 'medium',
            reviewCount: 0
          };
        });
        
        // Update Redux and localStorage
        const updatedFlashcards = { ...flashcards, ...newCards };
        dispatch(setFlashcards(updatedFlashcards));
        
        const userId = localStorage.getItem('currentUserId');
        localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify({ flashcards: updatedFlashcards }));
        
        setShowAIPanel(false);
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
    }
  };

  // Group Management
  const createGroup = (name) => {
    const id = name.replace(/\s+/g, '_');
    if (!groups.find(g => g.id === id)) {
      setGroups([...groups, { id, name }]);
      setSelectedGroup(id);
      setSelectedSubgroup(null);
    }
  };
  
  // Subgroup Management
  const createSubgroup = (name) => {
    if (!selectedGroup) return;
    
    const id = name.replace(/\s+/g, '_');
    const updatedSubgroups = { ...subgroups };
    
    if (!updatedSubgroups[selectedGroup]) {
      updatedSubgroups[selectedGroup] = {};
    }
    
    if (!updatedSubgroups[selectedGroup][id]) {
      updatedSubgroups[selectedGroup][id] = { id, name };
      setSubgroups(updatedSubgroups);
      setSelectedSubgroup(id);
    }
  };
  
  // Filter cards based on selected group/subgroup
  const filteredCards = Object.values(flashcards || {}).filter(card => {
    if (!selectedGroup) return true;
    
    if (selectedSubgroup) {
      return card.groupId === `${selectedGroup}/${selectedSubgroup}`;
    }
    
    // Show all cards in this group (including those in subgroups)
    return card.groupId === selectedGroup || card.groupId?.startsWith(`${selectedGroup}/`);
  });

  return (
    <div 
      className={`min-h-screen pt-16 ${current.main}`}
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
      
      <div className="min-h-screen bg-black/50 backdrop-blur-sm p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">📚 Flashcards</h1>
          
          <div className="flex gap-2">
            {showReviewButton && (
              <motion.a
                href="/FlashCard/review"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Review Due Cards</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-emerald-700 text-xs font-bold">!</span>
              </motion.a>
            )}
            
            <motion.button
              onClick={() => {
                setShowCreatePanel(true);
                setShowAIPanel(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Card
            </motion.button>
            
            <motion.button
              onClick={() => {
                setShowAIPanel(true);
                setShowCreatePanel(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-black rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              AI Generate
            </motion.button>
          </div>
        </div>
        
        <AnimatePresence>
          {showCreatePanel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <FlashCardCreatePanel 
                onClose={() => setShowCreatePanel(false)} 
                selectedGroup={selectedGroup}
                selectedSubgroup={selectedSubgroup}
              />
            </motion.div>
          )}
          
          {showAIPanel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <AIGeneratorPanel onGenerate={generateCards} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-4 rounded-xl w-full mb-4">
              <h3 className="text-xl font-bold text-white mb-3">Groups</h3>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedGroup(null);
                    setSelectedSubgroup(null);
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${!selectedGroup 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                >
                  All Cards
                </button>
                
                {groups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group.id);
                      setSelectedSubgroup(null);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${selectedGroup === group.id && !selectedSubgroup 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  id="newGroup"
                  placeholder="New group name..."
                  className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newGroup');
                    if (input.value.trim()) {
                      createGroup(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
                >
                  Add
                </button>
              </div>
            </div>
            
            {selectedGroup && (
              <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 p-4 rounded-xl w-full">
                <h3 className="text-xl font-bold text-white mb-3">Subgroups</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => setSelectedSubgroup(null)}
                    className={`px-3 py-1 rounded-full text-sm ${!selectedSubgroup 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                  >
                    All in {groups.find(g => g.id === selectedGroup)?.name}
                  </button>
                  
                  {subgroups[selectedGroup] && Object.values(subgroups[selectedGroup]).map(subgroup => (
                    <button
                      key={subgroup.id}
                      onClick={() => setSelectedSubgroup(subgroup.id)}
                      className={`px-3 py-1 rounded-full text-sm ${selectedSubgroup === subgroup.id 
                        ? 'bg-yellow-500 text-black' 
                        : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                      {subgroup.name}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="newSubgroup"
                    placeholder="New subgroup name..."
                    className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700 text-sm"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('newSubgroup');
                      if (input.value.trim()) {
                        createSubgroup(input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-500"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:col-span-3">
            <FlashCardGrid cards={filteredCards} />
          </div>
        </div>
      </div>
    </div>
  );
}
