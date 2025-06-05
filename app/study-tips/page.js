'use client';
import React from 'react';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';

export default function StudyTipsPage() {
  const theme = useTheme();
  const current = themes[theme['theme']];
  
  const studyTips = [
    {
      title: "The Pomodoro Technique",
      description: "Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break. This helps maintain focus and prevents burnout.",
      icon: "⏱️"
    },
    {
      title: "Active Recall",
      description: "Instead of passively re-reading material, actively test yourself on what you've learned. This strengthens memory and identifies knowledge gaps.",
      icon: "🧠"
    },
    {
      title: "Spaced Repetition",
      description: "Review material at increasing intervals over time. This optimizes memory retention and makes learning more efficient.",
      icon: "📅"
    },
    {
      title: "The Feynman Technique",
      description: "Explain concepts in simple terms as if teaching someone else. This helps identify gaps in your understanding and reinforces learning.",
      icon: "👨‍🏫"
    },
    {
      title: "Mind Mapping",
      description: "Create visual diagrams to connect ideas and concepts. This helps with understanding relationships between different topics.",
      icon: "🗺️"
    },
    {
      title: "Interleaved Practice",
      description: "Mix different topics or types of problems within a single study session. This improves ability to discriminate between problem types.",
      icon: "🔄"
    },
    {
      title: "Dual Coding",
      description: "Combine verbal and visual learning materials. Processing information in multiple ways enhances memory and understanding.",
      icon: "🖼️"
    },
    {
      title: "Elaborative Interrogation",
      description: "Ask yourself 'why' questions about the material you're learning. This creates deeper connections and improves retention.",
      icon: "❓"
    }
  ];
  
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
            <h1 className="text-3xl font-bold text-white mb-8">Study Tips & Techniques</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyTips.map((tip, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800 bg-opacity-70 p-6 rounded-lg shadow-md border border-gray-700"
                >
                  <div className="flex items-start">
                    <span className="text-4xl mr-4">{tip.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{tip.title}</h3>
                      <p className="text-gray-300">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-blue-900 bg-opacity-40 rounded-lg border border-blue-700">
              <h2 className="text-2xl font-bold text-white mb-4">Pro Tip: Use LevelDeck Features</h2>
              <p className="text-gray-200">
                Combine these study techniques with LevelDeck's features for maximum effectiveness. Use the Flashcard system for spaced repetition, track your Pomodoro sessions with Daily Quests, and leverage the AI Agent for personalized study advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}