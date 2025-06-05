'use client';
import { useState } from 'react';

export default function GroupSelector({ groups, selected, onSelect, onCreate }) {
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      onCreate(newGroupName.trim());
      setNewGroupName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 p-4 rounded-xl w-full mb-4">
      <h3 className="text-xl font-bold text-white mb-3">Flashcard Groups</h3>
      
      {/* Group List */}
      <div className="flex flex-wrap gap-2 mb-3">
        {groups.length > 0 ? (
          groups.map(group => (
            <button
              key={group.id}
              onClick={() => onSelect(group.id)}
              className={`px-3 py-1 rounded-full text-sm ${selected === group.id 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              {group.name}
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No groups yet. Create one to organize your flashcards.</p>
        )}
      </div>
      
      {/* Create New Group */}
      {isCreating ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Group name..."
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            onClick={handleCreateGroup}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
          >
            Save
          </button>
          <button
            onClick={() => setIsCreating(false)}
            className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Group
        </button>
      )}
    </div>
  );
}