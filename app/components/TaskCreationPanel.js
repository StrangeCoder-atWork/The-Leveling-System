'use client';
import { useState } from 'react';

export default function TaskCreationPanel({ time, onTaskCreate, onCancel }) {
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(10); // Default to 10 XP
  const [money, setMoney] = useState(5); // Default to 5 money
  const [penalty, setPenalty] = useState('');
  const [priority, setPriority] = useState('medium'); // 'low', 'medium', 'high'
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60); // Default 60 minutes

  const handleCreate = () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const id = 'task-' + Date.now();
    const startTime = time || new Date().toISOString();
    const endTime = new Date(new Date(startTime).getTime() + duration * 60000).toISOString(); // Duration in minutes

    const task = {
      id,
      title,
      description,
      xp: Number(xp) || 0, // Ensure it's a number or default to 0
      money: Number(money) || 0, // Ensure it's a number or default to 0
      penalty,
      priority,
      startTime,
      endTime,
      completed: false
    };

    onTaskCreate(task);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-white text-sm font-medium mb-1">Title</label>
        <input 
          type="text" 
          placeholder="Task title" 
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
      </div>
      
      <div>
        <label className="block text-white text-sm font-medium mb-1">Description</label>
        <textarea 
          placeholder="Task description" 
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          rows="2"
        />
      </div>
      

        <div>
          <label className="block text-white text-sm font-medium mb-1">XP Reward</label>
          <input 
            type="number" 
            placeholder="XP" 
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
            value={xp} 
            onChange={(e) => setXp(Math.max(0, Number(e.target.value)))} 
          />
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-1">Money Reward</label>
          <input 
            type="number" 
            placeholder="Money" 
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
            value={money} 
            onChange={(e) => setMoney(Math.max(0, Number(e.target.value)))} 
          />
        </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-sm font-medium mb-1">Priority</label>
          <select 
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-1">Duration (minutes)</label>
          <input 
            type="number" 
            placeholder="Duration in minutes" 
            className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
            value={duration} 
            onChange={(e) => setDuration(Math.max(15, Number(e.target.value)))} 
          />
        </div>
      </div>
      
      <div>
        <label className="block text-white text-sm font-medium mb-1">Penalty (optional)</label>
        <input 
          type="text" 
          placeholder="What happens if you don't complete this?" 
          className="w-full bg-gray-800 text-white border border-gray-700 p-2 rounded" 
          value={penalty} 
          onChange={(e) => setPenalty(e.target.value)} 
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <button 
          onClick={handleCreate} 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Task
        </button>
        
        <button 
          onClick={onCancel} 
          className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}