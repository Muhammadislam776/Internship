import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckSquare, 
  MessageSquare, 
  User, 
  Calendar, 
  Tag, 
  Trash2, 
  Edit3, 
  Plus, 
  Send,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const TaskDetailsModal = ({ task, isOpen, onClose, onTaskUpdated, onDeleteTask, onEditTask }) => {
  const { addToast } = useToast();
  const { user } = useAuth();

  const [newComment, setNewComment] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!isOpen || !task) return null;

  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const res = await taskService.toggleSubtask(task._id, subtaskId);
      if (res.success) {
        onTaskUpdated && onTaskUpdated(res.task);
      }
    } catch (err) {
      addToast('Failed to update subtask', 'error');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;

    try {
      const res = await taskService.addSubtask(task._id, newSubtask.trim());
      if (res.success) {
        setNewSubtask('');
        onTaskUpdated && onTaskUpdated(res.task);
        addToast('Subtask added', 'success');
      }
    } catch (err) {
      addToast('Failed to add subtask', 'error');
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      const res = await taskService.deleteSubtask(task._id, subtaskId);
      if (res.success) {
        onTaskUpdated && onTaskUpdated(res.task);
      }
    } catch (err) {
      addToast('Failed to delete subtask', 'error');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await taskService.addComment(task._id, {
        content: newComment.trim(),
        user_id: user?._id || 'demo-user-1'
      });
      if (res.success) {
        setNewComment('');
        onTaskUpdated && onTaskUpdated(res.task);
        addToast('Comment added', 'success');
      }
    } catch (err) {
      addToast('Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-dark/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-card rounded-3xl border border-cyber/30 max-w-2xl w-full p-6 sm:p-8 shadow-glass relative max-h-[92vh] overflow-y-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-lg bg-cyber/15 text-cyber border border-cyber/30 uppercase">
              {task.status?.replace('_', ' ')}
            </span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-vibrant/15 text-vibrant border border-vibrant/30 uppercase">
              {task.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditTask && onEditTask(task);
              }}
              className="p-2 text-slate-400 hover:text-cyber rounded-xl hover:bg-white/10 transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onClose();
                onDeleteTask && onDeleteTask(task);
              }}
              className="p-2 text-slate-400 hover:text-status-danger rounded-xl hover:bg-white/10 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cover image if available */}
        {task.cover_image && (
          <div className="w-full h-40 rounded-2xl overflow-hidden mb-5">
            <img src={task.cover_image} alt={task.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title & Description */}
        <h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
          {task.title}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {task.description || 'No description provided.'}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-midnight/70 border border-cyber/15 mb-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assignee</span>
            <div className="flex items-center gap-1.5 mt-1 font-semibold text-white">
              <img
                src={task.assignee_id?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={task.assignee_id?.name || 'Unassigned'}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate">{task.assignee_id?.name || 'Unassigned'}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Due Date</span>
            <span className="font-semibold text-cyber block mt-1">
              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Created</span>
            <span className="font-semibold text-slate-300 block mt-1">
              {new Date(task.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Attachments</span>
            <span className="font-semibold text-white block mt-1 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-cyber" />
              {task.attachment_count || 0} Files
            </span>
          </div>
        </div>

        {/* Subtasks Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-cyber" />
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </h4>
            <span className="text-xs font-bold text-cyber">{progressPercent}%</span>
          </div>

          {totalSubtasks > 0 && (
            <div className="w-full bg-midnight rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-cyber h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Subtask items */}
          <div className="space-y-2 mb-3">
            {task.subtasks?.map((subtask) => (
              <div
                key={subtask._id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-midnight/50 border border-white/5 text-xs group"
              >
                <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask._id)}
                    className="w-4 h-4 rounded border-cyber/40 text-electric focus:ring-0 accent-cyber cursor-pointer"
                  />
                  <span className={subtask.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                    {subtask.title}
                  </span>
                </label>

                <button
                  onClick={() => handleDeleteSubtask(subtask._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-status-danger transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Subtask Input */}
          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              placeholder="Add a new subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-midnight border border-cyber/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-electric/20 text-cyber border border-cyber/30 rounded-xl text-xs font-bold hover:bg-electric hover:text-white transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div>
          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-electric" />
            Comments ({task.comments?.length || 0})
          </h4>

          {/* Comment list */}
          <div className="space-y-3 mb-4 max-h-56 overflow-y-auto pr-1">
            {task.comments?.map((comment, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-midnight/60 border border-white/5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <img
                      src={comment.user_id?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={comment.user_id?.name || 'User'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{comment.user_id?.name || 'Team Member'}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {new Date(comment.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 ml-7 leading-relaxed">{comment.content}</p>
              </div>
            ))}

            {(!task.comments || task.comments.length === 0) && (
              <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
            )}
          </div>

          {/* Add Comment Box */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber"
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="px-4 py-2 bg-electric hover:bg-electric-hover text-white rounded-xl text-xs font-bold shadow-blue-glow transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
