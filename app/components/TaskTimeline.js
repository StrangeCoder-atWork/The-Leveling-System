'use client';

import { DndContext } from '@dnd-kit/core';
import DraggableTask from './DraggableTask';
import { timeToY } from '../utils/timeUtils';

export default function Timeline({ tasks, setTasks }) {
  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const draggedTaskId = active.id;
    const draggedTask = tasks.find(t => t.id === draggedTaskId);

    const newStart = new Date(draggedTask.startTime);
    newStart.setMinutes(newStart.getMinutes() + Math.round(delta.y));

    const updatedTasks = tasks.map(t =>
      t.id === draggedTaskId ? { ...t, startTime: newStart.toISOString() } : t
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="relative h-[1440px] border-l bg-gradient-to-b from-gray-100 to-gray-200">
      <DndContext onDragEnd={handleDragEnd}>
        {tasks.map(task => (
          <DraggableTask
            key={task.id}
            task={{
              ...task,
              top: timeToY(task.startTime),
            }}
          />
        ))}
      </DndContext>
    </div>
  );
}
