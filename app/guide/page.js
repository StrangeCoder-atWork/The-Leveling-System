'use client';
import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';

export default function GuidePage() {
  const theme = useTheme();
  const current = themes[theme['theme']];
  const [activeTab, setActiveTab] = useState('getting-started');
  
  const tabs = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'leveling', label: 'Leveling System' },
    { id: 'quests', label: 'Quests' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'ai-agent', label: 'AI Agent' },
    { id: 'themes', label: 'Themes' }
  ];
  
  const renderTabContent = () => {
    switch(activeTab) {
      case 'getting-started':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Welcome to LevelDeck!</h2>
            <p>LevelDeck is a gamified productivity platform designed to make your learning and productivity journey more engaging and rewarding. Here's how to get started:</p>
            
            <ol className="list-decimal pl-6 space-y-2">
              <li>Complete your profile setup to personalize your experience</li>
              <li>Explore the home page to access different features</li>
              <li>Create your first daily quest to start earning XP</li>
              <li>Check out the different themes to customize your interface</li>
              <li>Visit the Progress page to track your achievements</li>
            </ol>
            
            <p>Remember, consistency is key to leveling up and unlocking new features!</p>
          </div>
        );
      case 'leveling':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Leveling System</h2>
            <p>LevelDeck uses a comprehensive leveling system to track your progress:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>XP (Experience Points):</strong> Earned by completing quests, using flashcards, and other productive activities</li>
              <li><strong>Levels:</strong> You level up as you accumulate XP, unlocking new features and abilities</li>
              <li><strong>Rank:</strong> Your rank represents your overall status and changes as you reach higher levels</li>
              <li><strong>Money:</strong> In-game currency earned through activities, used to purchase items in the store</li>
            </ul>
            
            <p>Your level and rank are displayed on your profile and in the navbar for easy tracking.</p>
          </div>
        );
      case 'quests':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Quest System</h2>
            <p>Quests are tasks that you can complete to earn rewards:</p>
            
            <ul className="list-disc pl-6 space-y-4">
              <li>
                <strong>Daily Quests:</strong> Short-term tasks that reset daily. Perfect for building habits and routine tasks.
                <ul className="list-circle pl-6 mt-2">
                  <li>Create tasks with specific time blocks</li>
                  <li>Mark tasks as complete to earn XP</li>
                  <li>Track your daily productivity</li>
                </ul>
              </li>
              <li>
                <strong>Big Quests:</strong> Longer-term projects and goals that provide larger rewards.
                <ul className="list-circle pl-6 mt-2">
                  <li>Break down large projects into manageable steps</li>
                  <li>Set deadlines and track progress</li>
                  <li>Earn substantial XP and money rewards upon completion</li>
                </ul>
              </li>
            </ul>
          </div>
        );
      case 'flashcards':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Flashcard System</h2>
            <p>The Flashcard feature helps you learn and memorize information effectively:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Create custom flashcards with questions and answers</li>
              <li>Organize flashcards into decks by topic</li>
              <li>Practice with spaced repetition for optimal learning</li>
              <li>Track your progress and mastery of each deck</li>
              <li>Earn XP for consistent flashcard practice</li>
            </ul>
            
            <p>Use the AI Agent to help generate flashcards from your study materials!</p>
          </div>
        );
      case 'ai-agent':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">AI Agent</h2>
            <p>Your personal AI assistant provides guidance and support:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Get personalized study and productivity recommendations</li>
              <li>Receive feedback on your progress and habits</li>
              <li>Ask questions about any topic to enhance your learning</li>
              <li>Generate content for flashcards and study materials</li>
              <li>Analyze your productivity patterns for optimization</li>
            </ul>
            
            <p>The more you use LevelDeck, the more personalized the AI Agent's suggestions become!</p>
          </div>
        );
      case 'themes':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Theme Customization</h2>
            <p>Personalize your LevelDeck experience with different themes:</p>
            
            <ul className="list-disc pl-6 space-y-2">
              <li>Access themes from the navbar menu</li>
              <li>Each theme changes the visual style of the entire application</li>
              <li>Themes include different backgrounds, colors, and visual effects</li>
              <li>Your theme preference is saved for future sessions</li>
            </ul>
            
            <p>Try different themes to find the one that motivates you the most!</p>
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };
  
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
            <h1 className="text-3xl font-bold text-white mb-6">LevelDeck Guide</h1>
            
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-1 border-b border-gray-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-blue-900 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-gray-200">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}