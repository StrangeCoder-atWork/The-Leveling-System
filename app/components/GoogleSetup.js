"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function GoogleSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    profession: '',
    interests: [],
    goals: '',
    studyPreferences: ''
  });
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push('/home');
      }
    } catch (error) {
      console.error('Setup error:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="setup-container"
    >
      {/* Add your setup form UI here */}
    </motion.div>
  );
}