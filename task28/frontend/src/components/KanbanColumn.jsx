import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const columnStyles = {
  BACKLOG: {
    title: 'BACKLOG',
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-slate-400'
  },
  TODO: {
    title: 'TO DO',
    badge: 'bg-electric/20 text-electric border-electric/40',
    dot: 'bg-electric'
  },
  IN_PROGRESS: {
    title: 'IN PROGRESS',
    badge: 'bg-cyber/20 text-cyber border-cyber/40',
    dot: 'bg-cyber shadow-cyan-glow'
  },
  IN_REVIEW: {
    title: 'IN REVIEW',
    badge: 'bg-status-purple/20 text-status-purple border-status-purple/40',
    dot: 'bg-status-purple'
  },
  DONE: {
    title: 'DONE',
    badge: 'bg-status-success/20 text-status-success border-status-success/40',
    dot: 'bg-status-success'
  }
};

const KanbanColumn = ({ columnId, title, tasks = [], onAddTask, onSelectTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      type: 'Column',
      columnId
    }
  });

  const styleConfig = columnStyles[columnId] || {
    title,
    badge: 'bg-slate-800 text-slate-300 border-slate-700',
    dot: 'bg-cyber'
  };

  const taskIds = tasks.map((t) => t._id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-72 sm:w-80 shrink-0 glass-panel rounded-3xl p-4 border transition-all duration-300 min-h-[580px] max-h-[calc(100vh-10rem)] ${
        isOver
          ? 'border-cyber bg-midnight-hover shadow-cyan-glow ring-2 ring-cyber/30'
          : 'border-cyber/15'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${styleConfig.dot}`} />
          <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">
            {styleConfig.title}
          </h3>
          <span
            className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full border ${styleConfig.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask && onAddTask(columnId)}
          className="p-1 text-slate-400 hover:text-cyber hover:bg-white/10 rounded-lg transition-all"
          title="Add Task to Column"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Draggable Task List Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onSelectTask={onSelectTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-white/10 rounded-2xl text-center">
            <p className="text-xs font-semibold text-slate-400">No tasks in {styleConfig.title}</p>
            <button
              onClick={() => onAddTask && onAddTask(columnId)}
              className="mt-3 px-3 py-1.5 bg-electric/20 text-cyber border border-cyber/30 rounded-xl text-xs font-bold hover:bg-electric hover:text-white transition-all"
            >
              + Add First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
