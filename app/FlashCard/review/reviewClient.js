'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '@/data/themes';
import FlashCardReview from '../../components/FlashCardReview';

export default function ReviewClient() {
  const [reviewCards, setReviewCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewComplete, setReviewComplete] = useState(false);
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const router = useRouter();
  const searchParams = useSearchParams();

  const groupFilter = searchParams.get('group');
  const subgroupFilter = searchParams.get('subgroup');

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    const flashcardsData = JSON.parse(localStorage.getItem(`flashcardsState_${userId}`) || '{}');
    const allCards = flashcardsData.flashcards || {};

    const now = new Date();
    let filteredCards = Object.values(allCards).filter(card => {
      const isDue = !card.nextReview || new Date(card.nextReview) <= now;
      const matchesGroup = !groupFilter || card.group === groupFilter;
      const matchesSubgroup = !subgroupFilter || card.subgroup === subgroupFilter;
      return isDue && matchesGroup && matchesSubgroup;
    });

    filteredCards.sort((a, b) => {
      if (a.marked && !b.marked) return -1;
      if (!a.marked && b.marked) return 1;
      const aDate = a.nextReview ? new Date(a.nextReview) : new Date(0);
      const bDate = b.nextReview ? new Date(b.nextReview) : new Date(0);
      return aDate - bDate;
    });

    setReviewCards(filteredCards);
  }, [groupFilter, subgroupFilter]);

  const handleCardComplete = () => {
    if (currentCardIndex < reviewCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setReviewComplete(true);
    }
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
        <h1 className="text-3xl font-bold text-white mb-8">📚 Flashcard Review</h1>

        {(groupFilter || subgroupFilter) && (
          <div className="mb-4 bg-white/10 p-3 rounded-lg">
            <p className="text-white">
              Reviewing: {groupFilter ? `Group "${groupFilter}"` : 'All Groups'}
              {subgroupFilter ? ` / Subgroup "${subgroupFilter}"` : ''}
            </p>
          </div>
        )}

        {reviewCards.length > 0 ? (
          reviewComplete ? (
            <motion.div 
              className="text-center py-12 bg-white/10 rounded-xl backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">Review Complete!</h2>
              <p className="text-lg text-white/80 mb-6">You've reviewed all {reviewCards.length} cards due today.</p>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg"
                onClick={() => router.push('/FlashCard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Flashcards
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="mb-4 text-white">
                <p>Card {currentCardIndex + 1} of {reviewCards.length}</p>
              </div>
              <FlashCardReview 
                card={reviewCards[currentCardIndex]} 
                onComplete={handleCardComplete} 
              />
            </>
          )
        ) : (
          <motion.div 
            className="text-center py-12 bg-white/10 rounded-xl backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">No Cards Due for Review</h2>
            <p className="text-lg text-white/80 mb-6">Check back later or create new flashcards.</p>
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg"
              onClick={() => router.push('/FlashCard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Flashcards
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
