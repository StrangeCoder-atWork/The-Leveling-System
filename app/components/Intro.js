'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Intro.css';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function Intro({ onComplete }) {
  const [step, setStep] = useState(1);
  const [showContinue, setShowContinue] = useState(false);
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const audioRef = useRef(null);

  useEffect(() => {
    // Play theme audio if available
    if (currentTheme.audio) {
      const audio = new Audio(currentTheme.audio);
      audio.loop = true;
      audio.volume = 0.4; // Lower volume for intro
      audio.play().catch((err) => console.error("Intro audio play failed:", err));
      audioRef.current = audio;
    }
    
    // Show first text for 7 seconds
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 7000);

    // Show second text for 7 seconds
    const timer2 = setTimeout(() => {
      setShowContinue(true);
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      // Stop audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTheme.audio]);

  const handleContinue = () => {
    onComplete();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        backgroundImage: `url(${currentTheme.backgroundImage || '/bg3.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-4">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeOut" } }}
              transition={{ duration: 1 }}
              className="FullIntroText"
            >
              <h1 className="IntroshortText">Welcome to LevelDeck</h1>
              <div className="flex justify-center items-center">
                <div className="glowIntroL w-1 h-1 bg-blue-500 rounded-full mr-4"></div>
                <div className="glowIntroR w-1 h-1 bg-purple-500 rounded-full ml-4"></div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="introText"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Your Journey Begins Now
              </h1>
              <p className="text-xl md:text-2xl text-white/80 mb-8">
                Transform your productivity into an epic adventure
              </p>

              {showContinue && (
                <motion.button
                  onClick={handleContinue}
                  className="continue px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin Your Quest
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
