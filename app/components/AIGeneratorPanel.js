'use client';
import { useState } from 'react';
import { askAgentPersonalized } from '@/lib/aiAgent';
import { getUserProfile } from '@/lib/aiAgent';

export default function AIGeneratorPanel({ onGenerate }) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const userProfile = getUserProfile();
      await onGenerate(topic, userProfile);
      setTopic('');
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-xl w-full">
      <h3 className="text-xl font-bold text-white mb-3">AI Flashcard Generator</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic or subject..."
          className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className="bg-yellow-500 text-black px-4 py-2 rounded font-medium hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        Let AI create flashcards based on your topic to help you study more effectively.
      </p>
    </div>
  );
}