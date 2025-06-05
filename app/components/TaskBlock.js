"use client"
import React from 'react';

function TaskBlock({ task }) {
  return (
    <div
      className="absolute rounded-lg p-2 text-sm text-white cursor-pointer shadow-lg"
      style={{
        top: task.top,
        height: task.height,
        left: '10%',
        width: '80%',
        backgroundColor: task.color
      }}
    >
      <div className="font-bold">{task.title}</div>
      <div>{task.category}</div>
    </div>
  );
}

export default TaskBlock;