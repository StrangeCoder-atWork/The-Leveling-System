"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addFlashcard } from '../Store/slices/flashcardsSlice'
import { useDispatch } from 'react-redux'

const FlashCardCreatePanel = ({ onClose, selectedGroup, selectedSubgroup }) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()

  const handleCreateCard = () => {
    if (!question.trim() || !answer.trim()) {
      return;
    }

    setIsSubmitting(true);
    const groupId = selectedGroup || 'default';
    const fullGroupId = selectedSubgroup ? `${groupId}/${selectedSubgroup}` : groupId;
    
    const newFlashcard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: question.trim(),
      answer: answer.trim(),
      createdAt: new Date().toISOString(),
      groupId: fullGroupId,
      lastReviewed: null,
      nextReview: new Date().toISOString(), // Review immediately first time
      difficulty: 'medium', // Default difficulty
      reviewCount: 0
    };

    // Save to Redux
    dispatch(addFlashcard(newFlashcard));
    
    // Save to localStorage
    const userId = localStorage.getItem('currentUserId');
    const flashcardsData = JSON.parse(localStorage.getItem(`flashcardsState_${userId}`) || '{}');
    flashcardsData.flashcards = flashcardsData.flashcards || {};
    flashcardsData.flashcards[newFlashcard.id] = newFlashcard;
    localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify(flashcardsData));
    
    // Clear the form
    setQuestion('');
    setAnswer('');
    setIsSubmitting(false);

    // Optional: Close the panel after creation
    if (onClose) onClose();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: { duration: 0.4 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-xl max-w-2xl mx-auto"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
        >
          Create FlashCard
        </motion.h1>

        <motion.div variants={itemVariants} className="mb-6 space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Question
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder="Enter your question here..."
            className="w-full p-4 rounded-lg bg-gray-800/50 text-white border border-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Answer
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={4}
            placeholder="Enter your answer here..."
            className="w-full p-4 rounded-lg bg-gray-800/50 text-white border border-gray-700 placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-transparent transition-all duration-200"
          />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="flex justify-end space-x-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateCard}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Card'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FlashCardCreatePanel
