'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FlashCardGrid({ cards }) {
  const [flippedCards, setFlippedCards] = useState({});
  
  const toggleFlip = (cardId) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {cards.length > 0 ? (
        cards.map(card => (
          <motion.div 
            key={card.id}
            className="relative h-64 cursor-pointer"
            onClick={() => toggleFlip(card.id)}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-blue-500/30 shadow-lg"
              initial={false}
              animate={{
                rotateY: flippedCards[card.id] ? 180 : 0,
                opacity: flippedCards[card.id] ? 0 : 1
              }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">{card.question}</h3>
              <div className="mt-auto">
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {card.groupName || 'Uncategorized'}
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-xl p-6 flex flex-col justify-center items-center text-center border border-purple-500/30 shadow-lg"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{
                rotateY: flippedCards[card.id] ? 0 : -180,
                opacity: flippedCards[card.id] ? 1 : 0
              }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-white">{card.answer}</p>
              <div className="mt-auto">
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                  Answer
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-gray-700">
          <p className="text-gray-400">No flashcards available. Create some or select a different group.</p>
        </div>
      )}
    </div>
  );
}