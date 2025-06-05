"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setNotification } from "../Store/slices/uiSlice";

export default function SetupPage() {
  const { data: session, status } = useSession();
  const [profession, setProfession] = useState("");
  const [personalInfo, setPersonalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if email is already verified (for Google users or verified users)
      if (session.user.email) {
        // Add this fetch call to check verification status
        fetch("/api/auth/check-verification")
          .then(res => res.json())
          .then(data => {
            if (data.verified || session.user.provider === "google") {
              setEmailVerified(true);
            }
          })
          .catch(err => {
            console.error("Error checking verification status:", err);
          });
      }
    }
  }, [session, status]);

  const sendVerificationEmail = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send verification email");
      }

      setVerificationSent(true);
      dispatch(setNotification({ 
        type: 'success', 
        message: 'Verification email sent! Please check your inbox.' 
      }));
    } catch (err) {
      setError(err.message);
      dispatch(setNotification({ 
        type: 'error', 
        message: `Failed to send verification email: ${err.message}` 
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profession,
          personalData: { info: personalInfo }, // Fix: Format personal data correctly
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete setup");
      }

      // Mark setup as completed
      localStorage.setItem('setupCompleted', 'true');
      
      dispatch(setNotification({
        type: "success",
        message: "Setup completed successfully!",
      }));
      
      router.push("/home");
    } catch (err) {
      setError(err.message);
      dispatch(setNotification({
        type: "error",
        message: err.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Add verification section to the existing UI
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#111] flex items-center justify-center px-4 font-sans relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00f2ff22] blur-3xl top-[-100px] left-[-100px] animate-pulse-slow z-0" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ff00c822] blur-3xl bottom-[-100px] right-[-100px] animate-pulse-slow z-0" />

      <div className="relative z-10 w-full sm:w-11/12 md:w-8/12 lg:w-4/12 p-8 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.7)] bg-[#0d0d0d]/90 backdrop-blur-md border border-neutral-800 animate-fade-in">
        <h1 className="text-3xl font-semibold text-center mb-8 text-white tracking-wide animate-slide-up">
          Tell us about yourself
        </h1>

        {/* Email verification section */}
        {!emailVerified && session?.user?.provider !== "google" && (
          <div className="mb-6 p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/10 animate-slide-up">
            <h2 className="text-lg font-medium text-yellow-400 mb-2">Email Verification Required</h2>
            <p className="text-sm text-neutral-300 mb-3">Please verify your email address to continue setup.</p>
            <button
              onClick={sendVerificationEmail}
              disabled={loading || verificationSent}
              className="w-full bg-yellow-600/80 hover:bg-yellow-500/80 text-white font-medium py-2 rounded-md shadow-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verificationSent ? "Verification Email Sent" : loading ? "Sending..." : "Send Verification Email"}
            </button>
          </div>
        )}

        <div className="mb-6 animate-slide-up delay-100">
          <label className="block mb-2 text-sm font-medium text-neutral-400">Profession:</label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            disabled={loading}
            className="w-full p-3 rounded-md bg-[#111] text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all duration-200"
          >
            <option value="">Select</option>
            <option value="Student">Student</option>
            <option value="Developer">Developer</option>
            <option value="Gamer">Gamer</option>
            <option value="Teacher">Teacher</option>
            <option value="Employed">Employed</option>
            <option value="Athlete">Athlete</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-6 animate-slide-up delay-200">
          <label className="block mb-2 text-sm font-medium text-neutral-400">Tell us more about yourself:</label>
          <textarea
            value={personalInfo}
            onChange={(e) => setPersonalInfo(e.target.value)}
            rows={5}
            disabled={loading}
            placeholder="Your goals, interests, or motivations..."
            className="w-full p-3 rounded-md bg-[#111] text-white border border-neutral-700 placeholder:text-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500/40 transition-all duration-200"
          />
        </div>

        {error && (
          <p className="text-red-500 mb-4 animate-slide-up delay-300 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-600/80 to-cyan-600/80 hover:from-pink-500 hover:to-cyan-500 text-white font-medium py-3 rounded-md shadow-lg transition-all duration-200 hover:scale-[1.02] animate-slide-up delay-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
