import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskModal from '../components/TaskModal.jsx';

describe('TaskForm / TaskModal Unit Tests', () => {
  it('renders input fields correctly', () => {
    render(
      <TaskModal 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );

    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('description-input')).toBeInTheDocument();
    expect(screen.getByTestId('priority-select')).toBeInTheDocument();
    expect(screen.getByTestId('status-select')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
  });

  it('allows user to enter task title and fields', () => {
    render(
      <TaskModal 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={() => {}} 
      />
    );

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Test Task Title' } });
    expect(titleInput.value).toBe('New Test Task Title');
  });

  it('submits form with entered data on valid submit', () => {
    const handleSubmit = vi.fn();
    render(
      <TaskModal 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={handleSubmit} 
      />
    );

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Valid Task' } });

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.calls[0][0].title).toBe('Valid Task');
  });

  it('shows validation error when task title is empty on submission', () => {
    const handleSubmit = vi.fn();
    render(
      <TaskModal 
        isOpen={true} 
        onClose={() => {}} 
        onSubmit={handleSubmit} 
      />
    );

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: '   ' } });

    const submitBtn = screen.getByTestId('submit-btn');
    fireEvent.click(submitBtn);

    expect(screen.getByTestId('validation-error')).toHaveTextContent('Task title is required');
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
