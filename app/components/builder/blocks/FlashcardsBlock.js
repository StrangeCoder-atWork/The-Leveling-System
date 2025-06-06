import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function FlashcardsBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(config.cards || []);
  const { theme } = useTheme();
  
  useEffect(() => {
    // Update cards when config changes
    if (config.cards) {
      setCards(config.cards);
    }
  }, [config.cards]);
  
  const handleConfigChange = (e) => {
    const newConfig = {
      ...config,
      [e.target.name]: e.target.value
    };
    onConfigChange(newConfig);
  };
  
  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value
    };
    
    const newConfig = {
      ...config,
      cards: updatedCards
    };
    onConfigChange(newConfig);
  };
  
  const addCard = () => {
    const newCard = { front: '', back: '' };
    const updatedCards = [...cards, newCard];
    
    const newConfig = {
      ...config,
      cards: updatedCards
    };
    onConfigChange(newConfig);
  };
  
  const removeCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    
    const newConfig = {
      ...config,
      cards: updatedCards
    };
    onConfigChange(newConfig);
    
    if (currentCardIndex >= updatedCards.length) {
      setCurrentCardIndex(Math.max(0, updatedCards.length - 1));
    }
  };
  
  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 200);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    }, 200);
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <h3 className="text-white text-lg font-medium mb-2">{config.title || 'Flashcards'}</h3>
          
          {cards.length > 0 ? (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex flex-col items-center">
              <div className="mb-2 text-gray-400 text-sm">
                Card {currentCardIndex + 1} of {cards.length}
              </div>
              
              <motion.div 
                className="w-full h-48 relative cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={isFlipped ? 'back' : 'front'}
                    initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center bg-gray-700/70 rounded-lg p-4 text-center"
                  >
                    <div className="text-white text-lg">
                      {isFlipped ? cards[currentCardIndex]?.back : cards[currentCardIndex]?.front}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
              
              <div className="text-xs text-gray-400 mt-2">
                Click card to flip
              </div>
              
              <div className="flex justify-center space-x-4 mt-4">
                <motion.button
                  onClick={prevCard}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cards.length <= 1}
                >
                  ← Prev
                </motion.button>
                <motion.button
                  onClick={nextCard}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cards.length <= 1}
                >
                  Next →
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 flex items-center justify-center h-48">
              <p className="text-gray-400">No flashcards added yet. Add some in settings.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="px-3 py-1 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showConfig ? 'Hide Settings' : 'Settings'}
          </motion.button>
        </div>
        
        {showConfig && (
          <motion.div 
            className="mt-4 w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                name="title" 
                value={config.title || ''} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                placeholder="Flashcards"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-300">Cards</h4>
                <motion.button
                  onClick={addCard}
                  className="px-2 py-1 bg-green-600/80 hover:bg-green-700/80 text-white rounded text-xs"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Card
                </motion.button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cards.map((card, index) => (
                  <div key={index} className="bg-gray-700/30 p-3 rounded relative">
                    <button 
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => removeCard(index)}
                    >
                      ✕
                    </button>
                    
                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Front</label>
                      <textarea 
                        value={card.front} 
                        onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                        className="w-full bg-gray-700/50 text-white px-3 py-2 rounded text-sm"
                        rows="2"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Back</label>
                      <textarea 
                        value={card.back} 
                        onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                        className="w-full bg-gray-700/50 text-white px-3 py-2 rounded text-sm"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}