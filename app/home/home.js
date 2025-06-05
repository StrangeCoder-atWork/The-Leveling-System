
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
  useEffect(() => {
    // Stop any existing audio when theme changes
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current = null;
    }
    
    // Play new theme audio if available
    if (current.audio) {
      const audio = new Audio(current.audio);
      audio.loop = true;
      audio.volume = 0.5; // Lower volume for better user experience
      
      // Check if user has interacted with the page
      const hasInteracted = document.querySelectorAll('button, a, input').length > 0 && 
                         localStorage.getItem('userInteracted') === 'true';
      
      // Only attempt to play if there's been interaction
      if (hasInteracted) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
              alarmRef.current = audio;
            })
            .catch(err => {
              console.error("Audio play failed:", err);
              // Don't set alarmRef.current since playback failed
            });
        }
      } else {
        // Store audio for later playback
        alarmRef.current = audio;
      }
    }
    
    // Cleanup function to stop audio when component unmounts
    return () => {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current = null;
      }
    };
  }, [current.audio, theme]);
  
  // Add this effect to detect user interaction
  useEffect(() => {
    const handleInteraction = () => {
      localStorage.setItem('userInteracted', 'true');
      
      // Try to play audio if it was loaded but not playing
      // if (alarmRef.current && current.audio) {
      //   const playPromise = alarmRef.current.play();
        
      //   if (playPromise !== undefined) {
      //     playPromise.catch(err => {
      //       console.error("Audio play failed after interaction:", err);
      //     });
        // }
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
      {/* <AgentPanel section="home" /> */}

      <div className={`${current.main} overflow-hidden`}>
        {current.vid!=""&& <video
        src={current.vid}
          autoPlay
          loop
          muted
          className={`${current.mythical} absolute top-0 left-0 min-h-screen min-w-screen object-cover z-0`}
        >
        </video>}
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
              <p
                className={`${current.rank_letter} relative `}
              >  {rank}
              </p>
              <div
                className={current.glow_aura}
              />
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
        {current.charct!="" && <video
        src={current.charct}
          autoPlay
          loop
          muted
          className={current.character_css}
        >
        </video>}
          {current.character!=""&& (<Image
            className={current.character_css}
            src={current.character}
            alt="character"
            width={350}
            height={200}
          />)}
        </div>
      </div>
    </div>
  );
};

export default Home;
