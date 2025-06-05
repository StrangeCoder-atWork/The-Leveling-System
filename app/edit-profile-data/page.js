'use client';
import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStats, updatePersonalData } from '../Store/slices/userSlice';
import { useRouter } from 'next/navigation';
import { syncUserDataIfOnline } from '../utils/syncUser';

export default function EditProfileDataPage() {
  const theme = useTheme();
  const current = themes[theme['theme']];
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    name: user.personalData?.name || '',
    profession: user.profession || '',
    bio: user.personalData?.bio || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile data');
      }
      
      // Update Redux store
      dispatch(updatePersonalData({ name: formData.name, bio: formData.bio }));
      dispatch(updateUserStats({ profession: formData.profession }));
      
      // Sync with database
      await syncUserDataIfOnline();
      
      // Navigate back to home
      alert('Profile data updated successfully!');
      router.push('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen"
      style={{
        backgroundImage: `url(${current.backgroundImage || '/Spacebg1.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Edit Profile Data</h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2" htmlFor="profession">
                  Profession
                </label>
                <input 
                  type="text" 
                  id="profession" 
                  name="profession" 
                  value={formData.profession} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              
              <div>
                <label className="block text-white text-sm font-bold mb-2" htmlFor="bio">
                  Bio
                </label>
                <textarea 
                  id="bio" 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows="4"
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                ></textarea>
              </div>
              
              <div className="flex justify-center pt-4">
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}