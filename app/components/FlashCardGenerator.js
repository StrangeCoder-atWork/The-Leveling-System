'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FlashCardGenerator() {
  const [flashcards, setFlashcards] = useState([]);
  const [inputText, setInputText] = useState('');

  const generateFlashcards = async () => {
    const res = await fetch('/api/flashcards', {
      method: 'POST',
      body: JSON.stringify({ text: inputText }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setFlashcards(data.flashcards || []);
  };

  const markAsLearned = (index) => {
    const updated = [...flashcards];
    updated.splice(index, 1);
    setFlashcards(updated);
    // Add XP, money logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">⚔️ Flashcard Generator</h1>

      <textarea
        className="w-full p-4 rounded-md bg-gray-800 border border-gray-700 text-white resize-none h-40"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your notes or text here..."
      />

      <button
        onClick={generateFlashcards}
        className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-300 transition"
      >
        Generate Flashcards
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {flashcards.map((card, index) => (
          <FlipCard
            key={index}
            question={card.question}
            answer={card.answer}
            onLearned={() => markAsLearned(index)}
          />
        ))}
      </div>
    </div>
  );
}

function FlipCard({ question, answer, onLearned }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-80 cursor-pointer perspective"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          className="absolute w-full h-full backface-hidden rounded-xl p-4 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col justify-center items-center h-full space-y-4 overflow-hidden">
            <div className="text-xl font-bold italic">❓ Question</div>
            <div className="text-sm overflow-y-auto max-h-40 leading-relaxed text-center px-2 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
              {question}
            </div>
          </div>
        </motion.div>

        {/* Back */}
        <motion.div
          className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl p-4 bg-gradient-to-br from-emerald-600 via-green-700 to-lime-500 shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col justify-center items-center h-full space-y-4 overflow-hidden">
            <div className="text-xl font-bold italic">💡 Answer</div>
            <div className="text-sm overflow-y-auto max-h-40 leading-relaxed text-center px-2 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent">
              {answer}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLearned();
              }}
              className="mt-2 px-4 py-2 bg-yellow-300 text-black font-semibold rounded shadow hover:bg-yellow-400"
            >
              ✅ Learned (+10 XP, +5💰)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
