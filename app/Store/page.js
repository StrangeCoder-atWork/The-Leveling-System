"use client"
import React, { useState } from 'react'
import './store.css'
import ItemSpace from '../components/itemSpace.js'
import { useTheme } from '../context/ThemeContext'
import { themes } from '@/data/themes'
import { useSelector, useDispatch } from 'react-redux'
import { updateUserStats } from './slices/userSlice'
import { motion } from 'framer-motion'

const Store = () => {
  const theme = useTheme();
  const current = themes[theme['theme']];
  const { money } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  
  // Handle purchase function
  const handlePurchase = (itemPrice, itemName) => {
    if (money >= itemPrice) {
      if (confirm(`Are you sure you want to spend ${itemPrice} coins on ${itemName}?`)) {
        // Update user's money in Redux
        dispatch(updateUserStats({ money: money - itemPrice }));
        
        // Save to localStorage
        const userId = localStorage.getItem('currentUserId');
        if (userId) {
          // Update user data in database
          fetch('/api/user/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              updates: { money: money - itemPrice }
            })
          })
          .catch(error => console.error('Error updating user data:', error));
          
          // Record purchase history
          const purchaseHistory = JSON.parse(localStorage.getItem(`purchaseHistory_${userId}`) || '[]');
          purchaseHistory.push({
            item: itemName,
            price: itemPrice,
            date: new Date().toISOString()
          });
          localStorage.setItem(`purchaseHistory_${userId}`, JSON.stringify(purchaseHistory));
        }
        
        // Show success message
        setPurchaseStatus({ success: true, message: `Successfully purchased ${itemName}!` });
        setTimeout(() => setPurchaseStatus(null), 3000);
      }
    } else {
      // Show error message
      setPurchaseStatus({ success: false, message: `Not enough coins to purchase ${itemName}` });
      setTimeout(() => setPurchaseStatus(null), 3000);
    }
  };
  
  // List of store items
  const storeItems = [
    { id: 1, title: "30 MIN GAMING TIME", price: 1000, image: "/tv.png" },
    { id: 2, title: "HEALTHY SNACK", price: 1500, image: "/popcorn1.png" },
    { id: 3, title: "30 MIN ANIME TIME", price: 1200, image: "/anime3.png" },
    { id: 4, title: "1 HOUR FREE TIME", price: 2000, image: "/images (1).jpg" },
    { id: 5, title: "SYSTEM UPGRADE", price: 1700, image: "/platform.png" },
    { id: 6, title: "SPECIAL MISSION UNLOCK", price: 2100, image: "/dragonbg1.jpg" },
    { id: 7, title: "XP BOOSTER (10%)", price: 3000, image: "/levelimg.png" },
    { id: 8, title: "SKIP ONE HOMEWORK", price: 5000, image: "/black.png" },
    { id: 9, title: "MOVIE NIGHT", price: 2500, image: "/popcorn.png" },
    { id: 10, title: "CUSTOM AVATAR", price: 3500, image: "/character1.png" },
    { id: 11, title: "THEME UNLOCK", price: 4000, image: "/Mythicalbg1.jpg" },
    { id: 12, title: "EXTRA SLEEP HOUR", price: 2200, image: "/Peacebg.jpg" },
    { id: 13, title: "WEEKEND ACTIVITY", price: 4500, image: "/Animebg3.jpg" },
    { id: 14, title: "MUSIC STREAMING (1 MONTH)", price: 3200, image: "/Techbg1.mp4" },
    { id: 15, title: "BOOK OF CHOICE", price: 3800, image: "/Classicbg1.jpg" },
    { id: 16, title: "SKILL COURSE", price: 5500, image: "/Japanbg1.jpg" },
    { id: 17, title: "MEDITATION SESSION", price: 1800, image: "/Peacebg2.jpg" },
    { id: 18, title: "HEALTHY MEAL DELIVERY", price: 4200, image: "/Peacebg3.jpg" },
    { id: 19, title: "STUDY MATERIALS", price: 2800, image: "/Classicbg2.jpg" },
    { id: 20, title: "LEGENDARY ITEM", price: 10000, image: "/dragonProfile.mp4" },
  ];

  return (
    <div
      className="min-h-screen bg-fixed bg-no-repeat bg-cover relative z-20"
      style={{ backgroundImage: "url('/Spacebg2.jpg')" }}
    >
      <div className="text-3xl text-center pt-20 pb-4 text-blue-400 font-bold font-cursive">
        Purchase Your Rewards!
      </div>
      
      {/* User's current money */}
      <div className="text-center mb-6">
        <span className="text-xl text-yellow-400 bg-black/30 px-4 py-2 rounded-full">
          Your Balance: {money} 🪙
        </span>
      </div>
      
      {/* Purchase status message */}
      {purchaseStatus && (
        <motion.div 
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg ${purchaseStatus.success ? 'bg-green-600' : 'bg-red-600'} text-white font-medium shadow-lg`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {purchaseStatus.message}
        </motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-5 px-6 pt-4 pb-12 relative z-10">
        {storeItems.map(item => (
          <ItemSpace 
            key={item.id}
            image={item.image} 
            price={item.price} 
            title={item.title} 
            onPurchase={() => handlePurchase(item.price, item.title)}
          />
        ))}
      </div>
    </div>
  );
}

export default Store
