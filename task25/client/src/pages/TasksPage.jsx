import React from 'react';
import TaskList from '../components/TaskList.jsx';
import { FiCheckSquare, FiPlus } from 'react-icons/fi';

const TasksPage = ({ 
  tasks = [], 
  loading = false, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onOpenCreateModal 
}) => {
  return (
    <div className="py-2" data-testid="tasks-page">
      
      {/* Header Banner */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="p-2 rounded-3 bg-primary-subtle text-primary">
              <FiCheckSquare size={20} />
            </div>
            <h2 className="fw-extrabold text-primary m-0 tracking-tight">Task Management</h2>
          </div>
          <p className="text-secondary fs-6 m-0 ms-1">
            Plan, organize, and track your developer backlog with real-time status updates.
          </p>
        </div>

        <button 
          onClick={onOpenCreateModal} 
          className="btn btn-gradient d-flex align-items-center gap-2"
        >
          <FiPlus size={18} />
          <span>Create Task</span>
        </button>
      </div>

      {/* Task List Component */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpenCreateModal={onOpenCreateModal}
      />

    </div>
  );
};

export default TasksPage;
