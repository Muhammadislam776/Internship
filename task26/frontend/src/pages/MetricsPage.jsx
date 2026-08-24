import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricsPage = () => {
  const [activeTab, setActiveTab] = useState('TRAFFIC');

  const waveData = [
    { time: '00:00', requests: 12000, p95: 35, p99: 80, throughput: 0.6, errors: 0.01 },
    { time: '04:00', requests: 10500, p95: 32, p99: 75, throughput: 0.5, errors: 0.01 },
    { time: '08:00', requests: 18000, p95: 45, p99: 95, throughput: 0.9, errors: 0.03 },
    { time: '12:00', requests: 24592, p95: 42, p99: 115, throughput: 1.24, errors: 0.04 },
    { time: '16:00', requests: 21000, p95: 40, p99: 110, throughput: 1.1, errors: 0.02 },
    { time: '20:00', requests: 15000, p95: 36, p99: 88, throughput: 0.8, errors: 0.01 }
  ];

  const barData = [
    { name: '1', val: 0.01 },
    { name: '2', val: 0.01 },
    { name: '3', val: 0.02 },
    { name: '4', val: 0.08 },
    { name: '5', val: 0.03 },
    { name: '6', val: 0.02 },
    { name: '7', val: 0.01 },
    { name: '8', val: 0.02 },
    { name: '9', val: 0.01 }
  ];

  return (
    <div className="p-4">
      {/* Title */}
      <div className="mb-4">
        <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Performance Metrics</h1>
        <p className="text-secondary mb-0">Deep dive into API performance analytics</p>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="d-flex align-items-center gap-4 mb-4 border-bottom border-secondary pb-2">
        {['TRAFFIC', 'LATENCY', 'ERRORS', 'THROUGHPUT'].map(tab => (
          <button
            key={tab}
            className={`btn p-0 font-mono small fw-bold pb-2 ${activeTab === tab ? 'text-primary border-bottom border-primary border-2' : 'text-secondary border-0'}`}
            style={{ borderRadius: 0 }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 4 Cards Grid */}
      <div className="row g-4">
        
        {/* Card 1: REQUESTS / MIN */}
        <div className="col-12 col-md-6">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">REQUESTS / MIN</span>
              <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-30 font-mono">
                ↗ +12.4%
              </span>
            </div>

            <h2 className="fw-bold text-white font-mono mb-4" style={{ fontSize: '2.4rem' }}>24,592</h2>

            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waveData}>
                  <defs>
                    <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#1E293B', color: '#FFF' }} />
                  <Area type="monotone" dataKey="requests" stroke="#60A5FA" strokeWidth={3} fill="url(#reqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 2: LATENCY (P95 / P99) */}
        <div className="col-12 col-md-6">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">LATENCY (P95 / P99)</span>
              <div className="d-flex align-items-center gap-2 small font-mono text-secondary">
                <span>● P95</span>
                <span className="text-cyan">● P99</span>
              </div>
            </div>

            <div className="d-flex align-items-baseline gap-2 mb-4 font-mono">
              <h2 className="fw-bold text-white mb-0" style={{ fontSize: '2.4rem' }}>42ms</h2>
              <span className="text-secondary fs-5">/ 115ms</span>
            </div>

            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveData}>
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#1E293B', color: '#FFF' }} />
                  <Line type="monotone" dataKey="p95" stroke="#93C5FD" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="p99" stroke="#06B6D4" strokeWidth={2.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 3: ERROR RATE (5XX) */}
        <div className="col-12 col-md-6">
          <div className="card-devpulse p-4">
            <div className="mb-2">
              <span className="text-secondary small font-mono">ERROR RATE (5XX)</span>
            </div>

            <h2 className="fw-bold text-danger font-mono mb-4" style={{ fontSize: '2.4rem' }}>0.04%</h2>

            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar dataKey="val" fill="#881337" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Card 4: THROUGHPUT (GB/S) */}
        <div className="col-12 col-md-6">
          <div className="card-devpulse p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-secondary small font-mono">THROUGHPUT (GB/S)</span>
              <i className="bi bi-three-dots-vertical text-secondary"></i>
            </div>

            <h2 className="fw-bold text-white font-mono mb-4" style={{ fontSize: '2.4rem' }}>1.24 GB/s</h2>

            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waveData}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#1E293B', color: '#FFF' }} />
                  <Area type="monotone" dataKey="throughput" stroke="#A78BFA" strokeWidth={3} fill="url(#purpleGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MetricsPage;
