import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Counter from '../components/Counter.jsx';

describe('Counter Component Unit Tests', () => {
  it('renders initial count value correctly', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('count-value')).toHaveTextContent('5');
  });

  it('increments count when increment button is clicked', () => {
    render(<Counter initialValue={0} />);
    const incBtn = screen.getByTestId('increment-btn');
    fireEvent.click(incBtn);
    expect(screen.getByTestId('count-value')).toHaveTextContent('1');
  });

  it('decrements count when decrement button is clicked', () => {
    render(<Counter initialValue={10} />);
    const decBtn = screen.getByTestId('decrement-btn');
    fireEvent.click(decBtn);
    expect(screen.getByTestId('count-value')).toHaveTextContent('9');
  });

  it('resets count to 0 when reset button is clicked', () => {
    render(<Counter initialValue={42} />);
    const resetBtn = screen.getByTestId('reset-btn');
    fireEvent.click(resetBtn);
    expect(screen.getByTestId('count-value')).toHaveTextContent('0');
  });
});
