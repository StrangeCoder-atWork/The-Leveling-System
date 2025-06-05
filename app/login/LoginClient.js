"use client";

import { getCsrfToken, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setNotification } from "../Store/slices/uiSlice";
import { motion } from "framer-motion";
import Link from "next/link";
import Intro from '../components/Intro';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [showIntro, setShowIntro] = useState(false);

  const [csrfToken, setCsrfToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCsrfToken().then((token) => {
      setCsrfToken(token || "");
    });
    
    // Check for success or error messages in URL
    const successParam = searchParams.get("success");
    const errorParam = searchParams.get("error");
    const signupParam = searchParams.get("signup");
    const resetParam = searchParams.get("reset");

    if (successParam) {
      setSuccess(successParam);
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
    } else if (signupParam === "success") {
      setSuccess("Account created successfully! Please log in.");
    } else if (resetParam === "success") {
      setSuccess("Password reset successfully! Please log in with your new password.");
    }
  }, [searchParams]);

  // Session effect for authentication
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userId = session.user.id;
  
      // Clear ALL localStorage data before setting new data
      localStorage.clear();
  
      // Store current user ID
      localStorage.setItem('currentUserId', userId);
      
      // Store user data with user-specific keys
      localStorage.setItem(`userState_${userId}`, JSON.stringify({
        xp: session.user.xp || 0,
        money: session.user.money || 0,
        level: session.user.level || 1,
        rank: session.user.rank || 'E',
        personalData: session.user.personalData || {},
        profession: session.user.profession || 'Student',
        isOnline: navigator.onLine
      }));
      
      localStorage.setItem(`tasksState_${userId}`, JSON.stringify(session.user.tasks || {}));
      localStorage.setItem(`flashcardsState_${userId}`, JSON.stringify(session.user.flashCards || {}));
      localStorage.setItem(`streaksState_${userId}`, JSON.stringify(session.user.streaks || {
        streaks: { workout: 0, study: 0, work: 0, other: 0 },
        history: {}
      }));
  
      // Check if setup is completed
      const isSetupComplete = session.user.isSetupComplete;
      if (!isSetupComplete) {
        router.push("/setup");
        return;
      }
      
      // Check if intro has been shown
      const introShown = localStorage.getItem('introShown');
      if (!introShown) {
        setShowIntro(true);
        // Router push will be handled after Intro component finishes
      } else {
        router.push("/home");
      }
      
      dispatch(setNotification({ 
        type: 'success', 
        message: `Welcome back, ${session.user.username || session.user.email}!` 
      }));
      
      // Get browser info for login notification
      const browserInfo = navigator.userAgent;
      const loginTime = new Date().toLocaleString();
      
      // Send login notification email (non-blocking)
      fetch("/api/auth/login-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          browserInfo,
          loginTime
        }),
      }).catch(err => console.error("Failed to send login notification:", err));
    }
  }, [status, session, router, dispatch]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res.error) {
        setError("Invalid Email or Password");
      }
      // Don't redirect here - let the session effect handle it
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
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
    <>
      {showIntro ? (
        <Intro onComplete={() => {
          setShowIntro(false);
          // Check if setup is completed before redirecting
          const isSetupComplete = session?.user?.isSetupComplete;
          if (isSetupComplete) {
            router.push("/home");
          } else {
            router.push("/setup");
          }
        }} />
      ) : (
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
          LOGIN
        </motion.h1>
        
        {success && (
          <motion.div 
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-green-400 text-center">{success}</p>
          </motion.div>
        )}
        
        <motion.form 
          className="flex flex-col gap-6" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.div variants={itemVariants}>
            <input
              type="email"
              value={email} 
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              required
              placeholder="Password"
              className="w-full p-4 rounded-lg bg-neutral-800/50 border border-neutral-700/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
            />
            <Link 
              href="/forgot-password"
              className="absolute right-0 -bottom-6 text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </motion.div>
          
          <motion.button
            type="submit"
            className={`mt-8 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 py-4 rounded-lg text-xl font-medium transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
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
        
        <motion.p 
          className="text-2xl text-center my-4"
          variants={itemVariants}
        >
          OR
        </motion.p>
        
        <motion.button
          onClick={() => signIn("google", { callbackUrl: "/api/auth/session-check" })}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 py-4 rounded-lg text-xl font-medium transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <strong className="relative z-2">Login with Google</strong>
        </motion.button>

        {/* Add signup link */}
        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-400">
            Don't have an account? <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign up</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>)}
    </>
  );
}

// Move clearUserData inside the component
const clearUserData = (userId) => {
  const keys = [
    "userState",
    "tasksState",
    "flashcardsState",
  ];

  keys.forEach((key) => {
    localStorage.removeItem(`${key}_${userId}`);
  });
};

