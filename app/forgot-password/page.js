"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { validateEmail } from "../utils/validation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage(data.message);
      setEmail(""); // Clear the email field
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="relative login_bg w-screen h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#0e795a45] blur-3xl top-[-100px] left-[-100px] animate-pulse-slow animate-accordion-down z-0" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#0f5c7935] blur-3xl bottom-[-100px] right-[-100px] animate-pulse-slow z-0" />
      
      <motion.div 
        className="login bg-neutral-950 m-10 h-fit w-full sm:w-8/12 md:w-6/12 lg:w-4/12 text-white relative z-20 p-8 rounded-xl border border-neutral-800/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-4xl mb-6 text-center font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent"
          variants={itemVariants}
        >
          Reset Password
        </motion.h1>
        
        <motion.p 
          className="text-neutral-400 text-center mb-8"
          variants={itemVariants}
        >
          Enter your email address and we'll send you a link to reset your password.
        </motion.p>
        
        <motion.form 
          className="flex flex-col gap-6" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </motion.div>
          
          <motion.button
            type="submit"
            className={`bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 py-4 rounded-lg text-xl font-medium transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </motion.button>
        </motion.form>
        
        {error && (
          <motion.p 
            className="mt-4 text-center text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        
        {message && (
          <motion.p 
            className="mt-4 text-center text-green-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {message}
          </motion.p>
        )}
        
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <Link 
            href="/login" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
          >
            Back to Login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}