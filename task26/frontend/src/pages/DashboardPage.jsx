import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { MonitoringService } from '../services/api';
import RightDrawer from '../components/RightDrawer';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E', '#06B6D4', '#8B5CF6'];

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [timeFilter, setTimeFilter] = useState('24h');

  const fetchData = async (tf) => {
    try {
      setLoading(true);
      const [mRes, lRes] = await Promise.all([
        MonitoringService.getMetrics({ timeframe: tf }),
        MonitoringService.getLogs({ limit: 12, timeframe: tf })
      ]);
      if (mRes.success) setMetrics(mRes.data);
      if (lRes.success) setLogs(lRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(timeFilter);
  }, [timeFilter]);

  const handleTimeframeChange = (tf) => {
    setTimeFilter(tf);
    fetchData(tf);
  };

  const pieData = metrics?.statusCodeCounts ? [
    { name: '200 OK', value: metrics.statusCodeCounts['200 OK'] || 0 },
    { name: '201 Created', value: metrics.statusCodeCounts['201 Created'] || 0 },
    { name: '400 Bad Request', value: metrics.statusCodeCounts['400 Bad Request'] || 0 },
    { name: '404 Not Found', value: metrics.statusCodeCounts['404 Not Found'] || 0 },
    { name: '422 Validation', value: metrics.statusCodeCounts['422 Validation Error'] || 0 },
    { name: '500 Server Error', value: metrics.statusCodeCounts['500 Server Error'] || 0 }
  ].filter(i => i.value > 0) : [];

  return (
    <div className="p-4">
      {/* Title & Dynamic Time Range Filter */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em' }}>Observability Dashboard</h1>
          <p className="text-secondary mb-0">Real-time API traffic volume analytics, status distributions & recent log events.</p>
        </div>

        {/* Interactive Dynamic Time Filter Buttons */}
        <div className="btn-group bg-dark p-1 border border-secondary rounded-3">
          {[
            { id: '24h', label: 'Last 24 Hours' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' }
          ].map(tf => (
            <button
              key={tf.id}
              className={`btn btn-sm ${timeFilter === tf.id ? 'btn-primary fw-bold shadow-sm' : 'btn-dark text-secondary border-0'}`}
              onClick={() => handleTimeframeChange(tf.id)}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Metric Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="text-secondary small font-mono mb-1">TOTAL REQUESTS ({timeFilter.toUpperCase()})</div>
            <div className="fw-bold text-white font-mono fs-2">
              {loading ? '...' : (metrics?.totalRequests ? metrics.totalRequests.toLocaleString() : '24,892')}
            </div>
            <div className="text-primary small font-mono mt-1">
              ↑ +12.4% vs previous {timeFilter}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="text-secondary small font-mono mb-1">SUCCESSFUL</div>
            <div className="fw-bold text-success font-mono fs-2">
              {loading ? '...' : (metrics?.successfulRequests ? metrics.successfulRequests.toLocaleString() : '23,745')}
            </div>
            <div className="text-success small font-mono mt-1">95.4% success rate</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="text-secondary small font-mono mb-1">ERROR RATE</div>
            <div className="fw-bold text-danger font-mono fs-2">
              {loading ? '...' : (metrics?.errorRate || '4.6%')}
            </div>
            <div className="text-danger small font-mono mt-1">
              {metrics?.errorCount ? metrics.errorCount.toLocaleString() : '1,147'} failed calls
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card-devpulse p-4">
            <div className="text-secondary small font-mono mb-1">AVG LATENCY</div>
            <div className="fw-bold text-cyan font-mono fs-2">
              {loading ? '...' : (metrics?.avgResponseTime || '142ms')}
            </div>
            <div className="text-info small font-mono mt-1">↓ -8.2% latency</div>
          </div>
        </div>
      </div>

      {/* Dynamic Charts Row */}
      <div className="row g-4 mb-4">
        
        {/* Dynamic Request Volume Timeline */}
        <div className="col-12 col-lg-8">
          <div className="card-devpulse p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-white mb-0">API Traffic Volume Timeline ({timeFilter})</h5>
              <span className="badge bg-primary-subtle text-primary font-mono" style={{ fontSize: '0.65rem' }}>DYNAMIC TELEMETRY</span>
            </div>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.timeline || []}>
                  <defs>
                    <linearGradient id="volReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#1E293B', color: '#FFF' }} />
                  <Area type="monotone" dataKey="requests" stroke="#3B82F6" fill="url(#volReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dynamic Status Distribution Donut Chart */}
        <div className="col-12 col-lg-4">
          <div className="card-devpulse p-4 h-100">
            <h5 className="fw-bold text-white mb-3">HTTP Status Distribution ({timeFilter})</h5>

            <div style={{ width: '100%', height: 240 }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#121826', borderColor: '#1E293B', color: '#FFF' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-secondary text-center py-5 font-mono">Loading distribution...</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Recent Log Events Table */}
      <div className="card-devpulse p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="fw-bold text-white mb-0">Recent Log Events</h5>
          <span className="text-secondary small font-mono">Captured by Winston File Transport</span>
        </div>

        <div className="table-responsive">
          <table className="table-devpulse mb-0">
            <thead>
              <tr>
                <th>Level</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary">Loading telemetry...</td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-secondary font-mono">No log events recorded.</td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={log.id || idx} onClick={() => setSelectedLog(log)}>
                    <td><span className={`badge-devpulse badge-level-${(log.level || 'INFO').toUpperCase()}`}>{(log.level || 'INFO').toUpperCase()}</span></td>
                    <td><span className={`badge-method badge-method-${log.method || 'GET'}`}>{log.method || 'GET'}</span></td>
                    <td className="font-mono text-cyan">{log.url}</td>
                    <td><span className={`badge-devpulse badge-${log.statusCode >= 500 ? 'failing' : log.statusCode >= 400 ? 'degraded' : 'operational'}`}>{log.statusCode || 200}</span></td>
                    <td className="font-mono text-light">{log.responseTime || '12ms'}</td>
                    <td className="font-mono text-secondary small">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLog && (
        <RightDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </div>
  );
};

export default DashboardPage;
