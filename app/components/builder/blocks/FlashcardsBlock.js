import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function FlashcardsBlock({ config, onConfigChange }) {
  const [showConfig, setShowConfig] = useState(false);
  const [cards, setCards] = useState(config.cards || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const { theme } = useTheme();
  
  // Update cards when config changes
  useEffect(() => {
    if (config.cards) {
      setCards(config.cards);
    }
  }, [config.cards]);
  
  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };
  
  const handlePrevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  
  const handleFlipCard = () => {
    setShowAnswer(!showAnswer);
  };
  
  const handleAddCard = () => {
    const newCard = { question: 'New Question', answer: 'New Answer' };
    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    updateConfig(updatedCards);
    setEditingCard(updatedCards.length - 1);
  };
  
  const handleDeleteCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    updateConfig(updatedCards);
    if (currentIndex >= updatedCards.length) {
      setCurrentIndex(Math.max(0, updatedCards.length - 1));
    }
    setEditingCard(null);
  };
  
  const handleEditCard = (index) => {
    setEditingCard(index);
  };
  
  const handleSaveCard = (index, updatedCard) => {
    const updatedCards = [...cards];
    updatedCards[index] = updatedCard;
    setCards(updatedCards);
    updateConfig(updatedCards);
    setEditingCard(null);
  };
  
  const updateConfig = (updatedCards) => {
    const newConfig = {
      ...config,
      cards: updatedCards
    };
    onConfigChange(newConfig);
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {cards.length > 0 ? (
          <div className="mb-4">
            <AnimatePresence mode="wait">
              {editingCard === currentIndex ? (
                <motion.div 
                  key="edit-card"
                  className="bg-gray-800/50 p-4 rounded-lg h-64 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-white text-lg mb-2">Edit Card</h3>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Question</label>
                    <textarea 
                      value={cards[currentIndex].question}
                      onChange={(e) => {
                        const updatedCard = {...cards[currentIndex], question: e.target.value};
                        handleSaveCard(currentIndex, updatedCard);
                      }}
                      className="w-full bg-gray-700/50 text-white px-3 py-2 rounded resize-none flex-1"
                      rows="3"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Answer</label>
                    <textarea 
                      value={cards[currentIndex].answer}
                      onChange={(e) => {
                        const updatedCard = {...cards[currentIndex], answer: e.target.value};
                        handleSaveCard(currentIndex, updatedCard);
                      }}
                      className="w-full bg-gray-700/50 text-white px-3 py-2 rounded resize-none flex-1"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end mt-auto">
                    <motion.button
                      onClick={() => setEditingCard(null)}
                      className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Done
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="view-card"
                  className="bg-gray-800/50 p-4 rounded-lg h-64 flex flex-col justify-center items-center cursor-pointer"
                  onClick={handleFlipCard}
                  initial={{ opacity: 0, rotateY: 0 }}
                  animate={{ opacity: 1, rotateY: showAnswer ? 180 : 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-2">
                      Card {currentIndex + 1} of {cards.length}
                    </div>
                    {showAnswer ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ transform: 'rotateY(180deg)' }}
                      >
                        <h3 className="text-green-400 text-sm mb-2">Answer:</h3>
                        <p className="text-white text-lg">{cards[currentIndex].answer}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h3 className="text-blue-400 text-sm mb-2">Question:</h3>
                        <p className="text-white text-lg">{cards[currentIndex].question}</p>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-gray-400 text-sm mt-4">
                    Click to {showAnswer ? 'see question' : 'reveal answer'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex justify-between mt-4">
              <motion.button
                onClick={handlePrevCard}
                className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={cards.length <= 1}
              >
                ← Prev
              </motion.button>
              
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => handleEditCard(currentIndex)}
                  className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDeleteCard(currentIndex)}
                  className="px-4 py-2 bg-red-600/80 hover:bg-red-700/80 text-white rounded"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={cards.length <= 1}
                >
                  Delete
                </motion.button>
              </div>
              
              <motion.button
                onClick={handleNextCard}
                className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={cards.length <= 1}
              >
                Next →
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 p-4 rounded-lg h-64 flex items-center justify-center mb-4">
            <p className="text-gray-400">No flashcards yet. Add some cards to get started!</p>
          </div>
        )}
        
        <div className="flex space-x-2">
          <motion.button
            onClick={handleAddCard}
            className="flex-1 px-4 py-2 bg-green-600/80 hover:bg-green-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Card
          </motion.button>
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.button>
        </div>
        
        {showConfig && (
          <motion.div 
            className="mt-4 w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Deck Name</label>
              <input 
                type="text" 
                name="deckName" 
                value={config.deckName || 'My Flashcards'} 
                onChange={(e) => onConfigChange({...config, deckName: e.target.value})}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}