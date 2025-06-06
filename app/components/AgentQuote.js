import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function AgentQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Get daily quote from ZEYN
    const fetchQuote = async () => {
      const userProfile = getUserProfile();
      const response = await askAgentPersonalized('daily-quote', userProfile);
      setQuote(response.message);
    };

    fetchQuote();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-4"
    >
      <p className="text-xl font-semibold text-white/90 italic">
        {quote || "Gathering wisdom..."}
      </p>
    </motion.div>
  );
}