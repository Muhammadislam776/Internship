import React from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiTag, 
  FiAlertCircle 
} from 'react-icons/fi';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 rounded-pill" data-testid="task-priority"><span className="priority-indicator priority-critical"></span>Critical</span>;
      case 'High':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 rounded-pill" data-testid="task-priority"><span className="priority-indicator priority-high"></span>High</span>;
      case 'Medium':
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 rounded-pill" data-testid="task-priority"><span className="priority-indicator priority-medium"></span>Medium</span>;
      default:
        return <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill" data-testid="task-priority"><span className="priority-indicator priority-low"></span>Low</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge-status badge-completed" data-testid="task-status">Completed</span>;
      case 'In Progress':
        return <span className="badge-status badge-progress" data-testid="task-status">In Progress</span>;
      default:
        return <span className="badge-status badge-todo" data-testid="task-status">Todo</span>;
    }
  };

  return (
    <div className={`glass-panel glass-panel-hover p-4 h-100 d-flex flex-column justify-content-between ${isCompleted ? 'opacity-85' : ''}`} data-testid="task-card">
      
      {/* Top Header Row */}
      <div>
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
          <div className="d-flex align-items-center gap-1">
            <span className="badge bg-body-tertiary text-secondary border px-2 py-1 rounded-3 fs-7 d-flex align-items-center gap-1">
              <FiTag size={12} />
              {task.category || 'General'}
            </span>
          </div>
        </div>

        {/* Task Title */}
        <h5 
          className={`fw-bold text-primary mb-2 mt-2 ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}
          data-testid="task-title"
        >
          {task.title}
        </h5>

        {/* Description */}
        <p className="fs-7 text-secondary mb-3 line-clamp-2">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div>
        <div className="d-flex align-items-center justify-content-between fs-7 text-muted pt-3 border-top border-secondary-subtle mb-3">
          <div className="d-flex align-items-center gap-1">
            <FiCalendar size={14} className="text-secondary" />
            <span>Due: {task.dueDate || 'No date'}</span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <FiClock size={14} className="text-secondary" />
            <span>{new Date(task.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex align-items-center justify-content-between gap-2">
          <button
            onClick={() => onToggleComplete(task)}
            className={`btn btn-sm ${isCompleted ? 'btn-outline-secondary' : 'btn-success'} d-flex align-items-center gap-1.5 rounded-3 px-3`}
            data-testid="complete-btn"
            title={isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
          >
            <FiCheckCircle size={15} />
            <span>{isCompleted ? 'Completed' : 'Complete'}</span>
          </button>

          <div className="d-flex align-items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="btn btn-sm btn-glass p-2 rounded-3 text-secondary"
              data-testid="edit-btn"
              title="Edit Task"
            >
              <FiEdit2 size={15} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-sm btn-glass p-2 rounded-3 text-danger"
              data-testid="delete-btn"
              title="Delete Task"
            >
              <FiTrash2 size={15} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TaskCard;
