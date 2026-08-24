import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TaskList from '../components/TaskList.jsx';

describe('TaskList Component Unit Tests', () => {
  const sampleTasks = [
    {
      id: '1',
      title: 'Build Vitest Test Runner',
      description: 'Create frontend component tests.',
      priority: 'Critical',
      status: 'In Progress',
      category: 'Testing',
      dueDate: '2026-08-25'
    },
    {
      id: '2',
      title: 'Implement Express REST API',
      description: 'Setup Node.js routes and controllers.',
      priority: 'High',
      status: 'Completed',
      category: 'Backend',
      dueDate: '2026-08-24'
    }
  ];

  it('renders task items cleanly in grid view', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
      />
    );

    expect(screen.getByText('Build Vitest Test Runner')).toBeInTheDocument();
    expect(screen.getByText('Implement Express REST API')).toBeInTheDocument();
  });

  it('renders empty state illustration when task array is empty', () => {
    render(
      <TaskList
        tasks={[]}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
      />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('filters task items based on search query input', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
      />
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Express' } });

    expect(screen.getByText('Implement Express REST API')).toBeInTheDocument();
    expect(screen.queryByText('Build Vitest Test Runner')).not.toBeInTheDocument();
  });

  it('filters task items by status pills', () => {
    render(
      <TaskList
        tasks={sampleTasks}
        loading={false}
        onToggleComplete={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        onOpenCreateModal={() => {}}
      />
    );

    const completedFilterBtn = screen.getByTestId('filter-completed');
    fireEvent.click(completedFilterBtn);

    expect(screen.getByText('Implement Express REST API')).toBeInTheDocument();
    expect(screen.queryByText('Build Vitest Test Runner')).not.toBeInTheDocument();
  });
});
