import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

const TaskModal = ({ isOpen, onClose, onSubmit, initialTask = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    category: 'Frontend',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || 'Todo',
        category: initialTask.category || 'Frontend',
        dueDate: initialTask.dueDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        category: 'Frontend',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" data-testid="task-modal-overlay">
      <div 
        className="glass-panel p-4 rounded-4 shadow-lg w-100" 
        style={{ maxWidth: '580px', animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        data-testid="task-modal"
      >
        
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary-subtle">
          <h4 className="fw-bold text-primary m-0">
            {initialTask ? 'Edit Task' : 'Create New Task'}
          </h4>
          <button 
            onClick={onClose} 
            className="btn btn-glass p-2 rounded-3 border-0"
            aria-label="Close modal"
            data-testid="close-modal-btn"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} data-testid="task-form">
          
          {error && (
            <div 
              className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 mb-3 rounded-3"
              data-testid="validation-error"
            >
              <FiAlertCircle size={18} />
              <span className="fs-7 fw-semibold">{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="mb-3">
            <label className="form-label fs-7 fw-bold text-secondary">Task Title *</label>
            <input
              type="text"
              name="title"
              className="form-control form-control-glass"
              placeholder="e.g. Implement Responsive Dashboard Header"
              value={formData.title}
              onChange={handleChange}
              data-testid="title-input"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label fs-7 fw-bold text-secondary">Description</label>
            <textarea
              name="description"
              rows={3}
              className="form-control form-control-glass"
              placeholder="Provide context or instructions for completing this task..."
              value={formData.description}
              onChange={handleChange}
              data-testid="description-input"
            />
          </div>

          {/* Row: Priority & Status */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6">
              <label className="form-label fs-7 fw-bold text-secondary">Priority</label>
              <select
                name="priority"
                className="form-select form-select-glass"
                value={formData.priority}
                onChange={handleChange}
                data-testid="priority-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="col-12 col-sm-6">
              <label className="form-label fs-7 fw-bold text-secondary">Status</label>
              <select
                name="status"
                className="form-select form-select-glass"
                value={formData.status}
                onChange={handleChange}
                data-testid="status-select"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Row: Category & Due Date */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6">
              <label className="form-label fs-7 fw-bold text-secondary">Category</label>
              <select
                name="category"
                className="form-select form-select-glass"
                value={formData.category}
                onChange={handleChange}
                data-testid="category-select"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Testing">Testing</option>
                <option value="DevOps">DevOps</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Documentation">Documentation</option>
              </select>
            </div>

            <div className="col-12 col-sm-6">
              <label className="form-label fs-7 fw-bold text-secondary">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="form-control form-control-glass"
                value={formData.dueDate}
                onChange={handleChange}
                data-testid="duedate-input"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="d-flex align-items-center justify-content-end gap-2 pt-3 border-top border-secondary-subtle">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-glass px-4"
              data-testid="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-gradient px-4 d-flex align-items-center gap-1.5"
              data-testid="submit-btn"
            >
              <FiCheck size={18} />
              <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default TaskModal;
