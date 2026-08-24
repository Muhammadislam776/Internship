import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard.jsx';

describe('TaskCard Component Unit Tests', () => {
  const mockTask = {
    id: 'task-101',
    title: 'Refactor Glassmorphism Design System',
    description: 'Apply light translucent backdrop blurs and cyan highlights.',
    priority: 'Critical',
    status: 'In Progress',
    category: 'UI/UX',
    dueDate: '2026-08-28',
    createdAt: '2026-08-18T00:00:00.000Z'
  };

  it('renders the task title correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggleComplete={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    expect(screen.getByTestId('task-title')).toHaveTextContent('Refactor Glassmorphism Design System');
  });

  it('renders priority badge correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggleComplete={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    expect(screen.getByTestId('task-priority')).toHaveTextContent('Critical');
  });

  it('renders status badge correctly', () => {
    render(
      <TaskCard 
        task={mockTask} 
        onToggleComplete={() => {}} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    expect(screen.getByTestId('task-status')).toHaveTextContent('In Progress');
  });

  it('triggers onToggleComplete handler when complete button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <TaskCard 
        task={mockTask} 
        onToggleComplete={handleToggle} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );
    const completeBtn = screen.getByTestId('complete-btn');
    fireEvent.click(completeBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockTask);
  });

  it('triggers onDelete handler when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(
      <TaskCard 
        task={mockTask} 
        onToggleComplete={() => {}} 
        onEdit={() => {}} 
        onDelete={handleDelete} 
      />
    );
    const deleteBtn = screen.getByTestId('delete-btn');
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('task-101');
  });
});
