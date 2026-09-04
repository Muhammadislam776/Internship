import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  Paperclip, 
  MoreVertical, 
  AlertCircle, 
  Edit2, 
  Trash2,
  Copy
} from 'lucide-react';

const TaskCard = ({ task, onSelectTask, onEditTask, onDeleteTask, isOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  // Priority color scheme
  const priorityBadges = {
    LOW: 'bg-slate-800/80 text-slate-300 border-slate-700',
    MEDIUM: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    HIGH: 'bg-vibrant/15 text-vibrant border-vibrant/30',
    URGENT: 'bg-status-danger/20 text-status-danger border-status-danger/40 animate-pulse'
  };

  // Subtask completion calculation
  const completedSubtasks = task.subtasks ? task.subtasks.filter(s => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Overdue check
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'DONE';

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelectTask && onSelectTask(task)}
      className={`group relative glass-card rounded-2xl p-4 cursor-grab active:cursor-grabbing border transition-all duration-300 ${
        isDragging
          ? 'opacity-40 border-cyber shadow-cyan-glow scale-[1.02]'
          : isOverlay
          ? 'border-cyber bg-midnight-hover shadow-cyan-glow ring-2 ring-cyber/50 opacity-95 scale-105 z-50'
          : 'border-cyber/15 hover:border-cyber/40 hover:shadow-card-lift hover:-translate-y-1'
      }`}
    >
      {/* Top Cover Image (Optional) */}
      {task.cover_image && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 group-hover:shadow-md transition-all">
          <img
            src={task.cover_image}
            alt={task.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-dark/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Header: Priority Badge & Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border tracking-wider uppercase ${
              priorityBadges[task.priority] || priorityBadges.MEDIUM
            }`}
          >
            {task.priority}
          </span>
          {isOverdue && (
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-status-danger text-white rounded-md flex items-center gap-1 shadow-glass">
              <AlertCircle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Quick Card Action Buttons */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask && onEditTask(task);
            }}
            className="p-1 text-slate-400 hover:text-cyber hover:bg-white/10 rounded-md transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask && onDeleteTask(task);
            }}
            className="p-1 text-slate-400 hover:text-status-danger hover:bg-white/10 rounded-md transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-bold text-white group-hover:text-cyber transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Short Description */}
      {task.description && (
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mt-2.5">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-medium bg-electric/15 text-cyber border border-cyber/20 rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Subtasks Progress Bar (if subtasks exist) */}
      {totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
            <span>Subtasks</span>
            <span>
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
          <div className="w-full bg-midnight rounded-full h-1 overflow-hidden">
            <div
              className="bg-cyber h-full rounded-full transition-all duration-300"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer: Metadata & Assignee Avatar */}
      <div className="flex items-center justify-between border-t border-white/10 mt-3 pt-2.5 text-slate-400">
        <div className="flex items-center gap-3 text-xs">
          {/* Due Date */}
          {formattedDueDate && (
            <div
              className={`flex items-center gap-1 text-[11px] font-semibold ${
                isOverdue ? 'text-status-danger font-bold' : 'text-slate-400'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedDueDate}</span>
            </div>
          )}

          {/* Subtask count */}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <CheckSquare className="w-3.5 h-3.5 text-cyber" />
              <span>{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}

          {/* Comment Count */}
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center gap-1 text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee_id && (
          <div className="relative group/avatar" title={task.assignee_id.name}>
            <img
              src={task.assignee_id.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={task.assignee_id.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-cyber/30 group-hover/avatar:scale-110 transition-transform"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
