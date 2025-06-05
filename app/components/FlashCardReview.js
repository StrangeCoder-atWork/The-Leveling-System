'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { updateFlashcard } from '../Store/slices/flashcardsSlice';

export default function FlashCardReview({ card, onComplete }) {
  const [flipped, setFlipped] = useState(false); // Start with question side (not flipped)
  const [showOptions, setShowOptions] = useState(false);
  const [studyStats, setStudyStats] = useState({
    startTime: new Date(),
    timeSpent: 0,
    cardsSeen: 0,
    correctAnswers: 0
  });
  const [showHint, setShowHint] = useState(false);
  const [isMarked, setIsMarked] = useState(card?.marked || false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answerCorrect, setAnswerCorrect] = useState(null);
  const timerRef = useRef(null);
  const dispatch = useDispatch();
  
  // Start timer when component mounts
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStudyStats(prev => ({
        ...prev,
        timeSpent: Math.floor((new Date() - prev.startTime) / 1000)
      }));
    }, 1000);
    
    return () => clearInterval(timerRef.current);
  }, []);
  
  // Calculate next review date based on difficulty and spaced repetition algorithm
  const calculateNextReview = (difficulty) => {
    const today = new Date();
    let daysToAdd = 1; // Default
    const reviewCount = card.reviewCount || 0;
    
    // Implement a more sophisticated spaced repetition algorithm
    switch(difficulty) {
      case 'veryHard': // Again
        daysToAdd = 1; // Review tomorrow
        break;
      case 'hard': // Hard
        // Shorter interval for hard cards, but increases with review count
        daysToAdd = Math.max(2, Math.min(reviewCount, 4)); 
        break;
      case 'easy': // Good
        // Standard interval progression
        daysToAdd = Math.max(reviewCount * 2, 4);
        break;
      case 'veryEasy': // Easy
        // Longer interval for easy cards
        daysToAdd = Math.max(reviewCount * 3, 7);
        break;
      default:
        daysToAdd = 1;
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate.toISOString();
  };
  
  const handleDifficultySelect = (difficulty) => {
    const nextReview = calculateNextReview(difficulty);
    const updatedCard = {
      ...card,
      difficulty,
      lastReviewed: new Date().toISOString(),
      nextReview,
      reviewCount: (card.reviewCount || 0) + 1,
      // Add Anki-like stats
      streak: difficulty === 'veryHard' ? 0 : (card.streak || 0) + 1,
      marked: isMarked
    };
    
    // Update study stats
    setStudyStats(prev => ({
      ...prev,
      cardsSeen: prev.cardsSeen + 1,
      correctAnswers: prev.correctAnswers + (difficulty !== 'veryHard' ? 1 : 0)
    }));
    
    // Update in Redux
    dispatch(updateFlashcard(updatedCard));
    
    // Update in localStorage
    const userId = localStorage.getItem('currentUserId');
    const flashcards = JSON.parse(localStorage.getItem(`flashcardsState_${userId}`) || '{}');
    if (flashcards.flashcards) {
      flashcards.flashcards[card.id] = updatedCard;
      localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify(flashcards));
    }
    
    // Update in database
    if (userId) {
      fetch('/api/flashcards/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          flashcard: updatedCard
        })
      })
      .catch(error => console.error('Error updating flashcard in database:', error));
    }
    
    // Reset state for next card
    setFlipped(false);
    setShowOptions(false);
    setShowHint(false);
    setIsMarked(false);
    setShowKeyboard(false);
    setUserAnswer('');
    setAnswerCorrect(null);
    
    // Move to next card
    if (onComplete) {
      onComplete(updatedCard);
    }
  };
  
  const checkAnswer = () => {
    // Simple check - if answer contains key words from the actual answer
    const answerWords = card.answer.toLowerCase().split(' ');
    const userWords = userAnswer.toLowerCase().split(' ');
    
    // Check if user's answer contains at least 50% of the key words
    const matchCount = userWords.filter(word => 
      answerWords.includes(word) && word.length > 3
    ).length;
    
    const isCorrect = matchCount >= Math.max(1, Math.floor(answerWords.length * 0.3));
    setAnswerCorrect(isCorrect);
    setFlipped(true);
  };
  
  const generateHint = () => {
    // Create a hint by showing first letter of each word and blanks for the rest
    const words = card.answer.split(' ');
    return words.map(word => `${word[0]}${'_'.repeat(word.length - 1)}`).join(' ');
  };
  
  return (
    <div className="w-full max-w-xl mx-auto my-8">
      {/* Study stats */}
      <div className="mb-4 flex justify-between text-white/70 text-sm">
        <div>Time: {Math.floor(studyStats.timeSpent / 60)}m {studyStats.timeSpent % 60}s</div>
        <div>Cards: {studyStats.cardsSeen}</div>
        <div>Accuracy: {studyStats.cardsSeen > 0 ? Math.round((studyStats.correctAnswers / studyStats.cardsSeen) * 100) : 0}%</div>
      </div>
      
      <motion.div 
        className="relative w-full h-96 perspective"
        onClick={() => !showOptions && !showKeyboard && setFlipped(!flipped)}
      >
        <AnimatePresence initial={false} mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              className="absolute w-full h-full rounded-xl p-6 bg-gradient-to-br from-indigo-600 to-purple-700 shadow-xl flex flex-col justify-between"
              initial={{ rotateY: 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -180, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            >
              <div className="flex-1 flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold text-white mb-4">Question</h3>
                <p className="text-xl text-center text-white">{card.question}</p>
              </div>
              
              <div className="flex flex-col gap-2">
                {showHint && (
                  <div className="bg-white/10 p-3 rounded-lg text-white/80 text-center">
                    <p>Hint: {generateHint()}</p>
                  </div>
                )}
                
                {showKeyboard ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-3 bg-white/20 text-white rounded-lg"
                      placeholder="Type your answer..."
                      rows={2}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          checkAnswer();
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Check
                      </motion.button>
                      <motion.button
                        className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowKeyboard(false);
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      className="flex-1 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Show Answer
                    </motion.button>
                    <motion.button
                      className="py-2 px-3 bg-yellow-600/80 hover:bg-yellow-600 text-white rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHint(!showHint);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {showHint ? 'Hide Hint' : 'Hint'}
                    </motion.button>
                    <motion.button
                      className="py-2 px-3 bg-green-600/80 hover:bg-green-600 text-white rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowKeyboard(true);
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Type
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              className="absolute w-full h-full rounded-xl p-6 bg-gradient-to-br from-purple-700 to-indigo-600 shadow-xl flex flex-col justify-between"
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            >
              <div className="flex-1 flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold text-white mb-4">Answer</h3>
                <p className="text-xl text-center text-white">{card.answer}</p>
                
                {answerCorrect !== null && (
                  <div className={`mt-4 p-3 rounded-lg ${answerCorrect ? 'bg-green-600/30' : 'bg-red-600/30'} text-white`}>
                    <p>Your answer: {userAnswer}</p>
                    <p className="font-bold">{answerCorrect ? 'Correct!' : 'Incorrect'}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <motion.button
                  className={`py-2 px-3 rounded-lg ${isMarked ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMarked(!isMarked);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isMarked ? 'Marked' : 'Mark'}
                </motion.button>
                
                <motion.button
                  className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(true);
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Rate Your Answer
                </motion.button>
              </div>
              
              {showOptions && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <motion.button
                    className="py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultySelect('veryHard');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Again
                    <div className="text-xs">1d</div>
                  </motion.button>
                  <motion.button
                    className="py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultySelect('hard');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hard
                    <div className="text-xs">3d</div>
                  </motion.button>
                  <motion.button
                    className="py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultySelect('easy');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Good
                    <div className="text-xs">7d</div>
                  </motion.button>
                  <motion.button
                    className="py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficultySelect('veryEasy');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Easy
                    <div className="text-xs">14d</div>
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}