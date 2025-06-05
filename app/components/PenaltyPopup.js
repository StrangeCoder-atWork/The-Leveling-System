'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function PenaltyPopup({ isVisible, penalty, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-gradient-to-br from-red-900/90 to-red-950/90 p-6 rounded-xl max-w-md w-full border border-red-500/30"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-300">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Task Penalty!</h2>
            <p className="text-red-200 text-center mb-4">You've received a penalty for not completing your scheduled task.</p>
            
            <div className="bg-red-500/20 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white">XP Penalty:</span>
                <span className="text-red-300 font-bold">-{Math.round(penalty * 0.75)} XP</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-white">Money Penalty:</span>
                <span className="text-red-300 font-bold">-{Math.round(penalty * 0.25)} coins</span>
              </div>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 text-center">Complete your tasks on time to avoid penalties and maintain your progress!</p>
            
            <button 
              onClick={onClose}
              className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-medium transition-colors"
            >
              I Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}