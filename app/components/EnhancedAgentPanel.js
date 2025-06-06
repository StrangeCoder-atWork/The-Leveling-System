import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile, askAgentPersonalized } from '../../lib/aiAgent';

export default function EnhancedAgentPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentName, setAgentName] = useState('ZEYN');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        sender: 'agent',
        text: `ZEYN activated. Memory link stable. Begin reconstruction.`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [agentName]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const userProfile = getUserProfile();
      if (!userProfile) {
        throw new Error('User not logged in');
      }

      const response = await askAgentPersonalized('chat', {
        ...userProfile,
        message: input,
        conversation: messages.map(m => ({ role: m.sender, content: m.text })),
        type: 'conversation'
      });

      const agentMessage = {
        sender: 'agent',
        text: response.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        sender: 'agent',
        text: error.message === 'User not logged in' 
          ? "Access denied. Authentication required."
          : "Connection disrupted. Entropy increased. Retry when stability returns.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-black text-cyan-400 rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto mt-6 border border-cyan-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">ZEYN – Zero Entropy Yielding Nexus</h2>
        <div className="text-xs text-cyan-600 bg-cyan-900/30 px-2 py-1 rounded-full">
          The only constant in your chaos
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-black border border-cyan-800 text-cyan-400'}`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left mb-4">
            <div className="inline-block px-4 py-2 rounded-lg bg-black border border-cyan-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-900 text-white border border-cyan-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Enter command..."
          disabled={isLoading}
        />
        <motion.button
          type="submit"
          className="bg-cyan-900 text-cyan-400 border border-cyan-700 px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={isLoading || !input.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  );
}