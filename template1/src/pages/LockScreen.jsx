import React from 'react';
import { Link } from 'react-router-dom';

const LockScreen = () => {
  return (
    <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="chart-card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ marginBottom: '30px' }}>
          <div className="logo-icon" style={{ margin: '0 auto 15px', width: '60px', height: '60px', fontSize: '30px' }}>M</div>
          <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Locked</h2>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>Enter your password to unlock the screen</p>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <input 
              type="password" 
              placeholder="Password" 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <button style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px' }}>
            Unlock
          </button>
        </form>
        
        <div style={{ fontSize: '14px' }}>
          Not you? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
