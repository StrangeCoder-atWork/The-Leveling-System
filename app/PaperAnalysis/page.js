'use client';
import { motion } from 'framer-motion';
import PaperAnalysis from '../components/PaperAnalysis';
import { useTheme } from '../context/ThemeContext';
import { themes } from '@/data/themes';

export default function PaperAnalysisPage() {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <motion.div 
      className="min-h-screen page-container"
      style={{
        backgroundImage: `url(${currentTheme.backgroundImage || '/bg3.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-sm">
        <PaperAnalysis />
      </div>
    </motion.div>
  );
}