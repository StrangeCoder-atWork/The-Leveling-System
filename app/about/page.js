'use client';
import React from 'react';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const theme = useTheme();
  const current = themes[theme['theme']];
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20"
      style={{
        backgroundImage: `url(${current.backgroundImage || '/bg3.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-6">About LevelDeck</h1>
            
            <div className="space-y-6 text-gray-200">
              <p>
                LevelDeck is a gamified productivity platform designed to transform your learning and productivity journey into an exciting adventure. By combining elements of gaming with productivity tools, we help you stay motivated and make progress towards your goals.  
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
              <p>
                Our mission is to make productivity and learning enjoyable and sustainable. We believe that by adding game-like elements to everyday tasks, we can help you build better habits, maintain motivation, and achieve more.  
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Experience-based leveling system to track your progress</li>
                <li>Daily and long-term quests to organize your tasks</li>
                <li>Flashcard system for effective learning</li>
                <li>AI-powered assistant to provide personalized guidance</li>
                <li>Paper analysis tools for academic research</li>
                <li>Progress tracking with streaks and statistics</li>
                <li>Customizable themes to personalize your experience</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">About the Developer</h2>
              <p>
                LevelDeck was created by Strange Coder as a personal project. As the sole developer, I've combined my passion for productivity, learning, and gaming to create a tool that makes personal development more engaging and effective. This app represents my vision for how technology can enhance our daily routines and help us achieve our goals.  
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Contact</h2>
              <p>
                Have questions, suggestions, or feedback? I'd love to hear from you! Reach out at <span className="text-blue-400">support@leveldeck.com</span>  
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}