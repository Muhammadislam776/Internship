import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from '../pages/DashboardPage.jsx';

describe('Dashboard Page Unit Tests', () => {
  const mockStats = {
    totalTasks: 128,
    completed: 94,
    inProgress: 21,
    testCoverage: 92
  };

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Implement Authentication UI',
      description: 'Design responsive login screen.',
      priority: 'High',
      status: 'Completed',
      category: 'Frontend'
    }
  ];

  it('renders statistics cards values accurately', () => {
    render(
      <DashboardPage
        stats={mockStats}
        tasks={mockTasks}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
        onNavigateToTasks={() => {}}
        onNavigateToAnalytics={() => {}}
      />
    );

    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('94')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getAllByText('92%')[0]).toBeInTheDocument();
  });

  it('renders hero title and navigation call-to-actions', () => {
    const handleNavigateTasks = vi.fn();
    render(
      <DashboardPage
        stats={mockStats}
        tasks={mockTasks}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
        onNavigateToTasks={handleNavigateTasks}
        onNavigateToAnalytics={() => {}}
      />
    );

    expect(screen.getByText(/Welcome back, Developer/i)).toBeInTheDocument();
    
    const viewAllBtn = screen.getByText('View All');
    fireEvent.click(viewAllBtn);
    expect(handleNavigateTasks).toHaveBeenCalledTimes(1);
  });
});
