import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function CharacterEvolutionMeter() {
  const { xp, level, rank } = useSelector(state => state.user);
  
  // Calculate evolution progress
  const evolutionThreshold = rank === 'SS' ? Infinity : (level + 5) * 1000;
  const progress = Math.min(100, (xp / evolutionThreshold) * 100);

  return (
    <div className="bg-black/30 p-2 rounded-lg">
      <div className="text-xs text-gray-400 mb-1">Evolution Progress</div>
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}