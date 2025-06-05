'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FloatingButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Link href="/AIAgent">
        <motion.button
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5Z"></path>
            <path d="M19 11a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h8"></path>
            <line x1="12" x2="12" y1="17" y2="22"></line>
          </svg>
        </motion.button>
      </Link>
      
      {isHovered && (
        <motion.div 
          className="absolute right-16 bottom-2 bg-black/80 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
        >
          AI Assistant
        </motion.div>
      )}
    </motion.div>
  );
};

export default FloatingButton;