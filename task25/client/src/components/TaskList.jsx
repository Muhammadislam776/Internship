import React, { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiInbox, 
  FiArrowUp, 
  FiArrowDown, 
  FiLayers 
} from 'react-icons/fi';

const TaskList = ({ 
  tasks = [], 
  loading = false, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onOpenCreateModal 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Filter options
  const filterTabs = [
    { id: 'All', label: 'All Tasks' },
    { id: 'Todo', label: 'Todo' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
    { id: 'High', label: 'High Priority' },
    { id: 'Critical', label: 'Critical Priority' },
  ];

  // Extract unique categories
  const categories = ['All', ...new Set(tasks.map(t => t.category).filter(Boolean))];

  // Filter tasks logic
  const filteredTasks = tasks.filter(task => {
    // Search match
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter match
    let matchesFilter = true;
    if (activeFilter === 'Todo') matchesFilter = task.status === 'Todo';
    else if (activeFilter === 'In Progress') matchesFilter = task.status === 'In Progress';
    else if (activeFilter === 'Completed') matchesFilter = task.status === 'Completed';
    else if (activeFilter === 'High') matchesFilter = task.priority === 'High';
    else if (activeFilter === 'Critical') matchesFilter = task.priority === 'Critical';

    // Category match
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Sort tasks logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (sortBy === 'dueDate') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="w-100" data-testid="task-list-container">
      
      {/* Search & Filter Header Bar */}
      <div className="glass-panel p-3 mb-4 rounded-4">
        <div className="row g-3 align-items-center">
          
          {/* Search Input */}
          <div className="col-12 col-md-5 col-lg-6">
            <div className="position-relative">
              <FiSearch 
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" 
                size={18} 
              />
              <input
                type="text"
                className="form-control form-control-glass ps-5"
                placeholder="Search tasks by title, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="search-input"
              />
              {searchQuery && (
                <button
                  className="btn btn-sm btn-link text-muted position-absolute top-50 end-0 translate-middle-y text-decoration-none me-2"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-6 col-md-3 col-lg-3">
            <select
              className="form-select form-select-glass"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              data-testid="category-filter"
            >
              <option value="All">All Categories</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="col-6 col-md-4 col-lg-3">
            <select
              className="form-select form-select-glass"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              data-testid="sort-select"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="oldest">Sort by: Oldest First</option>
              <option value="dueDate">Sort by: Due Date</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Filter Pills Navigation */}
        <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-secondary-subtle overflow-auto pb-1">
          <span className="fs-7 text-muted fw-bold d-flex align-items-center gap-1 me-2 ms-1">
            <FiFilter size={14} /> Filter:
          </span>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold text-nowrap transition-all ${
                  isActive 
                    ? 'btn-primary bg-gradient-primary border-0 shadow-sm' 
                    : 'btn-glass text-secondary'
                }`}
                data-testid={`filter-${tab.id.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Counter summary bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 px-1">
        <div className="fs-7 text-secondary fw-semibold">
          Showing <span className="text-primary fw-bold">{sortedTasks.length}</span> of {tasks.length} tasks
        </div>
        <button 
          onClick={onOpenCreateModal}
          className="btn btn-sm btn-gradient d-flex align-items-center gap-1.5"
        >
          <FiPlus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Skeleton Loading State */}
      {loading ? (
        <div className="row g-3" data-testid="task-skeleton-loader">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="col-12 col-md-6 col-lg-4">
              <div className="glass-panel p-4 h-100">
                <div className="skeleton-box mb-3" style={{ height: '20px', width: '60%' }}></div>
                <div className="skeleton-box mb-2" style={{ height: '24px', width: '90%' }}></div>
                <div className="skeleton-box mb-4" style={{ height: '16px', width: '100%' }}></div>
                <div className="skeleton-box" style={{ height: '36px', width: '100%' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : sortedTasks.length === 0 ? (
        /* Empty State */
        <div 
          className="glass-panel p-5 text-center my-4 rounded-4 d-flex flex-column align-items-center justify-content-center"
          data-testid="empty-state"
        >
          <div className="p-4 rounded-circle bg-primary-subtle text-primary mb-3 shadow-sm">
            <FiInbox size={48} />
          </div>
          <h4 className="fw-bold text-primary mb-2">No tasks found</h4>
          <p className="text-secondary fs-6 mb-4" style={{ maxWidth: '420px' }}>
            {searchQuery || activeFilter !== 'All' || selectedCategory !== 'All' 
              ? 'No tasks match your current filter or search criteria. Try adjusting your filters.'
              : 'Create your first task to get started.'}
          </p>
          <button 
            onClick={onOpenCreateModal} 
            className="btn btn-gradient px-4 py-2 d-flex align-items-center gap-2"
          >
            <FiPlus size={18} />
            <span>Create New Task</span>
          </button>
        </div>
      ) : (
        /* Task Cards Grid */
        <div className="row g-3" data-testid="task-grid">
          {sortedTasks.map(task => (
            <div key={task.id} className="col-12 col-md-6 col-lg-4">
              <TaskCard
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TaskList;
