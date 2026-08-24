import React, { useState } from 'react';
import { FiPlus, FiMinus, FiRotateCcw } from 'react-icons/fi';

const Counter = ({ initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  return (
    <div className="glass-panel p-4 rounded-4 text-center" data-testid="counter-component">
      <h6 className="text-secondary fw-bold text-uppercase tracking-wider mb-2">Unit Test Component Showcase</h6>
      <div className="display-4 fw-extrabold text-primary mb-3" data-testid="count-value">
        {count}
      </div>
      <div className="d-flex align-items-center justify-content-center gap-2">
        <button 
          onClick={() => setCount(c => c - 1)}
          className="btn btn-glass p-2 rounded-3 text-secondary"
          data-testid="decrement-btn"
          title="Decrement"
        >
          <FiMinus size={18} />
        </button>
        <button 
          onClick={() => setCount(0)}
          className="btn btn-glass p-2 rounded-3 text-muted"
          data-testid="reset-btn"
          title="Reset"
        >
          <FiRotateCcw size={16} />
        </button>
        <button 
          onClick={() => setCount(c => c + 1)}
          className="btn btn-gradient p-2 rounded-3"
          data-testid="increment-btn"
          title="Increment"
        >
          <FiPlus size={18} />
        </button>
      </div>
    </div>
  );
};

export default Counter;
