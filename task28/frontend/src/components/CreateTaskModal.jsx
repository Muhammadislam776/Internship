import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, Image, User, Layers, AlertCircle } from 'lucide-react';
import { taskService } from '../services/taskService';
import { useToast } from '../context/ToastContext';

const CreateTaskModal = ({ isOpen, onClose, projects = [], users = [], defaultStatus = 'TODO', onTaskCreated }) => {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: projects[0]?._id || '',
    status: defaultStatus,
    priority: 'MEDIUM',
    assignee_id: users[0]?._id || '',
    due_date: '',
    cover_image: '',
    tags: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Task title is required', 'warning');
      return;
    }

    const projectId = formData.project_id || (projects[0]?._id || null);
    if (!projectId) {
      addToast('Please select a project for this task', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        project_id: projectId,
        tags: formData.tags
          ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
          : []
      };

      const res = await taskService.createTask(payload);
      if (res.success) {
        addToast('Task created successfully!', 'success');
        onTaskCreated && onTaskCreated(res.task);
        onClose();
      }
    } catch (err) {
      console.error('Create Task Error:', err);
      addToast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-dark/80 backdrop-blur-xl animate-fade-in">
      <div className="glass-card rounded-3xl border border-cyber/30 max-w-xl w-full p-6 sm:p-8 shadow-glass relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-vibrant/20 text-vibrant border border-vibrant/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Create New Task</h2>
              <p className="text-xs text-slate-400">Add deliverable to project pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement @dnd-kit Drag and Drop Engine"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-midnight border border-cyber/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Provide context and requirements..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-midnight border border-cyber/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber focus:ring-1 focus:ring-cyber"
            />
          </div>

          {/* Grid Row: Project & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Project *</label>
              <select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Column Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              >
                <option value="BACKLOG">BACKLOG</option>
                <option value="TODO">TO DO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
          </div>

          {/* Grid Row: Priority & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Assignee</label>
              <select
                value={formData.assignee_id}
                onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Row: Due Date & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="Frontend, React, Design"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              className="w-full px-3 py-2 bg-midnight border border-cyber/20 rounded-xl text-xs text-white focus:outline-none focus:border-cyber"
            />
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white text-xs font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-vibrant to-amber-500 hover:from-vibrant-hover hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-orange-glow transition-all"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
