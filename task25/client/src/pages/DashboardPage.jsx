import React from 'react';
import Hero from '../components/Hero.jsx';
import StatsCards from '../components/StatsCards.jsx';
import TaskCard from '../components/TaskCard.jsx';
import Counter from '../components/Counter.jsx';
import { FiArrowRight, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

const DashboardPage = ({ 
  stats, 
  tasks = [], 
  loading, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onOpenCreateModal, 
  onNavigateToTasks, 
  onNavigateToAnalytics 
}) => {
  const recentTasks = tasks.slice(0, 3);

  return (
    <div className="py-2" data-testid="dashboard-page">
      
      {/* Hero Header */}
      <Hero 
        onOpenCreateModal={onOpenCreateModal} 
        onViewAnalytics={onNavigateToAnalytics} 
      />

      {/* 4 Premium Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid: Recent Tasks & Right Widgets */}
      <div className="row g-4 mb-4">
        
        {/* Left Column: Recent Tasks */}
        <div className="col-12 col-lg-8">
          <div className="glass-panel p-4 h-100 rounded-4">
            
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary-subtle">
              <div>
                <h5 className="fw-bold text-primary mb-1">Recent Tasks</h5>
                <p className="fs-7 text-secondary m-0">Latest backlog items and active assignments</p>
              </div>
              <button 
                onClick={onNavigateToTasks} 
                className="btn btn-glass btn-sm d-flex align-items-center gap-1 text-primary"
              >
                <span>View All</span>
                <FiArrowRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="row g-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="col-12 col-md-6">
                    <div className="skeleton-box p-4" style={{ height: '180px' }}></div>
                  </div>
                ))}
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center py-4 text-muted fs-7">
                No recent tasks found.
              </div>
            ) : (
              <div className="row g-3">
                {recentTasks.map(task => (
                  <div key={task.id} className="col-12 col-md-6">
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
        </div>

        {/* Right Column: Counter Component & Quick Activity */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          
          {/* Vitest Tested Counter Component */}
          <Counter initialValue={5} />

          {/* Productivity Snapshot */}
          <div className="glass-panel p-4 rounded-4 flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-3">
              <FiActivity className="text-primary" size={20} />
              <h6 className="fw-bold text-primary m-0">Weekly Productivity</h6>
            </div>

            <div className="d-flex flex-column gap-3 fs-7">
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary fw-semibold">Sprint Tasks Target</span>
                  <span className="fw-bold text-primary">85%</span>
                </div>
                <div className="progress rounded-pill bg-secondary-subtle" style={{ height: '8px' }}>
                  <div className="progress-bar bg-gradient-primary rounded-pill" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary fw-semibold">Code Review Speed</span>
                  <span className="fw-bold text-success">92%</span>
                </div>
                <div className="progress rounded-pill bg-secondary-subtle" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success rounded-pill" style={{ width: '92%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary fw-semibold">Test Automation Pass Rate</span>
                  <span className="fw-bold text-info">100%</span>
                </div>
                <div className="progress rounded-pill bg-secondary-subtle" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info rounded-pill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-3 bg-primary-subtle border border-primary-subtle d-flex align-items-center gap-2">
              <FiCheckCircle className="text-primary flex-shrink-0" size={18} />
              <span className="fs-7 fw-semibold text-primary">All 27 Vitest & Supertest specifications are green.</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
