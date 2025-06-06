import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

export default function BuilderCanvas({ children }) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <motion.div
      ref={setNodeRef}
      className="min-h-[600px] bg-gray-800/30 border-2 border-dashed border-gray-700/50 rounded-lg p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children.length > 0 ? (
        <div className="space-y-4">{children}</div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-center">
            Drag blocks here or click items in the palette to add them to your page
          </p>
        </div>
      )}
    </motion.div>
  );
}