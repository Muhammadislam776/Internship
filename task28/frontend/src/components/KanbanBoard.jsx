import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';

const COLUMNS = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

const KanbanBoard = ({ tasks = [], setTasks, onSelectTask, onEditTask, onDeleteTask, onAddTask }) => {
  const [activeTask, setActiveTask] = useState(null);
  const { addToast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5 // 5px drag threshold prevents accidental clicks
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const draggedTask = tasks.find((t) => t._id === activeId);
    if (!draggedTask) return;

    let targetColumn = null;
    let targetIndex = 0;

    // Check if dropping directly over a column container or another task card
    if (COLUMNS.includes(overId)) {
      targetColumn = overId;
      const columnTasks = tasks.filter((t) => t.status === targetColumn);
      targetIndex = columnTasks.length;
    } else {
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        targetColumn = overTask.status;
        const columnTasks = tasks.filter((t) => t.status === targetColumn);
        targetIndex = columnTasks.findIndex((t) => t._id === overId);
      }
    }

    if (!targetColumn) return;

    const originalStatus = draggedTask.status;
    const originalPosition = draggedTask.position;
    const originalTasksSnapshot = [...tasks];

    // If unchanged column and position, return early
    if (originalStatus === targetColumn && originalPosition === targetIndex) {
      return;
    }

    // 1. OPTIMISTIC UI UPDATE
    const updatedTasks = tasks.map((t) => {
      if (t._id === activeId) {
        return { ...t, status: targetColumn, position: targetIndex };
      }
      return t;
    });

    setTasks(updatedTasks);
    addToast(`Task moved to ${targetColumn.replace('_', ' ')}`, 'info');

    // 2. EXPRESS API PERSISTENCE
    try {
      const res = await taskService.patchTaskPosition(activeId, {
        status: targetColumn,
        position: targetIndex
      });

      if (res.success && res.task) {
        // Sync final task state from backend response
        setTasks((prev) =>
          prev.map((t) => (t._id === activeId ? res.task : t))
        );
      }
    } catch (err) {
      console.error('Drag API Error:', err);
      // ROLLBACK UI STATE ON FAILURE
      setTasks(originalTasksSnapshot);
      addToast(
        'Could not save task position.',
        'error',
        () => handleDragEnd(event) // Retry callback
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x max-w-full">
        {COLUMNS.map((colId) => {
          const colTasks = tasks
            .filter((t) => t.status === colId)
            .sort((a, b) => a.position - b.position);

          return (
            <KanbanColumn
              key={colId}
              columnId={colId}
              title={colId}
              tasks={colTasks}
              onAddTask={onAddTask}
              onSelectTask={onSelectTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>

      {/* Drag Overlay Preview */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isOverlay={true} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
