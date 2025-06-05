'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { askAgentPersonalized, getUserProfile } from '@/lib/aiAgent';

export default function XPCalculator({ onCalculate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  
  const calculateXP = async () => {
    setIsCalculating(true);
    try {
      const userProfile = getUserProfile();
      const response = await askAgentPersonalized('XPCalculator', {
        ...userProfile,
        type: 'xp_calculation'
      });
      setResult(response);
      if (onCalculate) {
        onCalculate(response.rewards);
      }
    } catch (error) {
      console.error('Error calculating XP:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r z-50 from-yellow-600 to-yellow-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        Calculate XP
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-indigo-900/90 to-purple-950/90 p-6 rounded-xl max-w-md w-full border border-indigo-500/30"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white text-center mb-4">AI XP Calculator</h2>
              
              {!result ? (
                <>
                  <p className="text-gray-300 mb-6 text-center">
                    Let the AI analyze your tasks and progress to calculate appropriate XP and money rewards.
                  </p>
                  
                  <button
                    onClick={calculateXP}
                    disabled={isCalculating}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCalculating ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      <>Calculate Now</>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-white/10 p-4 rounded-lg mb-4">
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{result.title}</h3>
                    <p className="text-gray-300 mb-4">{result.message}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-green-500/20 p-3 rounded-lg border border-green-500/30">
                        <h4 className="text-green-300 font-medium text-sm mb-1">XP Reward</h4>
                        <p className="text-2xl font-bold text-white">+{result.rewards?.xp || 0}</p>
                      </div>
                      <div className="bg-yellow-500/20 p-3 rounded-lg border border-yellow-500/30">
                        <h4 className="text-yellow-300 font-medium text-sm mb-1">Money Reward</h4>
                        <p className="text-2xl font-bold text-white">+{result.rewards?.money || 0}</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-500/20 p-3 rounded-lg border border-red-500/30 mb-4">
                      <h4 className="text-red-300 font-medium text-sm mb-1">Potential Penalty</h4>
                      <p className="text-xl font-bold text-white">-{result.rewards?.penalty || 0}</p>
                      <p className="text-xs text-red-200">If tasks are not completed</p>
                    </div>
                    
                    <div className="bg-indigo-500/20 p-3 rounded-lg border border-indigo-500/30">
                      <h4 className="text-indigo-300 font-medium text-sm mb-1">Suggestion</h4>
                      <p className="text-white">{result.suggestion}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (onCalculate) onCalculate(result.rewards);
                        setIsOpen(false);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Accept Rewards
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}