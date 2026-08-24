import React from 'react';
import { FiPlusCircle, FiTrendingUp, FiCheckCircle, FiShield, FiStar } from 'react-icons/fi';

const Hero = ({ onOpenCreateModal, onViewAnalytics }) => {
  return (
    <div className="gradient-border-card p-4 p-md-5 mb-4 position-relative overflow-hidden">
      
      {/* Dynamic Multi-Color Ambient Glow Blobs */}
      <div 
        className="position-absolute rounded-circle"
        style={{
          top: '-60px',
          right: '-40px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div 
        className="position-absolute rounded-circle"
        style={{
          bottom: '-60px',
          left: '20%',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.28) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />
      <div 
        className="position-absolute rounded-circle"
        style={{
          top: '20%',
          right: '35%',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
        <div className="col-lg-8">
          
          <h1 className="display-5 fw-extrabold mb-3 tracking-tight gradient-text">
            Welcome back, Developer
          </h1>
          
          <p className="lead text-secondary mb-4 fs-6 fw-bold" style={{ maxWidth: '640px', lineHeight: '1.65' }}>
            Turn your ideas into completed tasks and your code into confidence with real-time test verification.
          </p>

          <div className="d-flex flex-wrap gap-3">
            <button 
              onClick={onOpenCreateModal} 
              className="btn btn-gradient d-flex align-items-center gap-2.5 shadow-lg"
            >
              <FiPlusCircle size={20} />
              <span>Create New Task</span>
            </button>

            <button 
              onClick={onViewAnalytics} 
              className="btn btn-glass d-flex align-items-center gap-2.5"
            >
              <FiTrendingUp size={20} className="text-primary" />
              <span>View Analytics</span>
            </button>
          </div>

        </div>

        {/* Right Metric Quick Showcase Card */}
        <div className="col-lg-4 d-none d-lg-flex justify-content-end">
          <div className="glass-panel p-4 border border-light rounded-4 shadow-lg w-100" style={{ maxWidth: '310px' }}>
            
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div className="p-2.5 rounded-3 bg-success-subtle text-success shadow-xs">
                  <FiCheckCircle size={24} />
                </div>
                <div>
                  <div className="fs-7 text-muted fw-extrabold text-uppercase">Quality Index</div>
                  <div className="fw-extrabold fs-4 text-success gradient-text-emerald">98.4% Clean</div>
                </div>
              </div>
              <FiStar className="text-warning fill-warning" size={22} />
            </div>

            <div className="progress rounded-pill bg-secondary-subtle mb-3" style={{ height: '8px' }}>
              <div className="progress-bar bg-gradient-primary rounded-pill" style={{ width: '94%' }}></div>
            </div>

            <div className="d-flex align-items-center justify-content-between fs-7 text-muted pt-2 border-top border-secondary-subtle">
              <span className="d-flex align-items-center gap-1.5 fw-bold">
                <FiShield size={15} className="text-primary" />
                27 Tests Passed
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill fs-8 fw-extrabold px-2.5 py-1">
                Vitest Green
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default Hero;
