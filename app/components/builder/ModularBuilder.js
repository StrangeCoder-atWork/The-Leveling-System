import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useTheme } from '../../context/ThemeContext';
import { themes } from '@/data/themes';
import BlockPalette from './BlockPalette';
import BuilderCanvas from './BuilderCanvas';
import SortableBlock from './SortableBlock';
import SavePageModal from './SavePageModal';
import { useSelector } from 'react-redux';

export default function ModularBuilder() {
  const [blocks, setBlocks] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedPages, setSavedPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const { userId } = useSelector(state => state.user);
  const theme = useTheme();
  const currentTheme = themes[theme.theme];
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Load saved pages from localStorage
    const loadSavedPages = () => {
      try {
        const saved = localStorage.getItem(`userPages_${userId}`);
        if (saved) {
          setSavedPages(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading saved pages:', error);
      }
    };
    
    loadSavedPages();
  }, [userId]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    
    setActiveId(null);
  };

  const handleAddBlock = (blockType) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      config: getDefaultConfig(blockType),
    };
    
    setBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  const handleConfigureBlock = (blockId, config) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, config } : block
    ));
  };

  // Replace the handleSavePage function with this:
  const handleSavePage = async (pageName, icon) => {
    const newPage = {
      id: currentPageId || `page-${Date.now()}`,
      name: pageName,
      icon: icon || '📄',
      blocks: blocks,
      theme: theme.theme,
      createdAt: currentPageId ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Save to localStorage as a backup
    const updatedPages = currentPageId 
      ? savedPages.map(page => page.id === currentPageId ? newPage : page)
      : [...savedPages, newPage];
    
    setSavedPages(updatedPages);
    localStorage.setItem(`userPages_${userId}`, JSON.stringify(updatedPages));
    
    // Save to MongoDB
    try {
      const response = await fetch('/api/pages/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          page: newPage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save page to database');
      }
      
      // You could update the page ID here if the server assigns a new one
      const data = await response.json();
      if (data.pageId && !currentPageId) {
        setCurrentPageId(data.pageId);
      }
    } catch (error) {
      console.error('Error saving page to database:', error);
      // Optionally show an error notification to the user
    }
    
    setShowSaveModal(false);
  };
  
  // Add a function to load pages from MongoDB
  useEffect(() => {
    const loadPagesFromDatabase = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/pages/list?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to load pages from database');
        }
        
        const data = await response.json();
        if (data.pages && data.pages.length > 0) {
          setSavedPages(data.pages);
          // Also update localStorage for offline access
          localStorage.setItem(`userPages_${userId}`, JSON.stringify(data.pages));
        } else {
          // Fall back to localStorage if no pages in database
          const saved = localStorage.getItem(`userPages_${userId}`);
          if (saved) {
            setSavedPages(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('Error loading pages from database:', error);
        // Fall back to localStorage
        const saved = localStorage.getItem(`userPages_${userId}`);
        if (saved) {
          setSavedPages(JSON.parse(saved));
        }
      }
    };
    
    loadPagesFromDatabase();
  }, [userId]);

  const handleLoadPage = (pageId) => {
    const page = savedPages.find(p => p.id === pageId);
    if (page) {
      setBlocks(page.blocks);
      setCurrentPageId(page.id);
      // Optionally change theme to match the page
      if (theme.theme !== page.theme) {
        theme.changeTheme(page.theme);
      }
    }
  };

  const getDefaultConfig = (blockType) => {
    // Return default configuration based on block type
    switch (blockType) {
      case 'timer':
        return { duration: 25, type: 'focus' };
      case 'aiChat':
        return { agentType: 'assistant', prompt: '' };
      case 'xpTracker':
        return { goal: 100, reward: 50 };
      case 'flashcards':
        return { deckId: null, cardCount: 10 };
      case 'audioPlayer':
        return { playlist: 'focus', volume: 0.5 };
      default:
        return {};
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <BlockPalette onAddBlock={handleAddBlock} />
          
          <div className="mt-6 bg-gray-900/80 rounded-lg p-4">
            <h3 className="text-xl font-bold text-white mb-4">Saved Pages</h3>
            {savedPages.length > 0 ? (
              <div className="space-y-2">
                {savedPages.map(page => (
                  <motion.button
                    key={page.id}
                    onClick={() => handleLoadPage(page.id)}
                    className={`w-full text-left p-2 rounded flex items-center ${currentPageId === page.id ? 'bg-purple-700/50' : 'bg-gray-800/50 hover:bg-gray-700/50'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="mr-2">{page.icon}</span>
                    <span className="text-white">{page.name}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No saved pages yet</p>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Canvas</h2>
            <div className="space-x-2">
              <motion.button
                onClick={() => setBlocks([])}
                className="px-4 py-2 bg-red-600/80 hover:bg-red-700/80 text-white rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear
              </motion.button>
              <motion.button
                onClick={() => setShowSaveModal(true)}
                className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/80 text-white rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Page
              </motion.button>
            </div>
          </div>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <BuilderCanvas>
              <SortableContext items={blocks.map(block => block.id)} strategy={rectSortingStrategy}>
                {blocks.map(block => (
                  <SortableBlock
                    key={block.id}
                    id={block.id}
                    block={block}
                    onRemove={() => handleRemoveBlock(block.id)}
                    onConfigure={(config) => handleConfigureBlock(block.id, config)}
                  />
                ))}
              </SortableContext>
            </BuilderCanvas>
          </DndContext>
        </div>
      </div>
      
      {showSaveModal && (
        <SavePageModal 
          onSave={handleSavePage} 
          onCancel={() => setShowSaveModal(false)}
          initialName={currentPageId ? savedPages.find(p => p.id === currentPageId)?.name : ''}
          initialIcon={currentPageId ? savedPages.find(p => p.id === currentPageId)?.icon : '📄'}
        />
      )}
    </div>
  );
}