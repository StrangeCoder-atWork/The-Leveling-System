'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';
import Link from 'next/link';

export default function ThemesPage() {
  const { theme: currentTheme, changeTheme } = useTheme();
  const [showThemeIntro, setShowThemeIntro] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };
  
  // Theme intro animation variants
  const themeIntroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { 
        duration: 0.5, 
        ease: "easeIn" 
      } 
    }
  };

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
    setSelectedTheme(themeKey);
    setShowThemeIntro(true);
    
    // Hide the intro after 5 seconds
    setTimeout(() => setShowThemeIntro(false), 5000);
  };
  
  // Get theme content for intro
  const getThemeIntroContent = () => {
    if (!selectedTheme) return { title: '', description: '', story: '' };
    
    const theme = themes[selectedTheme];
    const formattedTitle = selectedTheme.replace('_', ' ');
    
    return {
      title: formattedTitle,
      description: theme.description || '',
      story: theme.story || ''
    };
  };
  
  const themeContent = getThemeIntroContent();

  return (
    <div className="min-h-screen pt-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Intro Animation */}
        <AnimatePresence>
          {showThemeIntro && (
            <motion.div 
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center bg-black/70 backdrop-blur-md p-8 rounded-lg max-w-lg"
              variants={themeIntroVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-3xl font-bold text-white mb-4">{themeContent.title}</h2>
              <p className="text-xl text-white/90 mb-6">{themeContent.description}</p>
              <p className="text-sm text-white/70">{themeContent.story}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            Choose Your Reality
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Each theme transforms your LevelDeck experience with unique visuals and atmosphere.
            Select the one that resonates with your journey.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(themes).map(([key, theme], index) => (
            <motion.div
              key={key}
              variants={itemVariants}
              className={`rounded-xl overflow-hidden border ${currentTheme === key ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-700'} bg-gray-800 hover:bg-gray-750 transition-all duration-300`}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden" 
              >
                {theme.vid ? (
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src={theme.vid} type="video/mp4" />
                  </video>
                ) : (
                  <div 
                    className="absolute inset-0 w-full h-full" 
                    style={{ 
                      backgroundImage: `url(${theme.backgroundImage || '/Spacebg1.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{key.replace('_', ' ')}</h3>
                <p className="text-gray-300 mb-4">{theme.description}</p>
                <div className="mb-4 max-h-24 overflow-y-auto text-sm text-gray-400">
                  {theme.story}
                </div>
                <button
                  onClick={() => handleThemeChange(key)}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${currentTheme === key ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                >
                  {currentTheme === key ? 'Current Theme' : 'Select Theme'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/home">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              Return to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}