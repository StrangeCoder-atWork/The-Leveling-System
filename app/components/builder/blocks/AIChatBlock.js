import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

export default function AIChatBlock({ config, onConfigChange }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const { theme } = useTheme();
  
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = { 
        role: 'assistant', 
        content: `This is a simulated response from the ${config.agentType} AI. In a real implementation, this would call the AI agent API with the prompt: "${config.prompt}"` 
      };
      setChatHistory(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleConfigChange = (e) => {
    const newConfig = {
      ...config,
      [e.target.name]: e.target.value
    };
    onConfigChange(newConfig);
  };
  
  return (
    <div className="p-4">
      <motion.div 
        className="flex flex-col h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-800/30 rounded p-2">
          {chatHistory.length > 0 ? (
            <div className="space-y-2">
              {chatHistory.map((msg, index) => (
                <motion.div 
                  key={index}
                  className={`p-2 rounded max-w-[80%] ${msg.role === 'user' ? 'ml-auto bg-purple-700/50' : 'bg-gray-700/50'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  className="p-2 rounded bg-gray-700/50 max-w-[80%]"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  AI is thinking...
                </motion.div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Start a conversation with your AI assistant
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <motion.button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            Send
          </motion.button>
          <motion.button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-700/80 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️
          </motion.button>
        </div>
        
        {showConfig && (
          <motion.div 
            className="mt-4 w-full bg-gray-800/50 p-3 rounded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Agent Type</label>
              <select 
                name="agentType" 
                value={config.agentType} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
              >
                <option value="assistant">General Assistant</option>
                <option value="tutor">Study Tutor</option>
                <option value="motivator">Motivational Coach</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">System Prompt</label>
              <textarea 
                name="prompt" 
                value={config.prompt} 
                onChange={handleConfigChange}
                className="w-full bg-gray-700/50 text-white px-3 py-2 rounded"
                rows="3"
                placeholder="Instructions for the AI..."
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}