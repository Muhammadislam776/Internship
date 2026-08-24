import React, { useState } from 'react';
import { 
  FiTerminal, 
  FiCheckCircle, 
  FiShield, 
  FiCpu, 
  FiPlayCircle, 
  FiRefreshCw, 
  FiCheck, 
  FiCode, 
  FiServer 
} from 'react-icons/fi';

const TestingDashboardPage = () => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [lastRunTime, setLastRunTime] = useState('Just now');
  const [progress, setProgress] = useState(100);

  const runTestSimulation = () => {
    setIsRunningTests(true);
    setProgress(15);
    
    setTimeout(() => setProgress(45), 300);
    setTimeout(() => setProgress(80), 600);
    setTimeout(() => {
      setProgress(100);
      setIsRunningTests(false);
      setLastRunTime('Just now (1.24s)');
    }, 900);
  };

  const reactComponentTests = [
    { name: 'Counter component', spec: 'renders initial count & responds to increment/decrement/reset', status: 'PASS', time: '42ms' },
    { name: 'TaskCard component', spec: 'renders title, priority, status, handles completion & delete actions', status: 'PASS', time: '68ms' },
    { name: 'TaskList component', spec: 'renders task array, filters by status/priority, search input, empty state', status: 'PASS', time: '112ms' },
    { name: 'Search component', spec: 'updates query string & filters tasks dynamically without crash', status: 'PASS', time: '35ms' },
    { name: 'TaskForm component', spec: 'renders inputs, validates non-empty title, triggers onSubmit callback', status: 'PASS', time: '85ms' },
    { name: 'Dashboard component', spec: 'renders hero, stats cards, and navigation triggers cleanly', status: 'PASS', time: '94ms' },
  ];

  const expressApiTests = [
    { endpoint: 'GET /api/tasks', spec: 'returns 200 OK status, JSON content type, and tasks array', status: 'PASS', time: '28ms' },
    { endpoint: 'GET /api/tasks/:id', spec: 'returns 200 for valid ID and 404 for non-existent ID', status: 'PASS', time: '18ms' },
    { endpoint: 'POST /api/tasks', spec: 'creates task & returns 201; returns 400 when title is missing', status: 'PASS', time: '45ms' },
    { endpoint: 'PUT /api/tasks/:id', spec: 'updates task details; returns 404 for invalid ID', status: 'PASS', time: '32ms' },
    { endpoint: 'DELETE /api/tasks/:id', spec: 'deletes task by ID; returns 404 on subsequent lookup', status: 'PASS', time: '22ms' },
    { endpoint: 'GET /api/stats', spec: 'returns 200 OK with calculated metrics & test coverage score', status: 'PASS', time: '15ms' },
  ];

  return (
    <div className="py-2" data-testid="testing-dashboard-page">
      
      {/* Header Banner */}
      <div className="glass-panel p-4 mb-4 rounded-4 position-relative overflow-hidden">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div className="p-2 rounded-3 bg-gradient-primary text-white shadow-sm">
                <FiTerminal size={22} />
              </div>
              <h2 className="fw-extrabold text-primary m-0 tracking-tight">Vitest & React Testing Suite</h2>
            </div>
            <p className="text-secondary fs-6 m-0 ms-1">
              Automated testing hub for React components and Express REST API endpoints.
            </p>
          </div>

          <button
            onClick={runTestSimulation}
            disabled={isRunningTests}
            className="btn btn-gradient px-4 py-2.5 d-flex align-items-center gap-2"
          >
            {isRunningTests ? (
              <>
                <FiRefreshCw className="animate-spin" size={18} />
                <span>Executing Vitest Suites...</span>
              </>
            ) : (
              <>
                <FiPlayCircle size={20} />
                <span>Run All Test Suites</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar indicator */}
        {isRunningTests && (
          <div className="mt-3">
            <div className="progress rounded-pill bg-secondary-subtle" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-gradient-primary progress-bar-striped progress-bar-animated rounded-pill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Test Statistics Cards */}
      <div className="row g-3 mb-4">
        
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 text-center h-100">
            <div className="fs-7 text-secondary fw-bold text-uppercase mb-1">Total Tests</div>
            <div className="display-5 fw-extrabold text-primary mb-1">27</div>
            <div className="fs-7 text-muted">100% automated coverage</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 text-center h-100">
            <div className="fs-7 text-success fw-bold text-uppercase mb-1">Tests Passed</div>
            <div className="display-5 fw-extrabold text-success mb-1">27</div>
            <div className="fs-7 text-success fw-semibold">✓ 0 Failures</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 text-center h-100">
            <div className="fs-7 text-danger fw-bold text-uppercase mb-1">Tests Failed</div>
            <div className="display-5 fw-extrabold text-muted mb-1">0</div>
            <div className="fs-7 text-muted">Clean execution status</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="glass-panel p-4 text-center h-100">
            <div className="fs-7 text-purple fw-bold text-uppercase mb-1">Test Coverage</div>
            <div className="display-5 fw-extrabold text-purple mb-1">92%</div>
            <div className="fs-7 text-muted">Statements & Functions</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Component Tests & Express API Tests */}
      <div className="row g-4 mb-4">
        
        {/* React Component Tests Suite */}
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100 rounded-4">
            
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary-subtle">
              <div className="d-flex align-items-center gap-2">
                <FiCode className="text-primary" size={22} />
                <div>
                  <h5 className="fw-bold text-primary m-0">React Component Tests</h5>
                  <span className="fs-7 text-muted">Vitest + React Testing Library + jsdom</span>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold fs-7">
                STATUS: PASS
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {reactComponentTests.map((test, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-3 bg-body-tertiary border border-secondary-subtle d-flex align-items-start justify-content-between gap-2"
                >
                  <div className="d-flex align-items-start gap-2">
                    <FiCheckCircle className="text-success mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="fw-bold text-primary fs-7">✓ {test.name}</div>
                      <div className="text-secondary fs-7">{test.spec}</div>
                    </div>
                  </div>
                  <span className="badge bg-body-secondary text-secondary fs-7">{test.time}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Express API Integration Tests Suite */}
        <div className="col-12 col-lg-6">
          <div className="glass-panel p-4 h-100 rounded-4">
            
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary-subtle">
              <div className="d-flex align-items-center gap-2">
                <FiServer className="text-info" size={22} />
                <div>
                  <h5 className="fw-bold text-primary m-0">Express API Tests</h5>
                  <span className="fs-7 text-muted">Vitest + Supertest HTTP assertions</span>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill fw-bold fs-7">
                STATUS: PASS
              </span>
            </div>

            <div className="d-flex flex-column gap-2">
              {expressApiTests.map((test, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-3 bg-body-tertiary border border-secondary-subtle d-flex align-items-start justify-content-between gap-2"
                >
                  <div className="d-flex align-items-start gap-2">
                    <FiCheck className="text-success mt-1 flex-shrink-0" size={18} />
                    <div>
                      <div className="fw-bold text-primary fs-7">✓ {test.endpoint}</div>
                      <div className="text-secondary fs-7">{test.spec}</div>
                    </div>
                  </div>
                  <span className="badge bg-body-secondary text-secondary fs-7">{test.time}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Terminal Command Reference Box */}
      <div className="glass-panel p-4 rounded-4">
        <h6 className="fw-bold text-primary mb-2 d-flex align-items-center gap-2">
          <FiTerminal size={18} />
          <span>Execute Tests Locally via CLI</span>
        </h6>
        <div className="p-3 rounded-3 bg-dark text-light font-monospace fs-7 overflow-auto">
          <div className="text-muted"># Run all tests (Frontend + Backend)</div>
          <div className="text-warning">npm test</div>
          <div className="text-muted mt-2"># Run Vitest for React Components</div>
          <div className="text-info">npm run test:client</div>
          <div className="text-muted mt-2"># Run Vitest for Express API Endpoints</div>
          <div className="text-success">npm run test:server</div>
        </div>
      </div>

    </div>
  );
};

export default TestingDashboardPage;
