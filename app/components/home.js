
"use client"
import "./home.css"
import React, { useState, useEffect, useRef } from "react";
import Cards from './Cards';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import Image from "next/image";
import { useSelector } from 'react-redux';
import Intro from "./Intro";
import AgentPanel from "./AgentPanel";
import AgentQuote from "./AgentQuote";
import XPBar from "./XPBar";
import CharacterEvolutionMeter from "./CharacterEvolutionMeter";
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic rank style function
const getRankStyle = (rank, theme) => {
  const baseColors = {
    E: "#888888",
    D: "#cc6600",
    C: "#5555aa",
    B: "#9900cc",
    A: "#00ccff",
    S: "#ffd700",
    SS: "#ffffff",
  };

  const auraColors = {
    E: "rgba(136,136,136,0.6)",
    D: "rgba(204,102,0,0.6)",
    C: "rgba(85,85,170,0.6)",
    B: "rgba(153,0,204,0.6)",
    A: "rgba(0,204,255,0.6)",
    S: "rgba(255,215,0,0.7)",
    SS: "rgba(255,255,255,0.8)",
  };

  return {
    color: baseColors[rank] || "#ffffff",
    glow: auraColors[rank] || "rgba(255,255,255,0.5)",
  };
};

const Home = () => {
  const { xp, money, level, rank } = useSelector(state => state.user);
  const [showIntro, setShowIntro] = useState(false);
  const [showDayRitual, setShowDayRitual] = useState(false);
  const [Ended, setEnded] = useState(false);
  const theme = useTheme();
  const current = themes[theme['theme']];
  const { color, glow } = getRankStyle(rank, theme.theme);
  const alarmRef = useRef(null);
  
  // New state variables for the added features
  const [streak, setStreak] = useState(0);
  const [remainingGoals, setRemainingGoals] = useState(3);
  const [focusTime, setFocusTime] = useState(25);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [showThemeLore, setShowThemeLore] = useState(false);
  const [showFeaturePanel, setShowFeaturePanel] = useState(false);
  
  useEffect(() => {
    const setupCompleted = localStorage.getItem('setupCompleted');
    const introShown = localStorage.getItem('introShown');

    if (setupCompleted && !introShown) {
      setShowIntro(true);
    } else {
      setShowIntro(false);
    }

    setEnded(false);
    
    // Check if it's a new day to show the day ritual
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toDateString();
    
    if (lastVisit !== today) {
      setShowDayRitual(true);
      localStorage.setItem('lastVisit', today);
    }
    
    // Load streak data
    const savedStreak = localStorage.getItem('streak');
    if (savedStreak) setStreak(parseInt(savedStreak));
    
    // Load remaining goals
    const savedGoals = localStorage.getItem('remainingGoals');
    if (savedGoals) setRemainingGoals(parseInt(savedGoals));
  }, [current]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('introShown', 'true');
  };
  
  const handleDayRitualComplete = () => {
    setShowDayRitual(false);
  };
  
  // Add this effect to detect user interaction
  useEffect(() => {
    const handleInteraction = () => {
      localStorage.setItem('userInteracted', 'true');
    };
    
    // Add listeners for common interaction events
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [current.audio]);
  
  const startFocusTimer = () => {
    setIsFocusActive(true);
    // Focus timer logic would go here
  };
  
  const toggleFeaturePanel = () => {
    setShowFeaturePanel(!showFeaturePanel);
  };
  
  return (
    <div className="">
      {showIntro && <Intro onComplete={handleIntroComplete} />}
      
      {/* Day Ritual Overlay */}
      <AnimatePresence>
        {showDayRitual && (
          <motion.div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gray-900 to-purple-900 p-6 rounded-xl max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Begin Your Day</h2>
              <div className="mb-4 text-center">
                <div className="text-yellow-400 text-xl mb-2">Rank {rank}</div>
                <XPBar showAura={true} />
              </div>
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-2">Today's Quests:</h3>
                <ul className="text-gray-300">
                  <li className="mb-1">• Complete daily study session</li>
                  <li className="mb-1">• Review flashcards</li>
                  <li className="mb-1">• Write in journal</li>
                </ul>
              </div>
              <AgentQuote />
              <button 
                onClick={handleDayRitualComplete}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
              >
                Begin Journey
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`${current.main} overflow-hidden`}>
        {current.vid!=="" && <video
          src={current.vid}
          autoPlay
          loop
          muted
          className={`${current.mythical} absolute top-0 left-0 min-h-screen min-w-screen object-cover z-0`}
        >
        </video>}
        
        {/* Floating Particles / Theme Aura */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{ 
                y: [null, Math.random() * window.innerHeight],
                opacity: [null, Math.random() > 0.5 ? 0 : 0.5]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
              style={{ 
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`
              }}
            />
          ))}
        </div>
        
        {/* ZEYN Quote of the Day - Top Center */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl px-4">
          <AgentQuote />
        </div>
        
        <div className={current.LevelRank}>
          <div className={current.Status}>
            <div className={current.rank} style={{ position: "relative" }}>
              <Image
                src={current.platform_img || '/platform.png'}
                alt="platform"
                className={current.platform}
                width={300}
                height={300}
              />
              <p className={`${current.rank_letter} relative`}>
                {rank}
              </p>
              <div className={current.glow_aura} />
            </div>
            <div className={current.level}>
              <Image
                className={current.level_css}
                src={current.level_img || '/levelimg.png'}
                alt="level"
                width={250}
                height={300}
              />
              <div className={current.level_letter}>{level}</div>
            </div>
            
            {/* XP Bar with animated aura */}
            <div className="relative mx-auto w-full max-w-md px-4 mt-2">
              <XPBar showAura={true} />
            </div>
            
            {/* Character Evolution Meter */}
            <div className="mx-auto w-full max-w-md px-4 mt-1">
              <CharacterEvolutionMeter />
            </div>
          </div>

          <div className={current.progress}>
            <Cards title="Progress" link="/Progress" />
            <Cards title="Daily Quest" link="/DailyQuest" />
            <Cards title="Big Quest" link="/BigQuest" />
            <Cards title="Flash Card" link="/FlashCard" />
            <Cards title="Paper Analysis" link="/PaperAnalysis" />
            <Cards title="Store" link="/Store" />
            <Cards title="Journal" link="/Journal" />
          </div>
        </div>
        
        <div className={current.profile}>
          {current.charct!=="" && <video
            src={current.charct}
            autoPlay
            loop
            muted
            className={current.character_css}
          >
          </video>}
          {current.character!=="" && (
            <div className="relative">
              <Image
                className={current.character_css}
                src={current.character}
                alt="character"
                width={350}
                height={200}
              />
              
              {/* Aura FX / Glow Trail on Character */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </div>
          )}
          
          {/* Theme Lore Button */}
          <motion.button
            onClick={() => setShowThemeLore(!showThemeLore)}
            className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            📜
          </motion.button>
        </div>
        
        {/* Right Side Panel with Streak, Goals and Focus Timer */}
        <div className="absolute top-20 right-4 flex flex-col gap-3 z-10">
          {/* Streak Tracker */}
          <motion.div 
            className="bg-black/30 p-3 rounded-lg border border-white/10"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">🔥</span>
              <div>
                <div className="text-white font-bold">{streak} day streak</div>
                <div className="text-xs text-gray-300">Keep it going!</div>
              </div>
            </div>
          </motion.div>
          
          {/* Today's Remaining Goals */}
          <motion.div 
            className="bg-black/30 p-3 rounded-lg border border-white/10"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-white font-bold mb-1">⏳ Remaining Goals</div>
            <div className="flex gap-1">
              {Array.from({ length: remainingGoals }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-blue-500"></div>
              ))}
              {Array.from({ length: 5 - remainingGoals }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gray-600"></div>
              ))}
            </div>
          </motion.div>
          
          {/* Focus Timer Widget */}
          <motion.div 
            className="bg-black/30 p-3 rounded-lg border border-white/10"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-white font-bold mb-1">🧠 Focus Timer</div>
            <div className="text-center text-2xl text-white mb-2">
              {isFocusActive ? `${focusTime}:00` : "Ready?"}
            </div>
            <button 
              onClick={startFocusTimer}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 rounded text-sm transition-colors"
            >
              {isFocusActive ? "Pause" : "Start Focus"}
            </button>
          </motion.div>
        </div>
        
        {/* Mini Calendar Preview - Bottom Right */}
        <motion.div 
          className="absolute bottom-4 right-4 bg-black/30 p-3 rounded-lg border border-white/10 z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-white font-bold mb-1 text-sm">🗂 Activity Calendar</div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-sm ${i % 2 === 0 ? 'bg-green-500' : 'bg-gray-700'}`}
                title={`${new Date(Date.now() - (6-i) * 86400000).toLocaleDateString()}`}
              ></div>
            ))}
          </div>
        </motion.div>
        
        {/* ZEYN AI Agent Interaction - Bottom Left */}
        <motion.div 
          className="absolute bottom-4 left-4 z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <button 
            onClick={toggleFeaturePanel}
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
          >
            Z
          </button>
        </motion.div>
        
        {/* Feature Panel (shows when Z button is clicked) */}
        <AnimatePresence>
          {showFeaturePanel && (
            <motion.div 
              className="fixed bottom-16 left-4 bg-gray-900/90 p-4 rounded-lg border border-purple-500/30 shadow-xl z-50 w-80"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-bold">ZEYN Assistant</h3>
                <button 
                  onClick={toggleFeaturePanel}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-white mb-2">What's your mission today?</div>
                <input 
                  type="text" 
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                  placeholder="Enter your main goal..."
                />
              </div>
              
              <div className="mb-4">
                <div className="text-white mb-2">Theme Lore</div>
                <div className="text-sm text-gray-300 bg-black/30 p-2 rounded max-h-24 overflow-y-auto">
                  {current.theme === 'mythical' ? 
                    "In the realm of dragons and ancient magic, you seek the knowledge that will unlock your true potential..." :
                    "The story of your chosen theme awaits discovery. Each step forward reveals more of the path..."}
                </div>
              </div>
              
              <div>
                <div className="text-white mb-2">Flashcards Due Today</div>
                <div className="flex justify-between items-center bg-blue-900/30 p-2 rounded">
                  <span className="text-blue-300">5 cards ready for review</span>
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">
                    Review
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Rank-Up Flash Screen */}
        <AnimatePresence>
          {false && ( /* This would be controlled by state when user levels up */
            <motion.div 
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="text-6xl font-bold text-yellow-400 mb-4"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  LEVEL UP!
                </motion.div>
                <div className="text-3xl text-white mb-8">You've reached Level {level + 1}</div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-xl transition-colors">
                  Continue Journey
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
