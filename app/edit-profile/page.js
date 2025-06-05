'use client';
import React, { useState } from 'react';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserStats } from '../Store/slices/userSlice';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const theme = useTheme();
  const current = themes[theme['theme']];
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', selectedImage);
      
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile picture');
      }
      
      // Update UI to show success
      alert('Profile picture updated successfully!');
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
        backgroundImage: `url(${current.backgroundImage || '/bg3.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Edit Profile Picture</h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white mb-4">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">No Image</span>
                    </div>
                  )}
                </div>
                
                <label className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300">
                  Choose Image
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="hidden" 
                  />
                </label>
              </div>
              
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedImage || isLoading}
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