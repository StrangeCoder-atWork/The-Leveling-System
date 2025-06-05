'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Intro.css';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function Intro({ onComplete }) {
  const [step, setStep] = useState(1);
  const [showContinue, setShowContinue] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // New state for sequential text
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

    // Display intro texts sequentially
    introTexts.forEach((text, index) => {
      const delay = index * 2000; // 2 seconds per line
      timers.push(setTimeout(() => {
        setCurrentTextIndex(index);
      }, delay));
    });

    // After all intro texts, transition to step 2
    const totalIntroTextTime = introTexts.length * 2000; // Total time for all intro texts
    timers.push(setTimeout(() => {
      setStep(2);
    }, totalIntroTextTime));

    // Show continue button after step 2 text is displayed
    timers.push(setTimeout(() => {
      setShowContinue(true);
    }, totalIntroTextTime + 2000)); // 2 seconds after step 2 starts

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
              {introTexts.slice(0, currentTextIndex + 1).map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-xl md:text-2xl font-bold text-white mb-2"
                >
                  {text}
                </motion.p>
              ))}
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
                Your Journey Begins
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
