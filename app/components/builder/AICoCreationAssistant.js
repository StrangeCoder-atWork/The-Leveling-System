import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AICoCreationAssistant({ onGenerateLayout }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGenerateLayout = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/generate-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate layout');
      }
      
      const data = await response.json();
      onGenerateLayout(data.blocks);
      setPrompt('');
    } catch (error) {
      console.error('Error generating layout:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      className="bg-gray-900/80 rounded-lg p-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">AI Co-Creation Assistant</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Describe what you want to build</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-800/50 text-white px-3 py-2 rounded"
            rows="3"
            placeholder="e.g., Create a battle-themed study station with timer and XP bar"
          />
        </div>
        
        <motion.button
          onClick={handleGenerateLayout}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Layout...
            </span>
          ) : (
            'Generate Layout with AI'
          )}
        </motion.button>
        
        <div className="text-sm text-gray-400">
          <p>Example prompts:</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>"Create a battle-themed study station"</li>
            <li>"Design a productivity page for daily revision and memory recall"</li>
            <li>"Build a meditation dashboard with timer and ambient sounds"</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}