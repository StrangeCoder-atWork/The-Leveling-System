
"use client"
import "./home.css"
import React, { useState, useEffect, useRef } from "react";
import Cards from '../components/Cards';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import Image from "next/image";
import { useSelector } from 'react-redux';
import Intro from "../components/Intro";
import AgentPanel from "../components/AgentPanel";
import XPBar from "../components/XPBar";
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
  const [Ended, setEnded] = useState(false);
  const theme = useTheme();
  const current = themes[theme['theme']];
  const { color, glow } = getRankStyle(rank, theme.theme);
  const alarmRef= useRef(null)
  const [showDayRitual, setShowDayRitual] = useState(false);
  const [dailyQuote, setDailyQuote] = useState('');
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    const setupCompleted = localStorage.getItem('setupCompleted');
    const introShown = localStorage.getItem('introShown');

    if (setupCompleted && !introShown) {
      setShowIntro(true);
    } else {
      setShowIntro(false);
    }

    setEnded(false);
  }, [current]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem('introShown', 'true');
  };
  
  // Add this effect to detect user interaction
  useEffect(() => {
    const handleInteraction = () => {
      localStorage.setItem('userInteracted', 'true');
      

      };
    // };
    
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
  
  // Remove the separate playSound function and useEffect

  
  return (
    <div className="">
      {showIntro && <Intro onComplete={handleIntroComplete} />}
      
      {/* Core Motivation Features */}
      <div className="flex flex-col items-center mt-4 mb-6">
        <div className="w-full max-w-4xl px-4">
          {/* ZEYN Quote of the Day */}
          <div className="text-center mb-6 text-xl font-semibold text-white/90 italic">
            {dailyQuote || "Loading daily wisdom..."}
          </div>

          {/* Progress Section */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-1">
              <XPBar showAura={true} />
              <div className="mt-2">
                <CharacterEvolutionMeter />
              </div>
            </div>
            
            {/* Streak Tracker */}
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{streakDays}</div>
                <div className="text-sm text-gray-300">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex min-h-screen">
        {/* Left Side - Goals & Timer */}
        <div className="w-1/4 p-4">
          <RemainingGoals />
          <FocusTimer />
        </div>

        {/* Center - Main Content */}
        <div className="flex-1">
          <div className={`${current.main} overflow-hidden relative`}>
            {/* Theme Particles Overlay */}
            <ParticlesOverlay theme={current} />
            
            {/* Character with Aura */}
            <div className="relative">
              {current.vid && <video src={current.vid} />}
              <CharacterAura active={xpIncreased} />
            </div>
            
            {/* Theme Lore Button */}
            <button 
              className="absolute bottom-4 right-4 bg-black/40 p-2 rounded-full"
              onClick={() => setShowLore(true)}>
              📜
            </button>
          </div>
        </div>

        {/* Right Side - Utilities */}
        <div className="w-1/4 p-4">
          <MiniCalendar />
          <FlashcardReminder />
          <ShopTeaser />
        </div>
      </div>

      {/* ZEYN Chat Bubble */}
      <div className="fixed bottom-4 right-4">
        <AgentPanel section="home" compact={true} />
      </div>

      {/* Overlays */}
      {showDayRitual && (
        <DayRitualOverlay 
          onClose={() => setShowDayRitual(false)}
          rank={rank}
          xp={xp}
          tasks={tasks}
        />
      )}
      
      {showLore && (
        <ThemeLorePanel 
          theme={current}
          onClose={() => setShowLore(false)}
        />
      )}

      {/* Level Up Animation */}
      <RankUpAnimation show={showRankUp} rank={rank} />
    </div>
  );
};

export default Home;
