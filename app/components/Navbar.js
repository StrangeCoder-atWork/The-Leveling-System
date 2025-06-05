"use client";
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import "./Navbar.css"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes'
import { useSelector } from 'react-redux';
import { handleLogout } from '../utils/authUtils';

const Navbar = (props) => {
  const { xp, money, level, rank } = useSelector(state => state.user);
  const {data: session, status}= useSession();
  const [menuBar, setmenuBar]= useState(false);
  const [themeBar, setthemeBar]= useState(false);
  const [profileImage, setProfileImage] = useState("/user.png");
  
  const handleClick=()=>{
    setmenuBar(!menuBar);
  }
  
  const theme= useTheme();
  const current=themes[theme['theme']];
  
  // Load profile image when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user?.image) {
      // Check if the image is a base64 string
      if (session.user.image.startsWith('data:image')) {
        setProfileImage(session.user.image);
      } else {
        // Regular URL
        setProfileImage(session.user.image);
      }
    } else {
      setProfileImage("/user.png");
    }
  }, [session, status]);
  
  return (
    <nav className={current.navbar}>
      <div className="logo flex justify-center items-center">
        <img className="h-7 sm:h-8 md:h-9 lg:h-9 object-contain" onClick={handleClick} src="/download.png" />

        {status=="authenticated" ?(
          <div className="flex items-center">
            <div className="flex flex-col items-center ml-3">
              <h1 className="Username_navbar text-xl font-bold">{session.user.name || session.user.username}</h1>
              {session.user.title && (
                <span className="text-xs bg-yellow-500/80 text-black px-2 py-0.5 rounded-full">
                  {session.user.title}
                </span>
              )}
            </div>
            <div className="relative ml-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/20">
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  width={40}
                  height={40}
                  className="h-full w-full object-cover" 
                  onError={() => setProfileImage("/user.png")}
                  unoptimized={profileImage.startsWith('data:')}
                  priority={true}
                />
              </div>
            </div>
          </div>
        ): (<h1 className="Username_navbar text-xl relative font-bold">User</h1>)}
      
      <div className="relative z-50">
      { menuBar && (
          <div
            className="fixed z-40"
            onClick={() => setmenuBar(false)}
          />
        )}

        {/* 3D Sidebar Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: menuBar ? 0 : '-100%' }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="fixed top-0 left-0 h-full w-[300px] bg-[#0a0a0a] shadow-[inset_-4px_0_12px_#1a1a1a] border-r border-gray-800 text-white z-50 p-6 flex flex-col gap-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/download.png" alt="Logo" width={36} height={36} className="rounded" />
              <span className="text-lg font-bold tracking-wider text-white">LevelDeck</span>
            </div>
            <button
              onClick={() => setmenuBar(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-5 text-sm">
            <Link
              href="/home"
              className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
            >
              <span className="group-hover:text-white text-gray-400">🏠 Home</span>
            </Link>

            {status === "authenticated" ? (
              <>
                <Link
                  href="/edit-profile"
                  className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
                >
                  <span className="group-hover:text-white text-gray-400">🖊️ Edit Profile Picture</span>
                </Link>
                <Link
                  href="/edit-profile-data"
                  className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
                >
                  <span className="group-hover:text-white text-gray-400">📋 Edit Profile Data</span>
                </Link>
                <button
                  className="text-left group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
                  onClick={handleLogout}
                >
                  <span className="group-hover:text-white text-gray-400">🚪 Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
              >
                <span className="group-hover:text-white text-gray-400">🔐 Login</span>
              </Link>
            )}

            <Link
            href="/themes"
              className="text-left group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
              onClick={() => setthemeBar(!themeBar)}
            >
              <span className="group-hover:text-white text-gray-400">🎮 Theme</span>
            </Link>
            <Link
              href="/about"
              className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
            >
              <span className="group-hover:text-white text-gray-400">ℹ️ About Us</span>
            </Link>
            <Link
              href="/study-tips"
              className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
            >
              <span className="group-hover:text-white text-gray-400">📚 Study Tips</span>
            </Link>
            <Link
              href="/guide"
              className="group relative pl-4 py-2 border-l-2 border-transparent hover:border-white hover:pl-6 transition-all duration-300"
            >
              <span className="group-hover:text-white text-gray-400">🗺️ Guide</span>
            </Link>
            
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-gray-800 text-[10px] text-gray-600">
            <p>© {new Date().getFullYear()} LevelDeck</p>
            <p className="opacity-60">Your journey, gamified.</p>
          </div>
        </motion.div>
      </div>
      </div>
      <div className="status_nav justify-around flex space-x-4">
      <div className="xp text-white">XP: {xp}</div>
      <div className="money text-white">Money: {money}</div>
      <div className="level text-white">Level: {level}</div>
      <div className="rank text-white">Rank: {rank}</div>
      </div>
    </nav>
  )
}

export default Navbar
