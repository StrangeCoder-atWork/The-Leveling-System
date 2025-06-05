'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "../context/ThemeContext";
import { themes } from '@/data/themes';
import AgentPanel from "../components/AgentPanel";
import { v4 as uuidv4 } from 'uuid';
import './journal.css';

export default function Journal() {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [journals, setJournals] = useState([]);
  const [currentJournal, setCurrentJournal] = useState({ id: '', title: '', content: '', date: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [error, setError] = useState('');
  
  const theme = useTheme();
  const current = themes[theme.theme];

  // Load password and journals from localStorage
  useEffect(() => {
    const storedPassword = localStorage.getItem('journalPassword');
    if (storedPassword) {
      setSavedPassword(storedPassword);
    } else {
      setShowPasswordSetup(true);
      setIsLocked(false);
    }

    const storedJournals = localStorage.getItem('journals');
    if (storedJournals) {
      setJournals(JSON.parse(storedJournals));
    }
  }, []);

  // Save journals to localStorage whenever they change
  useEffect(() => {
    if (journals.length > 0) {
      localStorage.setItem('journals', JSON.stringify(journals));
    }
  }, [journals]);

  const handleSetupPassword = () => {
    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }
    
    localStorage.setItem('journalPassword', password);
    setSavedPassword(password);
    setShowPasswordSetup(false);
    setPassword('');
    setError('');
  };

  const handleUnlock = () => {
    if (password === savedPassword) {
      setIsLocked(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLock = () => {
    setIsLocked(true);
    setCurrentJournal({ id: '', title: '', content: '', date: '' });
    setIsEditing(false);
  };

  const handleSaveJournal = () => {
    if (!currentJournal.title.trim() || !currentJournal.content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (isEditing) {
      setJournals(journals.map(journal => 
        journal.id === currentJournal.id ? currentJournal : journal
      ));
    } else {
      const newJournal = {
        ...currentJournal,
        id: uuidv4(),
        date: new Date().toISOString()
      };
      setJournals([newJournal, ...journals]);
    }

    setCurrentJournal({ id: '', title: '', content: '', date: '' });
    setIsEditing(false);
    setError('');
  };

  const handleEditJournal = (journal) => {
    setCurrentJournal(journal);
    setIsEditing(true);
  };

  const handleDeleteJournal = (id) => {
    setJournals(journals.filter(journal => journal.id !== id));
    if (currentJournal.id === id) {
      setCurrentJournal({ id: '', title: '', content: '', date: '' });
      setIsEditing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url(${current.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="min-h-screen bg-black/50 pt-20 pb-10 px-4">
        
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-gray-900/80 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-white">Personal Journal</h1>
            <p className="text-gray-400 mt-2">Your private space for thoughts and reflections</p>
          </div>

          {showPasswordSetup ? (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Set Up Password Protection</h2>
              <p className="text-gray-400 mb-4">Create a password to protect your journal entries. You'll need this password to access your journal in the future.</p>
              
              <div className="mb-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              <button
                onClick={handleSetupPassword}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
              >
                Set Password
              </button>
            </div>
          ) : isLocked ? (
            <div className="p-6 flex flex-col items-center">
              <div className="w-full max-w-md">
                <h2 className="text-xl font-semibold text-white mb-4">Enter Password</h2>
                <p className="text-gray-400 mb-4">Your journal is password protected. Enter your password to continue.</p>
                
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <button
                  onClick={handleUnlock}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                >
                  Unlock Journal
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Your Entries</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleLock}
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Lock
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Journal Entry Form */}
                <div className="md:col-span-2">
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                    <input
                      type="text"
                      value={currentJournal.title}
                      onChange={(e) => setCurrentJournal({...currentJournal, title: e.target.value})}
                      placeholder="Entry title"
                      className="w-full p-3 mb-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <textarea
                      value={currentJournal.content}
                      onChange={(e) => setCurrentJournal({...currentJournal, content: e.target.value})}
                      placeholder="Write your thoughts here..."
                      className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none min-h-[200px]"
                    />
                    
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    
                    <div className="flex justify-end mt-3">
                      {isEditing && (
                        <button
                          onClick={() => {
                            setCurrentJournal({ id: '', title: '', content: '', date: '' });
                            setIsEditing(false);
                            setError('');
                          }}
                          className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={handleSaveJournal}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                      >
                        {isEditing ? 'Update Entry' : 'Save Entry'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Journal Entries List */}
                <div className="md:col-span-1 h-[500px] overflow-y-auto pr-2 journal-scrollbar">
                  {journals.length > 0 ? (
                    journals.map(journal => (
                      <motion.div
                        key={journal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-800/50 rounded-lg p-4 mb-3 cursor-pointer hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-white truncate">{journal.title}</h3>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditJournal(journal)}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteJournal(journal.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{formatDate(journal.date)}</p>
                        <p className="text-gray-300 mt-2 text-sm line-clamp-3">{journal.content}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No journal entries yet</p>
                      <p className="text-sm mt-2">Start writing to see your entries here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
