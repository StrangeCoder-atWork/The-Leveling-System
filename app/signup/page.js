'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateEmail, validatePassword, validateUsername } from '../utils/validation';
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate inputs
    if (!validateUsername(username)) {
      setError("Username must be 3-20 characters and contain only letters, numbers, and underscores");
      setIsLoading(false);
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and contain uppercase, lowercase, and numbers");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // After successful signup, redirect to setup instead of login
      router.push("/setup");
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
          SIGN UP
        </motion.h1>
        
        <motion.form 
          className="flex flex-col gap-5" 
          onSubmit={handleSignup}
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </motion.div>
          
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
          
          <motion.div variants={itemVariants}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm Password"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </motion.div>
          
          <motion.button
            type="submit"
            className={`mt-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 py-4 rounded-lg text-xl font-medium transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
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
        
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <p className="text-neutral-400">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}