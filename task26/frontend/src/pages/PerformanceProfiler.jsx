import React, { useState, useEffect } from 'react';
import { PerformanceService } from '../services/api';
import { useToast } from '../context/ToastContext';

const PerformanceProfiler = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const res = await PerformanceService.getPerformance();
      if (res.success) setData(res.data);
    } catch (err) {
      addToast('Failed to fetch performance stats', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
    const timer = setInterval(fetchPerformance, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">V8 Memory & Process Performance Telemetry</h2>
          <p className="text-secondary small mb-0">
            Node.js heap memory allocation, RSS consumption, and hardware specifications
          </p>
        </div>

        <button className="btn btn-sm btn-outline-info d-flex align-items-center gap-2" onClick={fetchPerformance}>
          <i className="bi bi-arrow-clockwise"></i>
          <span>Sample Telemetry</span>
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Heap Used</span>
            <h2 className="fw-bold text-cyan my-1 font-mono">{data?.memory?.heapUsed || '0 MB'}</h2>
            <span className="text-secondary small">Of {data?.memory?.heapTotal || '0 MB'} Total</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Process RSS</span>
            <h2 className="fw-bold text-primary my-1 font-mono">{data?.memory?.rss || '0 MB'}</h2>
            <span className="text-secondary small">Resident Set Size</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">V8 Heap Limit</span>
            <h2 className="fw-bold text-purple my-1 font-mono">{data?.v8Heap?.heapSizeLimit || '0 MB'}</h2>
            <span className="text-secondary small">V8 Engine Bound</span>
          </div>
        </div>

        <div className="col-12 col-md-3">
          <div className="card card-dark p-3 text-center">
            <span className="text-secondary small text-uppercase font-mono">Heap Used %</span>
            <h2 className="fw-bold text-success my-1 font-mono">{data?.v8Heap?.usedPercentage || '0.0%'}</h2>
            <span className="text-secondary small">Memory Allocation</span>
          </div>
        </div>
      </div>

      {/* Memory Breakdown Progress Section */}
      <div className="card card-dark p-4 mb-4">
        <h5 className="fw-semibold text-white mb-3">V8 Process Memory Allocation Breakdown</h5>

        <div className="mb-4">
          <div className="d-flex justify-content-between text-secondary small font-mono mb-2">
            <span>Heap Used vs Total Heap Allocation</span>
            <span>{data?.memory?.heapUsed} / {data?.memory?.heapTotal}</span>
          </div>
          <div className="progress bg-dark" style={{ height: '12px' }}>
            <div className="progress-bar bg-cyan" style={{ width: data?.v8Heap?.usedPercentage || '35%' }}></div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div className="p-3 bg-navy rounded-3 border border-secondary">
              <span className="text-secondary small text-uppercase font-mono">External Memory</span>
              <div className="fw-bold text-white font-mono fs-5">{data?.memory?.external || '0 MB'}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 bg-navy rounded-3 border border-secondary">
              <span className="text-secondary small text-uppercase font-mono">Array Buffers</span>
              <div className="fw-bold text-white font-mono fs-5">{data?.memory?.arrayBuffers || '0 MB'}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="p-3 bg-navy rounded-3 border border-secondary">
              <span className="text-secondary small text-uppercase font-mono">Process Uptime</span>
              <div className="fw-bold text-success font-mono fs-5">{data?.processUptimeSeconds || 0} seconds</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceProfiler;
