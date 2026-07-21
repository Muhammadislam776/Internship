import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="dashboard-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="chart-card" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="logo-icon" style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="white" />
              <path d="M12 8L6 20H18L12 8Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
          <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', margin: '5px 0 0' }}>Join WEIC Dash today</p>
        </div>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              placeholder="Enter your username" 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              placeholder="Create a password" 
              style={{ width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', fontSize: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" /> I agree to the <a href="#" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Terms of Service</a>
            </label>
          </div>
          
          <button style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Sign Up
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
