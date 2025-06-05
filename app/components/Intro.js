'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Intro.css';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function Intro({ onComplete }) {
  const [step, setStep] = useState(1);
  const [showContinue, setShowContinue] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showCurrentText, setShowCurrentText] = useState(true); // New state to control text visibility for fade effect
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const audioRef = useRef(null);

  const introTexts = [
    "🗡️ \"This world does not reward the loudest.",
    "Not the fastest. Not the luckiest.",
    "It rewards the ones who show up when no one is watching.",
    "Who rise even when it feels impossible.",
    "Who carry the blade… even when it’s heavy.\"",
    "💠 You were not born extraordinary.",
    "You chose to become it.",
    "And now — your journey begins.",
    "Not to chase someone else's path…",
    "…but to carve your own.",
    "Welcome, warrior.",
    "This is your story.",
    "This is your rise."
  ];

  useEffect(() => {
    // Play theme audio if available
    if (currentTheme.audio) {
      const audio = new Audio(currentTheme.audio);
      audio.loop = true;
      audio.volume = 0.4; // Lower volume for intro
      audio.play().catch((err) => console.error("Intro audio play failed:", err));
      audioRef.current = audio;
    }

    let timers = [];

    const displayNextText = (index) => {
      if (index < introTexts.length) {
        setCurrentTextIndex(index);
        setShowCurrentText(true); // Show current text

        // Fade out after 4 seconds
        timers.push(setTimeout(() => {
          setShowCurrentText(false); // Hide current text
        }, 4000));

        // Move to next text after 5 seconds (1 second after fade out starts)
        timers.push(setTimeout(() => {
          displayNextText(index + 1);
        }, 5000));
      } else {
        // All intro texts displayed, transition to step 2
        setStep(2);
        // Show continue button immediately after step 2 text is displayed
        timers.push(setTimeout(() => {
          setShowContinue(true);
        }, 1000)); // Give a small delay for step 2 text to appear
      }
    };

    // Start displaying texts after a short initial delay
    timers.push(setTimeout(() => {
      displayNextText(0);
    }, 1000));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      // Stop audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTheme.audio, introTexts.length]);

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
              className="FullIntroText flex flex-col justify-center items-center h-full"
            >
              {showCurrentText && (
                <motion.p
                  key={currentTextIndex} // Key change to re-trigger animation for each text
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} // Fade out animation
                  transition={{ duration: 1 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-2"
                >
                  {introTexts[currentTextIndex]}
                </motion.p>
              )}
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
                  Begin Your Journey
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
